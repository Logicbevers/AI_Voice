import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getHeyGenClient } from "@/lib/heygen";

// POST /api/projects/[id]/generate - Generate video
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify user has access to project
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
            },
        });

        if (!project || project.workspace.members.length === 0) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Validate project has required data
        if (!project.script) {
            return NextResponse.json(
                { error: "Project must have a script" },
                { status: 400 }
            );
        }

        // Create video job
        const videoJob = await prisma.videoJob.create({
            data: {
                projectId: project.id,
                status: "queued",
            },
        });

        // Update project status
        await prisma.project.update({
            where: { id: project.id },
            data: { status: "processing" },
        });

        // Check if HeyGen API is configured
        const useHeyGen = !!process.env.HEYGEN_API_KEY;

        try {
            if (useHeyGen) {
                console.log(`🎬 Starting HeyGen video generation for project ${project.id}`);

                // Validate required fields for HeyGen
                if (!project.avatarId) {
                    throw new Error('Avatar ID is required for video generation. Please select an avatar.');
                }

                // Initialize HeyGen client
                const heygenClient = getHeyGenClient();

                // Use default voice if none selected (HeyGen requires voice_id)
                const voiceId = project.voiceId || 'b966c31caf124c2a99f19ff1479c964f'; // Default English voice

                // Create video with HeyGen
                const createResponse = await heygenClient.createVideo({
                    script: project.script,
                    avatarId: project.avatarId,
                    voiceId: voiceId,
                    title: project.title,
                    test: true, // Use test mode for free tier
                });

                console.log(`📹 HeyGen video created with ID: ${createResponse.data.video_id}`);

                // Store HeyGen video ID and mark as processing
                await prisma.videoJob.update({
                    where: { id: videoJob.id },
                    data: {
                        heygenVideoId: createResponse.data.video_id,
                        status: "processing",
                    },
                });

                await prisma.project.update({
                    where: { id: project.id },
                    data: { status: "processing" },
                });

                console.log(`✅ HeyGen video generation started for project ${project.id}`);
                console.log(`⏳ Video will be processed by HeyGen (2-5 minutes)`);

                // Note: Video will be polled for completion by a separate background job
                // For now, the video will remain in "processing" status
            } else {
                // Fallback to mock generation if HeyGen is not configured
                console.log(`🎭 Using mock video generation for project ${project.id}`);

                // Simulate processing time
                await new Promise((resolve) => setTimeout(resolve, 5000));

                // Update job with mock video URL
                await prisma.videoJob.update({
                    where: { id: videoJob.id },
                    data: {
                        status: "completed",
                        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                        duration: 60,
                    },
                });

                await prisma.project.update({
                    where: { id: project.id },
                    data: { status: "completed" },
                });

                console.log(`✅ Mock video generation completed for project ${project.id}`);
            }
        } catch (error) {
            console.error("❌ Error in video generation:", error);

            // Update job as failed
            await prisma.videoJob.update({
                where: { id: videoJob.id },
                data: {
                    status: "failed",
                    error: error instanceof Error ? error.message : "Unknown error"
                },
            });

            await prisma.project.update({
                where: { id: project.id },
                data: { status: "failed" },
            });
        }

        return NextResponse.json({
            message: useHeyGen
                ? "Video generation started with HeyGen"
                : "Video generation started (mock mode)",
            jobId: videoJob.id,
            projectId: project.id,
            provider: useHeyGen ? "heygen" : "mock",
        }, { status: 202 });
    } catch (error) {
        console.error("Error generating video:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
