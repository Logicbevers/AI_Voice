import { getTtsProvider } from './lib/tts';

async function testElevenLabs() {
    console.log('🎙️ Testing ElevenLabs Integration\n');

    try {
        const provider = getTtsProvider();

        // Test 1: List voices
        console.log('1️⃣ Testing voice listing...');
        const voices = await provider.listVoices();
        console.log(`✅ Found ${voices.length} voices`);
        console.log('\nSample voices:');
        voices.slice(0, 5).forEach(v => {
            console.log(`  - ${v.name} (${v.id})`);
            console.log(`    Language: ${v.language || 'N/A'}, Gender: ${v.gender || 'N/A'}`);
        });

        // Test 2: Generate audio
        console.log('\n2️⃣ Testing audio generation...');
        const testVoice = voices[0];
        console.log(`Using voice: ${testVoice.name}`);

        const audioBuffer = await provider.generateAudio({
            text: 'Hello! This is a test of the ElevenLabs text to speech integration.',
            voiceId: testVoice.id,
            modelId: 'eleven_multilingual_v2',
            stability: 0.5,
            similarityBoost: 0.75,
        });

        console.log(`✅ Generated audio: ${audioBuffer.length} bytes`);

        console.log('\n🎉 All tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testElevenLabs();
