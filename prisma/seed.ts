import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);

    const user = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            email: 'demo@example.com',
            name: 'Demo User',
            password: hashedPassword,
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
        },
    });

    console.log('✅ Created demo user:', user.email);

    // Create demo workspace
    const workspace = await prisma.workspace.upsert({
        where: { slug: 'demo-workspace' },
        update: {},
        create: {
            name: 'Demo Workspace',
            slug: 'demo-workspace',
            members: {
                create: {
                    userId: user.id,
                    role: 'owner',
                },
            },
        },
    });

    console.log('✅ Created demo workspace:', workspace.name);

    // Create demo project
    const project = await prisma.project.upsert({
        where: { id: 'demo-project-1' },
        update: {},
        create: {
            id: 'demo-project-1',
            title: 'Welcome Video',
            description: 'A demo video project',
            status: 'draft',
            language: 'en-US',
            script: 'Welcome to our AI Video SaaS platform! Create amazing videos with AI avatars and voices.',
            userId: user.id,
            workspaceId: workspace.id,
        },
    });

    console.log('✅ Created demo project:', project.title);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📝 Demo credentials:');
    console.log('   Email: demo@example.com');
    console.log('   Password: demo123');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
