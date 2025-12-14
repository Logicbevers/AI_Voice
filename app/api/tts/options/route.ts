import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTtsProvider } from '@/lib/tts';

// GET /api/tts/options - Get available voices
export async function GET() {
    console.log('\n========== /api/tts/options REQUEST ==========');
    console.log('[API Route] Starting voice fetch request');

    try {
        // Check authentication
        console.log('[API Route] Checking authentication...');
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            console.log('[API Route] ERROR: User not authenticated');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log('[API Route] User authenticated:', session.user.id);

        // Check if ElevenLabs API key is configured
        console.log('[API Route] Checking ELEVENLABS_API_KEY environment variable...');
        const apiKey = process.env.ELEVENLABS_API_KEY;
        console.log('[API Route] API key exists:', !!apiKey);
        console.log('[API Route] API key length:', apiKey?.length || 0);
        console.log('[API Route] API key first 10 chars:', apiKey?.substring(0, 10) || 'N/A');

        if (!apiKey) {
            console.log('[API Route] ERROR: ELEVENLABS_API_KEY not configured');
            return NextResponse.json(
                { error: 'ElevenLabs API is not configured' },
                { status: 503 }
            );
        }

        // Get TTS provider and fetch voices
        console.log('[API Route] Getting TTS provider...');
        const ttsProvider = getTtsProvider();

        console.log('[API Route] Fetching voices from ElevenLabs...');
        const voices = await ttsProvider.listVoices();
        console.log('[API Route] Successfully fetched', voices.length, 'voices');

        // Group voices by language for better UX
        console.log('[API Route] Grouping voices by language...');
        const groupedVoices = voices.reduce((acc, voice) => {
            const lang = voice.language || 'Other';
            if (!acc[lang]) {
                acc[lang] = [];
            }
            acc[lang].push(voice);
            return acc;
        }, {} as Record<string, typeof voices>);

        console.log('[API Route] Returning response with', voices.length, 'voices');
        console.log('========== /api/tts/options SUCCESS ==========\n');

        return NextResponse.json({
            voices,
            groupedVoices,
            count: voices.length,
        });
    } catch (error) {
        console.error('\n========== /api/tts/options ERROR ==========');
        console.error('[API Route] Error fetching TTS voices:', error);
        console.error('[API Route] Error type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('[API Route] Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('[API Route] Error stack:', error instanceof Error ? error.stack : 'N/A');
        console.error('========== /api/tts/options ERROR END ==========\n');

        return NextResponse.json(
            {
                error: 'Failed to fetch voices',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
