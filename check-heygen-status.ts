import { PrismaClient } from '@prisma/client';
import { getHeyGenClient } from './lib/heygen';

const prisma = new PrismaClient();

async function main() {
    const latest = await prisma.project.findFirst({
        orderBy: { createdAt: 'desc' },
    });

    if (!latest) {
        console.log('No projects');
        return;
    }

    const job = await prisma.videoJob.findFirst({
        where: { projectId: latest.id },
        orderBy: { createdAt: 'desc' },
    });

    if (!job?.heygenVideoId) {
        console.log('No HeyGen video ID');
        return;
    }

    console.log('Project:', latest.title);
    console.log('DB Status:', latest.status);
    console.log('HeyGen ID:', job.heygenVideoId);
    console.log('\nChecking with HeyGen API...\n');

    const heygenClient = getHeyGenClient();
    const status = await heygenClient.getVideoStatus(job.heygenVideoId);

    console.log('HeyGen Response:');
    console.log(JSON.stringify(status.data, null, 2));
}

main().finally(() => prisma.$disconnect());
