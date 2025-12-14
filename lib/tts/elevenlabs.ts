import axios from 'axios';
import { TtsProvider, TtsVoice, TtsGenerateParams } from './types';

export class ElevenLabsProvider implements TtsProvider {
    private apiKey: string;
    private baseUrl = 'https://api.elevenlabs.io/v1';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * List available voices from ElevenLabs
     */
    async listVoices(): Promise<TtsVoice[]> {
        try {
            console.log('[ElevenLabs] Making GET request to:', `${this.baseUrl}/voices`);
            console.log('[ElevenLabs] API key length:', this.apiKey.length);
            console.log('[ElevenLabs] API key prefix:', this.apiKey.substring(0, 10));

            const response = await axios.get(`${this.baseUrl}/voices`, {
                headers: { 'xi-api-key': this.apiKey }
            });

            console.log('[ElevenLabs] Response status:', response.status);
            console.log('[ElevenLabs] Voices count:', response.data.voices?.length || 0);

            return response.data.voices.map((v: any) => ({
                id: v.voice_id,
                name: v.name,
                gender: v.labels?.gender?.toLowerCase(),
                language: v.labels?.language,
                accent: v.labels?.accent,
                description: v.labels?.description || v.labels?.use_case,
                previewUrl: v.preview_url,
            }));
        } catch (error) {
            console.error('[ElevenLabs] Error in listVoices:');
            console.error('[ElevenLabs] Error type:', error instanceof Error ? error.constructor.name : typeof error);

            if (axios.isAxiosError(error)) {
                console.error('[ElevenLabs] Axios error status:', error.response?.status);
                console.error('[ElevenLabs] Axios error data:', error.response?.data);
                console.error('[ElevenLabs] Axios error message:', error.message);

                throw new Error(
                    `ElevenLabs API Error: ${error.response?.data?.detail?.message || error.message}`
                );
            }
            throw error;
        }
    }

    /**
     * Generate audio from text using ElevenLabs TTS
     */
    async generateAudio(params: TtsGenerateParams): Promise<Buffer> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/text-to-speech/${params.voiceId}`,
                {
                    text: params.text,
                    model_id: params.modelId || 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: params.stability ?? 0.5,
                        similarity_boost: params.similarityBoost ?? 0.75,
                    }
                },
                {
                    headers: {
                        'xi-api-key': this.apiKey,
                        'Content-Type': 'application/json',
                        'Accept': 'audio/mpeg',
                    },
                    responseType: 'arraybuffer',
                }
            );

            return Buffer.from(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    `ElevenLabs API Error: ${error.response?.data?.detail?.message || error.message}`
                );
            }
            throw error;
        }
    }
}
