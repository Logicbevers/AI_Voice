import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/workspaces/[id]/members - List workspace members
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is a member
        const member = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: session.user.id,
                    workspaceId: params.id,
                },
            },
        });

        if (!member) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const members = await prisma.workspaceMember.findMany({
            where: {
                workspaceId: params.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json({ members });
    } catch (error) {
        console.error("Error fetching members:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/workspaces/[id]/members - Add member to workspace
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is owner
        const member = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: session.user.id,
                    workspaceId: params.id,
                },
            },
        });

        if (!member || member.role !== "owner") {
            return NextResponse.json(
                { error: "Only workspace owners can invite members" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { email, role = "member" } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found with this email" },
                { status: 404 }
            );
        }

        // Check if already a member
        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: user.id,
                    workspaceId: params.id,
                },
            },
        });

        if (existingMember) {
            return NextResponse.json(
                { error: "User is already a member of this workspace" },
                { status: 400 }
            );
        }

        // Add member
        const newMember = await prisma.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId: params.id,
                role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json({ member: newMember }, { status: 201 });
    } catch (error) {
        console.error("Error adding member:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/workspaces/[id]/members/[userId] - Remove member
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        // Check if requester is owner
        const requester = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: session.user.id,
                    workspaceId: params.id,
                },
            },
        });

        if (!requester || requester.role !== "owner") {
            return NextResponse.json(
                { error: "Only workspace owners can remove members" },
                { status: 403 }
            );
        }

        // Cannot remove yourself if you're the only owner
        if (userId === session.user.id) {
            const ownerCount = await prisma.workspaceMember.count({
                where: {
                    workspaceId: params.id,
                    role: "owner",
                },
            });

            if (ownerCount === 1) {
                return NextResponse.json(
                    { error: "Cannot remove the only owner" },
                    { status: 400 }
                );
            }
        }

        await prisma.workspaceMember.delete({
            where: {
                userId_workspaceId: {
                    userId,
                    workspaceId: params.id,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing member:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
