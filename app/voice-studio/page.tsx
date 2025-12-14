'use client';

import { useState } from 'react';
import { useWorkspace } from '@/lib/contexts/WorkspaceContext';
import TextInput from '@/components/voice-studio/TextInput';
import VoiceSelector from '@/components/voice-studio/VoiceSelector';
import AdvancedControls from '@/components/voice-studio/AdvancedControls';
import AudioPreview from '@/components/voice-studio/AudioPreview';
import JobHistory from '@/components/voice-studio/JobHistory';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui';
import { Voice } from '@/components/voice-studio/VoiceSelector';
import { TtsJob } from '@prisma/client';

export default function VoiceStudioPage() {
    const { currentWorkspace } = useWorkspace();
    const { addToast } = useToast();

    const [text, setText] = useState('');
    const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
    const [stability, setStability] = useState(0.5);
    const [similarityBoost, setSimilarityBoost] = useState(0.75);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentAudio, setCurrentAudio] = useState<TtsJob | null>(null);
    const [refreshHistory, setRefreshHistory] = useState(0);

    const handleGenerate = async () => {
        if (!text || !selectedVoice) {
            addToast({
                title: 'Missing fields',
                description: 'Please enter text and select a voice',
                variant: 'error',
            });
            return;
        }

        if (!currentWorkspace) {
            addToast({
                title: 'No workspace',
                description: 'Please select a workspace',
                variant: 'error',
            });
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch('/api/tts/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    voiceId: selectedVoice.id,
                    voiceName: selectedVoice.name,
                    modelId: 'eleven_multilingual_v2',
                    stability,
                    similarityBoost,
                    workspaceId: currentWorkspace.id,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to generate audio');
            }

            const job = await response.json();
            setCurrentAudio(job);
            setRefreshHistory(prev => prev + 1);

            addToast({
                title: 'Audio generated!',
                description: 'Your audio is ready to play',
                variant: 'success',
            });
        } catch (error) {
            console.error('Generation error:', error);
            addToast({
                title: 'Generation failed',
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: 'error',
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Voice Studio</h1>
                <p className="text-muted-foreground">
                    Generate high-quality AI voiceovers with ElevenLabs
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel: Controls */}
                <div className="space-y-6">
                    <TextInput value={text} onChange={setText} />

                    <VoiceSelector
                        selectedVoice={selectedVoice}
                        onSelectVoice={setSelectedVoice}
                    />

                    <AdvancedControls
                        stability={stability}
                        similarityBoost={similarityBoost}
                        onStabilityChange={setStability}
                        onSimilarityBoostChange={setSimilarityBoost}
                    />

                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !text || !selectedVoice}
                        className="w-full"
                        size="lg"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            'Generate Audio'
                        )}
                    </Button>
                </div>

                {/* Right Panel: Preview & History */}
                <div className="space-y-6">
                    <AudioPreview audio={currentAudio} />

                    <JobHistory
                        workspaceId={currentWorkspace?.id}
                        refresh={refreshHistory}
                        onSelectJob={setCurrentAudio}
                    />
                </div>
            </div>
        </div>
    );
}
