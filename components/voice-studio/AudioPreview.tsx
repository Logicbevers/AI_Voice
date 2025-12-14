'use client';

import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Download, Copy, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui';

import { TtsJob } from '@prisma/client';

interface AudioPreviewProps {
    audio: TtsJob | null;
}

export default function AudioPreview({ audio }: AudioPreviewProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const { addToast } = useToast();

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
            audioRef.current.addEventListener('ended', () => setIsPlaying(false));
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, [audio]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleDownload = () => {
        if (audio?.audioUrl) {
            const link = document.createElement('a');
            link.href = audio.audioUrl;
            link.download = `audio-${audio.id}.mp3`;
            link.click();
        }
    };

    const handleCopyUrl = () => {
        if (audio?.audioUrl) {
            const fullUrl = `${window.location.origin}${audio.audioUrl}`;
            navigator.clipboard.writeText(fullUrl);
            addToast({
                title: 'Copied!',
                description: 'Audio URL copied to clipboard',
                variant: 'success',
            });
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!audio) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Audio Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        Generate audio to preview it here
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Audio Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Audio Player */}
                <div className="space-y-2">
                    <audio ref={audioRef} src={audio.audioUrl} />

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={togglePlayPause}
                            disabled={!audio.audioUrl}
                        >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>

                        <div className="flex-1">
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-muted-foreground">Voice:</span>
                        <span className="ml-2 font-medium">{audio.voiceName}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Status:</span>
                        <span className="ml-2 font-medium capitalize">{audio.status}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Stability:</span>
                        <span className="ml-2 font-medium">{audio.stability?.toFixed(2)}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Similarity:</span>
                        <span className="ml-2 font-medium">{audio.similarityBoost?.toFixed(2)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={!audio.audioUrl}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyUrl}
                        disabled={!audio.audioUrl}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy URL
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
