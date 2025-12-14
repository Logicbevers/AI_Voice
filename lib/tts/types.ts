// TTS Provider Types
export interface TtsVoice {
    id: string;
    name: string;
    gender?: 'male' | 'female' | 'neutral';
    language?: string;
    accent?: string;
    description?: string;
    previewUrl?: string;
}

export interface TtsGenerateParams {
    text: string;
    voiceId: string;
    modelId?: string;
    stability?: number; // 0-1
    similarityBoost?: number; // 0-1
}

export interface TtsProvider {
    listVoices(): Promise<TtsVoice[]>;
    generateAudio(params: TtsGenerateParams): Promise<Buffer>;
}
