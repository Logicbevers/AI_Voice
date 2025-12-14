import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/workspaces/[id] - Get workspace details
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const workspace = await prisma.workspace.findUnique({
            where: { id: params.id },
            include: {
                members: {
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
                },
            },
        });

        if (!workspace) {
            return NextResponse.json(
                { error: "Workspace not found" },
                { status: 404 }
            );
        }

        // Check if user is a member
        const isMember = workspace.members.some(
            (member) => member.userId === session.user.id
        );

        if (!isMember) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ workspace });
    } catch (error) {
        console.error("Error fetching workspace:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH /api/workspaces/[id] - Update workspace
export async function PATCH(
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
                { error: "Only workspace owners can update settings" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { name, slug, logo, primaryColor } = body;

        const workspace = await prisma.workspace.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                ...(logo !== undefined && { logo }),
                ...(primaryColor !== undefined && { primaryColor }),
            },
        });

        return NextResponse.json({ workspace });
    } catch (error) {
        console.error("Error updating workspace:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/workspaces/[id] - Delete workspace
export async function DELETE(
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
                { error: "Only workspace owners can delete workspace" },
                { status: 403 }
            );
        }

        await prisma.workspace.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting workspace:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
