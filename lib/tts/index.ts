import { ElevenLabsProvider } from './elevenlabs';
import { TtsProvider } from './types';

let ttsProviderInstance: TtsProvider | null = null;
let cachedApiKey: string | null = null;

/**
 * Get TTS provider instance (singleton)
 * Resets the instance if the API key has changed
 */
export function getTtsProvider(): TtsProvider {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    // Debug logging
    console.log('[TTS Provider] Checking API key configuration...');
    console.log('[TTS Provider] API key exists:', !!apiKey);
    console.log('[TTS Provider] API key length:', apiKey?.length || 0);
    console.log('[TTS Provider] API key prefix:', apiKey?.substring(0, 10) || 'N/A');

    if (!apiKey) {
        console.error('[TTS Provider] ERROR: ELEVENLABS_API_KEY not configured');
        throw new Error('ELEVENLABS_API_KEY not configured');
    }

    // Reset singleton if API key has changed
    if (cachedApiKey !== apiKey) {
        console.log('[TTS Provider] API key changed, resetting provider instance');
        ttsProviderInstance = null;
        cachedApiKey = apiKey;
    }

    // Return cached instance or create new one
    if (ttsProviderInstance) {
        console.log('[TTS Provider] Returning cached provider instance');
        return ttsProviderInstance;
    }

    console.log('[TTS Provider] Creating new provider instance');
    ttsProviderInstance = new ElevenLabsProvider(apiKey);
    return ttsProviderInstance;
}

export * from './types';
export { ElevenLabsProvider } from './elevenlabs';
