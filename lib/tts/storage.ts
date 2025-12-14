import fs from 'fs/promises';
import path from 'path';

/**
 * Save audio file to public directory
 * @param buffer Audio file buffer
 * @param filename Filename (e.g. "tts-job-id.mp3")
 * @returns Public URL to the audio file
 */
export async function saveAudioFile(buffer: Buffer, filename: string): Promise<string> {
    const audioDir = path.join(process.cwd(), 'public', 'audio');

    // Ensure directory exists
    await fs.mkdir(audioDir, { recursive: true });

    const filePath = path.join(audioDir, filename);
    await fs.writeFile(filePath, buffer);

    return `/audio/${filename}`;
}

/**
 * Delete audio file from public directory
 * @param audioUrl Public URL to the audio file
 */
export async function deleteAudioFile(audioUrl: string): Promise<void> {
    const filename = path.basename(audioUrl);
    const filePath = path.join(process.cwd(), 'public', 'audio', filename);

    try {
        await fs.unlink(filePath);
    } catch (error) {
        // Ignore if file doesn't exist
        console.warn(`Failed to delete audio file: ${filePath}`, error);
    }
}
