import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTtsProvider } from '@/lib/tts';

// POST /api/tts/generate - Generate audio from text
export async function POST(request: NextRequest) {
    try {
        // const session = await getServerSession(authOptions); // DISABLED FOR PUBLIC ACCESS
        // if (!session?.user?.id) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }
        const session = { user: { id: 'public-user' } }; // Temporary mock session

        const body = await request.json();
        const { text, voiceId, voiceName, modelId, stability, similarityBoost, workspaceId } = body;

        // Validation
        if (!text || !voiceId) {
            return NextResponse.json(
                { error: 'Missing required fields: text, voiceId' },
                { status: 400 }
            );
        }

        if (text.length > 5000) {
            return NextResponse.json(
                { error: 'Text exceeds maximum length of 5,000 characters' },
                { status: 400 }
            );
        }

        if (!workspaceId) {
            return NextResponse.json(
                { error: 'Missing workspaceId' },
                { status: 400 }
            );
        }

        // TEMPORARY: Skip database operations and file storage in public access mode
        // Return audio as base64 data URL (works on Vercel serverless)
        try {
            // Generate audio
            const ttsProvider = getTtsProvider();
            const audioBuffer = await ttsProvider.generateAudio({
                text,
                voiceId,
                modelId: modelId || 'eleven_multilingual_v2',
                stability: stability ?? 0.5,
                similarityBoost: similarityBoost ?? 0.75,
            });

            // Convert audio buffer to base64 data URL
            // This works on Vercel serverless (no file system write needed)
            const base64Audio = audioBuffer.toString('base64');
            const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

            // Return success with data URL
            return NextResponse.json({
                id: `temp-${Date.now()}`,
                status: 'done',
                audioUrl,
                text,
                voiceId,
                voiceName: voiceName || voiceId,
            });
        } catch (error) {
            console.error('Error generating TTS audio:', error);
            return NextResponse.json(
                {
                    error: 'Failed to generate audio',
                    message: error instanceof Error ? error.message : 'Unknown error',
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error generating TTS audio:', error);
        return NextResponse.json(
            {
                error: 'Failed to generate audio',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
