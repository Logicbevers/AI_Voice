import { getHeyGenClient } from './lib/heygen';

async function main() {
    console.log('🎤 Testing HeyGen API - Listing Voices...\n');

    try {
        const client = getHeyGenClient();

        console.log('📡 Fetching voices from HeyGen API...');
        const voices = await client.listVoices();

        console.log(`\n✅ Found ${voices.length} voices:\n`);

        // Show first 10 voices
        voices.slice(0, 10).forEach((voice, index) => {
            console.log(`${index + 1}. ${voice.name}`);
            console.log(`   ID: ${voice.voice_id}`);
            console.log(`   Language: ${voice.language}`);
            console.log(`   Gender: ${voice.gender}`);
            console.log('');
        });

        if (voices.length > 10) {
            console.log(`... and ${voices.length - 10} more voices`);
        }

        console.log('\n💡 Recommendation: Use one of these voice IDs as default');

    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
    }
}

main();
