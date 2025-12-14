import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects/[id]/share - Get share settings
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const project = await prisma.project.findUnique({
            where: { id: params.id },
            include: {
                workspace: {
                    include: {
                        members: {
                            where: {
                                userId: session.user.id,
                            },
                        },
                    },
                },
                videoJob: true,
            },
        });

        if (!project || project.workspace.members.length === 0) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const videoJob = project.videoJob;
        if (!videoJob || videoJob.status !== "completed" || !videoJob.videoUrl) {
            return NextResponse.json(
                { error: "No completed video found" },
                { status: 404 }
            );
        }

        // Generate shareable URL (in production, this would be a public URL)
        const shareUrl = `${process.env.NEXTAUTH_URL}/share/${project.id}`;

        return NextResponse.json({
            shareUrl,
            videoUrl: videoJob.videoUrl,
            projectName: project.title,
            canShare: true,
        });
    } catch (error) {
        console.error("Error getting share settings:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
