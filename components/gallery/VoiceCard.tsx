"use client";

import * as React from "react";
import { VoiceOption } from "@/lib/data/voices";
import { languages } from "@/lib/data/voices";
import { Badge } from "@/components/ui";
import { Play, Pause, Volume2 } from "lucide-react";

interface VoiceCardProps {
    voice: VoiceOption;
    onPreview: () => void;
    isPlaying?: boolean;
}

export function VoiceCard({ voice, onPreview, isPlaying }: VoiceCardProps) {
    const languageInfo = languages.find((l) => l.code === voice.language);

    return (
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                            <Volume2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                {voice.name}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {languageInfo?.flag} {languageInfo?.name}
                                {voice.accent && ` • ${voice.accent}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-13">
                        <Badge variant="default">{voice.gender}</Badge>
                        {voice.accent && <Badge variant="default">{voice.accent}</Badge>}
                    </div>
                </div>

                {/* Preview Button */}
                <button
                    onClick={onPreview}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isPlaying
                            ? "bg-primary-600 hover:bg-primary-700 text-white"
                            : "bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 text-primary-600 dark:text-primary-400"
                        }`}
                >
                    {isPlaying ? (
                        <Pause className="h-5 w-5" />
                    ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                    )}
                </button>
            </div>

            {/* Waveform Animation (when playing) */}
            {isPlaying && (
                <div className="mt-3 flex items-center gap-1 h-8">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-primary-600 rounded-full animate-pulse"
                            style={{
                                height: `${Math.random() * 100}%`,
                                animationDelay: `${i * 50}ms`,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
