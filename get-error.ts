import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Get the most recent video job with error
    const failedJob = await prisma.videoJob.findFirst({
        where: {
            status: 'failed',
            error: { not: null },
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            project: true,
        },
    });

    if (!failedJob) {
        console.log('No failed jobs with error found');
        return;
    }

    console.log('ERROR MESSAGE:');
    console.log(failedJob.error);
    console.log('');
    console.log('PROJECT DETAILS:');
    console.log('Avatar ID:', failedJob.project.avatarId);
    console.log('Voice ID:', failedJob.project.voiceId);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
