import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getHeyGenClient } from '@/lib/heygen';

// GET /api/heygen/voices - Fetch available HeyGen voices
export async function GET() {
    try {
        // const session = await getServerSession(authOptions); // DISABLED FOR PUBLIC ACCESS
        // if (!session?.user?.id) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        // Check if HeyGen API key is configured
        if (!process.env.HEYGEN_API_KEY) {
            return NextResponse.json(
                { error: 'HeyGen API is not configured' },
                { status: 503 }
            );
        }

        const heygenClient = getHeyGenClient();
        const voices = await heygenClient.listVoices();

        return NextResponse.json({
            voices,
            count: voices.length,
        });
    } catch (error) {
        console.error('Error fetching HeyGen voices:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch voices',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
