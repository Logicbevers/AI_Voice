// Simple test script to check database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('📊 Checking database for projects and video jobs...\n');

    const projects = await prisma.project.findMany({
        include: {
            videoJob: true,
            workspace: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    console.log(`Found ${projects.length} projects:\n`);

    projects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title}`);
        console.log(`   ID: ${project.id}`);
        console.log(`   Status: ${project.status}`);
        console.log(`   Script: ${project.script?.substring(0, 50)}...`);
        console.log(`   Avatar ID: ${project.avatarId || 'N/A'}`);
        console.log(`   Voice ID: ${project.voiceId || 'N/A'}`);
        console.log(`   Workspace: ${project.workspace.name}`);

        if (project.videoJob) {
            console.log(`   Video Job:`);
            console.log(`     - Status: ${project.videoJob.status}`);
            console.log(`     - Video URL: ${project.videoJob.videoUrl || 'N/A'}`);
            console.log(`     - HeyGen ID: ${project.videoJob.heygenVideoId || 'N/A'}`);
            console.log(`     - Error: ${project.videoJob.error || 'N/A'}`);
        } else {
            console.log(`   Video Job: None`);
        }
        console.log('');
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
