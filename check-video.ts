import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('=== LATEST VIDEO VERIFICATION ===\n');

    const latestProject = await prisma.project.findFirst({
        orderBy: { createdAt: 'desc' },
    });

    if (!latestProject) {
        console.log('No projects found');
        return;
    }

    console.log('Title:', latestProject.title);
    console.log('Status:', latestProject.status);
    console.log('Avatar ID:', latestProject.avatarId);
    console.log('Voice ID:', latestProject.voiceId);
    console.log('Created:', latestProject.createdAt);

    const videoJob = await prisma.videoJob.findFirst({
        where: { projectId: latestProject.id },
        orderBy: { createdAt: 'desc' },
    });

    if (videoJob) {
        console.log('\nVideo Job Status:', videoJob.status);
        if (videoJob.error) {
            console.log('Error:', videoJob.error);
        }
    }
}

main().finally(() => prisma.$disconnect());
