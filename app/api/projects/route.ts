import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects - List workspace projects
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if (!workspaceId) {
            return NextResponse.json(
                { error: "Workspace ID is required" },
                { status: 400 }
            );
        }

        // Verify user has access to workspace
        const member = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: session.user.id,
                    workspaceId,
                },
            },
        });

        if (!member) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const projects = await prisma.project.findMany({
            where: {
                workspaceId,
            },
            include: {
                videoJob: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/projects - Create new project
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, workspaceId, script, settings } = body;

        if (!workspaceId) {
            return NextResponse.json(
                { error: "Workspace ID is required" },
                { status: 400 }
            );
        }

        // Verify user has access to workspace
        const member = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: session.user.id,
                    workspaceId,
                },
            },
        });

        if (!member) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Extract avatar and voice IDs from settings
        const avatarId = settings?.avatar?.id || settings?.avatar?.avatar_id || null;
        const voiceId = settings?.voice?.id || settings?.voice?.voice_id || null;

        const project = await prisma.project.create({
            data: {
                title: name || "Untitled Project",
                workspaceId,
                userId: session.user.id,
                status: "draft",
                language: "en-US",
                script,
                avatarId,
                voiceId,
            },
        });

        return NextResponse.json({ project }, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
