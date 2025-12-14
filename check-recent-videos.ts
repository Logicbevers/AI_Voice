import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking recent failed videos...\n');

    // Get the most recent projects
    const recentProjects = await prisma.project.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: 5,
        include: {
            videoJobs: {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
            },
        },
    });

    console.log(`Found ${recentProjects.length} recent projects:\n`);

    recentProjects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title}`);
        console.log(`   Status: ${project.status}`);
        console.log(`   Avatar ID: ${project.avatarId || 'NULL'}`);
        console.log(`   Voice ID: ${project.voiceId || 'NULL'}`);
        console.log(`   Created: ${project.createdAt}`);

        if (project.videoJobs.length > 0) {
            const job = project.videoJobs[0];
            console.log(`   Job Status: ${job.status}`);
            if (job.error) {
                console.log(`   ERROR: ${job.error}`);
            }
        }
        console.log('');
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
