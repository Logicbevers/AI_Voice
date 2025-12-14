import { PrismaClient } from '@prisma/client';
import { getHeyGenClient } from './lib/heygen';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking video status with HeyGen...\n');

    const processingProjects = await prisma.project.findMany({
        where: { status: 'processing' },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    if (processingProjects.length === 0) {
        console.log('No processing videos found');
        return;
    }

    const heygenClient = getHeyGenClient();

    for (const project of processingProjects) {
        const videoJob = await prisma.videoJob.findFirst({
            where: { projectId: project.id },
            orderBy: { createdAt: 'desc' },
        });

        if (!videoJob?.heygenVideoId) {
            console.log(`\n❌ ${project.title}: No HeyGen video ID`);
            continue;
        }

        console.log(`\n📹 ${project.title}`);
        console.log(`   HeyGen ID: ${videoJob.heygenVideoId}`);

        try {
            const status = await heygenClient.getVideoStatus(videoJob.heygenVideoId);
            console.log(`   Status: ${status.data.status}`);

            if (status.data.status === 'completed' && status.data.video_url) {
                console.log(`   ✅ Video URL: ${status.data.video_url}`);

                // Update database
                await prisma.videoJob.update({
                    where: { id: videoJob.id },
                    data: {
                        status: 'completed',
                        videoUrl: status.data.video_url,
                        duration: status.data.duration,
                    },
                });

                await prisma.project.update({
                    where: { id: project.id },
                    data: { status: 'completed' },
                });

                console.log(`   ✅ Database updated!`);
            } else if (status.data.status === 'processing' || status.data.status === 'pending') {
                console.log(`   ⏳ Still processing...`);
            } else {
                console.log(`   ❌ Status: ${status.data.status}`);
                if (status.data.error?.message) {
                    console.log(`   Error: ${status.data.error.message}`);
                }
            }
        } catch (error) {
            console.error(`   ❌ Error:`, error instanceof Error ? error.message : error);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
