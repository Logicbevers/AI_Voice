import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Detailed Recent Activity Check\n');

    // Get the most recent project
    const latestProject = await prisma.project.findFirst({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            videoJobs: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    if (!latestProject) {
        console.log('❌ No projects found in database');
        return;
    }

    console.log('=== LATEST PROJECT ===');
    console.log('Title:', latestProject.title);
    console.log('Status:', latestProject.status);
    console.log('Created:', latestProject.createdAt);
    console.log('Script:', latestProject.script?.substring(0, 100) + '...');
    console.log('\n=== AVATAR & VOICE ===');
    console.log('Avatar ID:', latestProject.avatarId || 'NULL ❌');
    console.log('Voice ID:', latestProject.voiceId || 'NULL');

    if (latestProject.videoJobs.length > 0) {
        const job = latestProject.videoJobs[0];
        console.log('\n=== VIDEO JOB ===');
        console.log('Status:', job.status);
        console.log('HeyGen Video ID:', job.heygenVideoId || 'NULL');
        console.log('Created:', job.createdAt);

        if (job.error) {
            console.log('\n=== ERROR DETAILS ===');
            console.log(job.error);
        }
    } else {
        console.log('\n❌ No video jobs found for this project');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
