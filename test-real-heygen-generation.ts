import { getHeyGenClient } from './lib/heygen';

async function main() {
    console.log('🎬 Testing Real HeyGen Video Generation\n');

    try {
        const client = getHeyGenClient();

        // First, get available avatars
        console.log('📡 Fetching available avatars...');
        const avatars = await client.listAvatars();

        if (avatars.length === 0) {
            console.log('❌ No avatars available');
            return;
        }

        // Use the first available avatar
        const avatar = avatars[0];
        console.log(`✅ Using avatar: ${avatar.avatar_name} (ID: ${avatar.avatar_id})\n`);

        // Get a voice
        console.log('📡 Fetching available voices...');
        const voices = await client.listVoices();
        const voice = voices[0];
        console.log(`✅ Using voice: ${voice.name} (ID: ${voice.voice_id})\n`);

        // Create a test video
        console.log('🎥 Creating test video with HeyGen API...');
        const createResponse = await client.createVideo({
            script: 'Hello! This is a test of the HeyGen API integration. If you can see this video, it means the integration is working correctly.',
            avatarId: avatar.avatar_id,
            voiceId: voice.voice_id, // Include voice ID
            title: 'HeyGen API Integration Test',
            test: true, // Use test mode
        });

        console.log(`✅ Video created successfully!`);
        console.log(`   Video ID: ${createResponse.data.video_id}\n`);

        // Poll for completion
        console.log('⏳ Polling for video completion (this may take 2-5 minutes)...');
        console.log('   Checking every 10 seconds...\n');

        const statusResponse = await client.pollVideoStatus(
            createResponse.data.video_id,
            60, // Max 60 attempts (10 minutes)
            10000 // Poll every 10 seconds
        );

        if (statusResponse.data.status === 'completed') {
            console.log('✅ VIDEO GENERATION COMPLETED!');
            console.log(`   Video URL: ${statusResponse.data.video_url}`);
            console.log(`   Duration: ${statusResponse.data.duration}s`);
            console.log(`   Thumbnail: ${statusResponse.data.thumbnail_url}`);
            console.log('\n🎉 HeyGen API Integration Test: SUCCESS');
        } else if (statusResponse.data.status === 'failed') {
            console.log('❌ Video generation failed');
            console.log(`   Error: ${statusResponse.data.error?.message}`);
        }

    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
    }
}

main();
