import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const latest = await prisma.project.findFirst({
        orderBy: { createdAt: 'desc' },
    });

    if (!latest) {
        console.log('No projects');
        return;
    }

    console.log('PROJECT:', latest.title);
    console.log('Status:', latest.status);
    console.log('Avatar ID:', latest.avatarId);
    console.log('Voice ID:', latest.voiceId);
    console.log('Created:', latest.createdAt.toISOString());

    const job = await prisma.videoJob.findFirst({
        where: { projectId: latest.id },
        orderBy: { createdAt: 'desc' },
    });

    if (job) {
        console.log('\nVIDEO JOB:');
        console.log('Status:', job.status);
        console.log('HeyGen ID:', job.heygenVideoId);
        if (job.error) {
            console.log('\nERROR:');
            console.log(job.error);
        }
    } else {
        console.log('\nNo video job found');
    }
}

main().finally(() => prisma.$disconnect());
