'use client';

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/Label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export interface Voice {
    id: string;
    name: string;
    gender?: string;
    language?: string;
    accent?: string;
    description?: string;
    previewUrl?: string;
}

interface VoiceSelectorProps {
    selectedVoice: Voice | null;
    onSelectVoice: (voice: Voice) => void;
}

export default function VoiceSelector({ selectedVoice, onSelectVoice }: VoiceSelectorProps) {
    const [voices, setVoices] = useState<Voice[]>([]);
    const [groupedVoices, setGroupedVoices] = useState<Record<string, Voice[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVoices = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/tts/options');

                if (!response.ok) {
                    throw new Error('Failed to fetch voices');
                }

                const data = await response.json();
                setVoices(data.voices || []);
                setGroupedVoices(data.groupedVoices || {});
            } catch (err) {
                console.error('Error fetching voices:', err);
                setError(err instanceof Error ? err.message : 'Failed to load voices');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVoices();
    }, []);

    // Auto-select first voice when loaded
    useEffect(() => {
        if (voices.length > 0 && !selectedVoice) {
            onSelectVoice(voices[0]);
        }
    }, [voices, selectedVoice, onSelectVoice]);

    if (isLoading) {
        return (
            <div className="space-y-2">
                <Label>Voice</Label>
                <div className="flex items-center justify-center p-8 border rounded-md">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading voices...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-2">
                <Label>Voice</Label>
                <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="voice-select">Voice</Label>
            <Select
                value={selectedVoice?.id}
                onValueChange={(voiceId) => {
                    const voice = voices.find(v => v.id === voiceId);
                    if (voice) onSelectVoice(voice);
                }}
            >
                <SelectTrigger id="voice-select">
                    <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(groupedVoices).map(([language, langVoices]) => (
                        <div key={language}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                                {language}
                            </div>
                            {langVoices.map((voice) => (
                                <SelectItem key={voice.id} value={voice.id}>
                                    <div className="flex items-center justify-between w-full">
                                        <span>{voice.name}</span>
                                        {voice.gender && (
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                {voice.gender}
                                            </span>
                                        )}
                                    </div>
                                </SelectItem>
                            ))}
                        </div>
                    ))}
                </SelectContent>
            </Select>

            {selectedVoice && (
                <div className="text-sm text-muted-foreground">
                    {selectedVoice.description && <p>{selectedVoice.description}</p>}
                    {selectedVoice.accent && <p>Accent: {selectedVoice.accent}</p>}
                </div>
            )}
        </div>
    );
}
