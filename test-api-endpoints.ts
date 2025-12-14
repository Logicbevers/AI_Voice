import axios from 'axios';

async function testElevenLabsAPI() {
    const apiKey = '32e73a910799101531ebbf728c6079d1a058e2b0fab95944d9a00ef8f753d1be';

    console.log('Testing ElevenLabs API endpoints...\n');

    // Try different endpoint formats
    const endpoints = [
        'https://api.elevenlabs.io/v1/voices',
        'https://api.elevenlabs.io/v1/user',
    ];

    for (const url of endpoints) {
        console.log(`Testing: ${url}`);
        try {
            const response = await axios.get(url, {
                headers: {
                    'xi-api-key': apiKey,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Success!');
            console.log('Response:', JSON.stringify(response.data, null, 2).substring(0, 500));
            break;
        } catch (error: any) {
            console.log('❌ Failed:', error.response?.status, error.response?.data?.detail?.message || error.message);
        }
        console.log('');
    }
}

testElevenLabsAPI();
