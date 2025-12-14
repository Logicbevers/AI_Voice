import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking failed video generation details...\n');

    // Get all failed projects with their video jobs
    const failedProjects = await prisma.project.findMany({
        where: {
            status: 'failed',
        },
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
        take: 3,
    });

    if (failedProjects.length === 0) {
        console.log('No failed projects found');
        return;
    }

    failedProjects.forEach((project, index) => {
        console.log(`\n=== Failed Project ${index + 1} ===`);
        console.log('Title:', project.title);
        console.log('Script:', project.script?.substring(0, 80) + '...');
        console.log('Avatar ID:', project.avatarId || 'NULL');
        console.log('Voice ID:', project.voiceId || 'NULL');
        console.log('Status:', project.status);
        console.log('Created:', project.createdAt);

        if (project.videoJobs.length > 0) {
            const job = project.videoJobs[0];
            console.log('\nVideo Job:');
            console.log('  Status:', job.status);
            console.log('  HeyGen Video ID:', job.heygenVideoId || 'NULL');
            console.log('  Error Message:', job.error || 'NULL');
            console.log('  Created:', job.createdAt);
        }
    });
}

main()
    .catch((error) => {
        console.error('Error:', error.message);
    })
    .finally(() => prisma.$disconnect());
