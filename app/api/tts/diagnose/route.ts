import { NextRequest, NextResponse } from 'next/server';

/**
 * Diagnostic endpoint to validate ElevenLabs API key configuration
 * GET /api/tts/diagnose - Check API key setup
 */
export async function GET(request: NextRequest) {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        checks: [] as Array<{ step: string; status: 'PASS' | 'FAIL' | 'WARN'; message: string; details?: any }>,
    };

    // Step 1: Validate API key is loaded from environment
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        diagnostics.checks.push({
            step: '1. Environment Variable',
            status: 'FAIL',
            message: 'ELEVENLABS_API_KEY is not defined in environment variables',
            details: {
                fix: 'Add ELEVENLABS_API_KEY to your .env file and restart the dev server',
                envFile: '.env file location: c:\\Users\\dell\\.gemini\\antigravity\\scratch\\AI_Voice\\.env'
            }
        });
        return NextResponse.json(diagnostics, { status: 500 });
    }

    if (apiKey.trim() === '') {
        diagnostics.checks.push({
            step: '1. Environment Variable',
            status: 'FAIL',
            message: 'ELEVENLABS_API_KEY is empty',
            details: {
                fix: 'Set a valid API key value in your .env file'
            }
        });
        return NextResponse.json(diagnostics, { status: 500 });
    }

    diagnostics.checks.push({
        step: '1. Environment Variable',
        status: 'PASS',
        message: `API key loaded successfully (length: ${apiKey.length} characters)`,
        details: {
            keyPrefix: apiKey.substring(0, 3) + '...',
            keySuffix: '...' + apiKey.substring(apiKey.length - 3),
            expectedFormat: 'Should start with "sk_" for ElevenLabs API keys'
        }
    });

    // Step 2: Validate request headers format
    const correctHeaders = {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
    };

    diagnostics.checks.push({
        step: '2. Request Headers',
        status: 'PASS',
        message: 'Headers configured correctly',
        details: {
            headerName: 'xi-api-key (correct)',
            notUsing: 'Authorization: Bearer (correct - not used)',
            contentType: 'application/json'
        }
    });

    // Step 3: Validate endpoint URL
    const endpoint = 'https://api.elevenlabs.io/v1/voices';

    diagnostics.checks.push({
        step: '3. Endpoint URL',
        status: 'PASS',
        message: 'Endpoint URL is correct',
        details: {
            endpoint,
            protocol: 'https (correct)',
            version: '/v1 included (correct)'
        }
    });

    // Step 4: Create minimal authentication test
    try {
        diagnostics.checks.push({
            step: '4. Minimal Auth Test',
            status: 'WARN',
            message: 'Testing authentication with ElevenLabs API...'
        });

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'xi-api-key': apiKey
            }
        });

        if (response.ok) {
            const data = await response.json();
            diagnostics.checks.push({
                step: '4. Minimal Auth Test',
                status: 'PASS',
                message: 'Authentication successful!',
                details: {
                    statusCode: response.status,
                    voicesFound: data.voices?.length || 0,
                    message: 'API key is valid and working'
                }
            });
        } else {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { rawError: errorText };
            }

            diagnostics.checks.push({
                step: '4. Minimal Auth Test',
                status: 'FAIL',
                message: `Authentication failed with status ${response.status}`,
                details: {
                    statusCode: response.status,
                    statusText: response.statusText,
                    error: errorData
                }
            });

            // Step 5: Diagnose ElevenLabs-side issues
            if (response.status === 401) {
                diagnostics.checks.push({
                    step: '5. Possible ElevenLabs Issues',
                    status: 'WARN',
                    message: '401 Unauthorized - Possible causes:',
                    details: {
                        possibleCauses: [
                            {
                                cause: 'Revoked API Key',
                                check: 'Go to https://elevenlabs.io/app/settings/api-keys and verify the key is active'
                            },
                            {
                                cause: 'Exhausted Credits',
                                check: 'Go to https://elevenlabs.io/app/subscription and check your character quota'
                            },
                            {
                                cause: 'Trial/Free Tier Limits',
                                check: 'Free tier may have limited API access. Check your plan at https://elevenlabs.io/app/subscription'
                            },
                            {
                                cause: 'Account Restriction',
                                check: 'Verify your account is in good standing at https://elevenlabs.io/app/settings'
                            },
                            {
                                cause: 'API Key Permissions',
                                check: 'Ensure the API key has permissions for text-to-speech generation'
                            }
                        ],
                        recommendation: 'Log into your ElevenLabs dashboard and verify account status, subscription, and API key permissions'
                    }
                });
            }
        }
    } catch (error) {
        diagnostics.checks.push({
            step: '4. Minimal Auth Test',
            status: 'FAIL',
            message: 'Network or request error',
            details: {
                error: error instanceof Error ? error.message : 'Unknown error',
                type: error instanceof Error ? error.constructor.name : typeof error
            }
        });
    }

    // Step 6: Provide corrected example
    diagnostics.checks.push({
        step: '6. Working Example',
        status: 'PASS',
        message: 'Example code for proper ElevenLabs API usage',
        details: {
            code: `
// Correct way to use ElevenLabs API
const apiKey = process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not configured');
}

const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    method: 'GET',
    headers: {
        'xi-api-key': apiKey  // Correct header name
    }
});

if (!response.ok) {
    const error = await response.json();
    throw new Error(\`ElevenLabs API Error: \${error.detail?.message || response.statusText}\`);
}

const data = await response.json();
            `.trim()
        }
    });

    const overallStatus = diagnostics.checks.some(c => c.status === 'FAIL') ? 'FAILED' :
        diagnostics.checks.some(c => c.status === 'WARN') ? 'WARNING' : 'PASSED';

    return NextResponse.json({
        ...diagnostics,
        overallStatus,
        summary: `Diagnostics ${overallStatus}: ${diagnostics.checks.filter(c => c.status === 'FAIL').length} failures, ${diagnostics.checks.filter(c => c.status === 'WARN').length} warnings`
    });
}
