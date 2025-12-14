// Direct test of workspace query with known user ID
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const knownUserId = 'cmj1g46ia0000ugt117plciju'; // From database check

    console.log('Testing workspace query with known user ID:', knownUserId);
    console.log('');

    const workspaceMembers = await prisma.workspaceMember.findMany({
        where: {
            userId: knownUserId,
        },
        include: {
            workspace: true,
        },
    });

    console.log(`Found ${workspaceMembers.length} workspace members:`);
    workspaceMembers.forEach(member => {
        console.log(`  - Workspace: ${member.workspace.name}`);
        console.log(`    Role: ${member.role}`);
        console.log(`    Workspace ID: ${member.workspace.id}`);
    });

    // Now let's check what user IDs exist in the session table
    console.log('\\nChecking all sessions:');
    const sessions = await prisma.session.findMany({
        include: {
            user: true,
        }
    });

    console.log(`Found ${sessions.length} sessions:`);
    sessions.forEach(session => {
        console.log(`  - User: ${session.user.email}`);
        console.log(`    User ID: ${session.userId}`);
        console.log(`    Session Token: ${session.sessionToken.substring(0, 20)}...`);
        console.log(`    Expires: ${session.expires}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
