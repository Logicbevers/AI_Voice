import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/workspaces - List user's workspaces
export async function GET(req: NextRequest) {
    try {
        console.log('🏢 /api/workspaces GET called');
        const session = await getServerSession(authOptions);
        console.log('📋 Session:', {
            hasSession: !!session,
            userId: session?.user?.id,
            userEmail: session?.user?.email,
        });

        if (!session?.user?.id) {
            console.log('❌ No session user ID');
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log('🔍 Querying workspaceMembers for userId:', session.user.id);
        const workspaceMembers = await prisma.workspaceMember.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                workspace: true,
            },
        });

        console.log('📊 Found workspace members:', workspaceMembers.length);
        workspaceMembers.forEach(member => {
            console.log(`  - Workspace: ${member.workspace.name}, Role: ${member.role}`);
        });

        const workspaces = workspaceMembers.map((member) => ({
            id: member.workspace.id,
            name: member.workspace.name,
            slug: member.workspace.slug,
            logo: member.workspace.logo,
            primaryColor: member.workspace.primaryColor,
            role: member.role,
        }));

        console.log('✅ Returning workspaces:', workspaces.length);
        return NextResponse.json({ workspaces });
    } catch (error) {
        console.error("❌ Error fetching workspaces:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/workspaces - Create new workspace
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, slug, logo, primaryColor } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { error: "Name and slug are required" },
                { status: 400 }
            );
        }

        // Check if slug is unique
        const existingWorkspace = await prisma.workspace.findUnique({
            where: { slug },
        });

        if (existingWorkspace) {
            return NextResponse.json(
                { error: "Workspace slug already exists" },
                { status: 400 }
            );
        }

        // Create workspace with user as owner
        const workspace = await prisma.workspace.create({
            data: {
                name,
                slug,
                logo,
                primaryColor,
                members: {
                    create: {
                        userId: session.user.id,
                        role: "owner",
                    },
                },
            },
        });

        return NextResponse.json({ workspace }, { status: 201 });
    } catch (error) {
        console.error("Error creating workspace:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
