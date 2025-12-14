import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTtsProvider } from '@/lib/tts';
import { saveAudioFile } from '@/lib/tts/storage';

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

        // Create TTS job
        const ttsJob = await prisma.ttsJob.create({
            data: {
                userId: session.user.id,
                workspaceId,
                text,
                voiceId,
                voiceName: voiceName || voiceId,
                modelId: modelId || 'eleven_multilingual_v2',
                stability: stability ?? 0.5,
                similarityBoost: similarityBoost ?? 0.75,
                status: 'processing',
            },
        });

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

            // Save audio file
            const filename = `${ttsJob.id}.mp3`;
            const audioUrl = await saveAudioFile(audioBuffer, filename);

            // Update job with success
            const updatedJob = await prisma.ttsJob.update({
                where: { id: ttsJob.id },
                data: {
                    status: 'done',
                    audioUrl,
                },
            });

            return NextResponse.json(updatedJob);
        } catch (error) {
            // Update job with error
            await prisma.ttsJob.update({
                where: { id: ttsJob.id },
                data: {
                    status: 'failed',
                    errorMessage: error instanceof Error ? error.message : 'Unknown error',
                },
            });

            throw error;
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
