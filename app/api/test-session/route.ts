import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Test endpoint to debug session and workspace loading
export async function GET(req: NextRequest) {
    try {
        console.log('🧪 /api/test-session called');

        const session = await getServerSession(authOptions);

        const result = {
            hasSession: !!session,
            sessionData: session ? {
                userId: session.user?.id,
                userEmail: session.user?.email,
                userName: session.user?.name,
            } : null,
        };

        if (session?.user?.id) {
            // Try to find workspace members
            const workspaceMembers = await prisma.workspaceMember.findMany({
                where: {
                    userId: session.user.id,
                },
                include: {
                    workspace: true,
                },
            });

            result.workspaceMembers = workspaceMembers.map(m => ({
                workspaceName: m.workspace.name,
                role: m.role,
            }));
        }

        console.log('🧪 Test result:', result);
        return NextResponse.json(result);
    } catch (error) {
        console.error('❌ Test error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
