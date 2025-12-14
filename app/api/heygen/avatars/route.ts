import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getHeyGenClient } from '@/lib/heygen';

// GET /api/heygen/avatars - Fetch available HeyGen avatars
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if HeyGen API key is configured
        if (!process.env.HEYGEN_API_KEY) {
            return NextResponse.json(
                { error: 'HeyGen API is not configured' },
                { status: 503 }
            );
        }

        const heygenClient = getHeyGenClient();
        const allAvatars = await heygenClient.listAvatars();

        // Limit to first 5 avatars for better UX
        const avatars = allAvatars.slice(0, 5);

        return NextResponse.json({
            avatars,
            count: avatars.length,
            total: allAvatars.length,
        });
    } catch (error) {
        console.error('Error fetching HeyGen avatars:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch avatars',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
