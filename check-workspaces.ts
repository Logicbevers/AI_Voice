// Quick database check script
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking database for workspace associations...\n');

    // Get all users
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
        }
    });

    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
        console.log(`  - ${user.email} (ID: ${user.id})`);
    });
    console.log('');

    // Get all workspaces
    const workspaces = await prisma.workspace.findMany({
        include: {
            members: {
                include: {
                    user: true,
                }
            }
        }
    });

    console.log(`Found ${workspaces.length} workspaces:`);
    workspaces.forEach(workspace => {
        console.log(`  - ${workspace.name} (ID: ${workspace.id})`);
        console.log(`    Members: ${workspace.members.length}`);
        workspace.members.forEach(member => {
            console.log(`      * ${member.user.email} (${member.role})`);
        });
    });
    console.log('');

    // Get all workspace members
    const members = await prisma.workspaceMember.findMany({
        include: {
            user: true,
            workspace: true,
        }
    });

    console.log(`Found ${members.length} workspace members:`);
    members.forEach(member => {
        console.log(`  - ${member.user.email} → ${member.workspace.name} (${member.role})`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
