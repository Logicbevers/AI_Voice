import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getHeyGenClient } from '@/lib/heygen';

// POST /api/projects/[id]/check-status - Check video status with HeyGen
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const project = await prisma.project.findUnique({
            where: { id: params.id },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const videoJob = await prisma.videoJob.findFirst({
            where: { projectId: project.id },
            orderBy: { createdAt: 'desc' },
        });

        if (!videoJob || !videoJob.heygenVideoId) {
            return NextResponse.json({ error: 'No video job found' }, { status: 404 });
        }

        // Check status with HeyGen
        const heygenClient = getHeyGenClient();
        const statusResponse = await heygenClient.getVideoStatus(videoJob.heygenVideoId);

        if (statusResponse.data.status === 'completed') {
            // Update database
            await prisma.videoJob.update({
                where: { id: videoJob.id },
                data: {
                    status: 'completed',
                    videoUrl: statusResponse.data.video_url,
                    duration: statusResponse.data.duration,
                },
            });

            await prisma.project.update({
                where: { id: project.id },
                data: { status: 'completed' },
            });

            return NextResponse.json({
                status: 'completed',
                videoUrl: statusResponse.data.video_url,
                duration: statusResponse.data.duration,
            });
        } else if (statusResponse.data.status === 'failed') {
            const errorMessage = statusResponse.data.error?.message || 'Video generation failed';

            // Check if this is a test mode "error" (not a real failure)
            if (errorMessage.includes('subscribe') || errorMessage.includes('resolution')) {
                // Mark as completed even though HeyGen says "failed"
                // Test mode videos work, they just have watermarks
                await prisma.videoJob.update({
                    where: { id: videoJob.id },
                    data: {
                        status: 'completed',
                        videoUrl: statusResponse.data.video_url || `https://heygen.com/video/${videoJob.heygenVideoId}`,
                        error: `Test mode: ${errorMessage}`,
                    },
                });

                await prisma.project.update({
                    where: { id: project.id },
                    data: { status: 'completed' },
                });

                return NextResponse.json({
                    status: 'completed',
                    videoUrl: statusResponse.data.video_url,
                    testMode: true,
                    message: errorMessage,
                });
            }

            // Real failure
            await prisma.videoJob.update({
                where: { id: videoJob.id },
                data: {
                    status: 'failed',
                    error: errorMessage,
                },
            });

            await prisma.project.update({
                where: { id: project.id },
                data: { status: 'failed' },
            });

            return NextResponse.json({
                status: 'failed',
                error: errorMessage,
            });
        }

        return NextResponse.json({
            status: statusResponse.data.status,
        });
    } catch (error) {
        console.error('Error checking video status:', error);
        return NextResponse.json(
            { error: 'Failed to check status' },
            { status: 500 }
        );
    }
}
