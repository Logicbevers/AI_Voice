import axios, { AxiosInstance } from 'axios';

// HeyGen API Types
export interface HeyGenAvatar {
    avatar_id: string;
    avatar_name: string;
    preview_image_url?: string;
    preview_video_url?: string;
    gender?: string;
}

export interface HeyGenVoice {
    voice_id: string;
    language: string;
    gender: string;
    name: string;
    preview_audio?: string;
}

export interface CreateVideoParams {
    script: string;
    avatarId: string;
    voiceId?: string;
    title?: string;
    test?: boolean;
}

export interface HeyGenVideoResponse {
    code: number;
    data: {
        video_id: string;
    };
    message?: string;
}

export interface VideoStatus {
    code: number;
    data: {
        video_id: string;
        status: 'pending' | 'processing' | 'completed' | 'failed';
        video_url?: string;
        thumbnail_url?: string;
        duration?: number;
        error?: {
            code: string;
            message: string;
        };
    };
}

export class HeyGenClient {
    private client: AxiosInstance;
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.client = axios.create({
            baseURL: 'https://api.heygen.com',
            headers: {
                'X-Api-Key': apiKey,
                'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 seconds
        });
    }

    /**
     * Create a video using HeyGen API
     */
    async createVideo(params: CreateVideoParams): Promise<HeyGenVideoResponse> {
        try {
            const requestBody = {
                video_inputs: [
                    {
                        character: {
                            type: 'avatar',
                            avatar_id: params.avatarId,
                        },
                        voice: {
                            type: 'text',
                            input_text: params.script,
                            voice_id: params.voiceId, // HeyGen requires voice_id
                        },
                    },
                ],
                dimension: {
                    width: 1920,
                    height: 1080,
                },
                test: params.test ?? true, // Use test mode by default for free tier
                title: params.title,
            };

            console.log('📤 HeyGen API Request:', JSON.stringify(requestBody, null, 2));

            const response = await this.client.post<HeyGenVideoResponse>('/v2/video/generate', requestBody);

            console.log('✅ HeyGen API Response:', response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('❌ HeyGen API Error Response:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
                throw new Error(
                    `HeyGen API Error: ${JSON.stringify(error.response?.data) || error.message}`
                );
            }
            throw error;
        }
    }

    /**
     * Get video status by video ID
     */
    async getVideoStatus(videoId: string): Promise<VideoStatus> {
        try {
            const response = await this.client.get<VideoStatus>(
                `/v1/video_status.get?video_id=${videoId}`
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    `HeyGen API Error: ${error.response?.data?.message || error.message}`
                );
            }
            throw error;
        }
    }

    /**
     * List available avatars
     */
    async listAvatars(): Promise<HeyGenAvatar[]> {
        try {
            const response = await this.client.get<{
                code: number;
                data: { avatars: HeyGenAvatar[] };
            }>('/v2/avatars');

            return response.data.data.avatars;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    `HeyGen API Error: ${error.response?.data?.message || error.message}`
                );
            }
            throw error;
        }
    }

    /**
     * List available voices
     */
    async listVoices(): Promise<HeyGenVoice[]> {
        try {
            const response = await this.client.get<{
                code: number;
                data: { voices: HeyGenVoice[] };
            }>('/v2/voices');

            return response.data.data.voices;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    `HeyGen API Error: ${error.response?.data?.message || error.message}`
                );
            }
            throw error;
        }
    }

    /**
     * Poll video status until completed or failed
     * @param videoId HeyGen video ID
     * @param maxAttempts Maximum number of polling attempts (default: 60 = 5 minutes at 5s intervals)
     * @param intervalMs Polling interval in milliseconds (default: 5000 = 5 seconds)
     */
    async pollVideoStatus(
        videoId: string,
        maxAttempts: number = 60,
        intervalMs: number = 5000
    ): Promise<VideoStatus> {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const status = await this.getVideoStatus(videoId);

            if (status.data.status === 'completed' || status.data.status === 'failed') {
                return status;
            }

            // Wait before next poll
            await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }

        throw new Error('Video generation timeout - exceeded maximum polling attempts');
    }
}

// Singleton instance
let heygenClient: HeyGenClient | null = null;

export function getHeyGenClient(): HeyGenClient {
    if (!process.env.HEYGEN_API_KEY) {
        throw new Error('HEYGEN_API_KEY environment variable is not set');
    }

    if (!heygenClient) {
        heygenClient = new HeyGenClient(process.env.HEYGEN_API_KEY);
    }

    return heygenClient;
}
