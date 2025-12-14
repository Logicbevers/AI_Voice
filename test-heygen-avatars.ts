import { getHeyGenClient } from './lib/heygen';

async function main() {
    console.log('🎭 Testing HeyGen API - Listing Avatars...\n');

    try {
        const client = getHeyGenClient();

        console.log('📡 Fetching avatars from HeyGen API...');
        const avatars = await client.listAvatars();

        console.log(`\n✅ Found ${avatars.length} avatars:\n`);

        // Show first 10 avatars
        avatars.slice(0, 10).forEach((avatar, index) => {
            console.log(`${index + 1}. ${avatar.avatar_name}`);
            console.log(`   ID: ${avatar.avatar_id}`);
            console.log(`   Gender: ${avatar.gender || 'N/A'}`);
            console.log('');
        });

        if (avatars.length > 10) {
            console.log(`... and ${avatars.length - 10} more avatars`);
        }

        console.log('\n💡 Recommendation: Use one of these avatar IDs in your video generation');

    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
    }
}

main();
