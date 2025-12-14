"use client";

import * as React from "react";
import { useVideoCreation } from "@/lib/contexts/VideoCreationContext";
import { languages, voiceGenders } from "@/lib/data/voices";
import { Select, Button } from "@/components/ui";
import { Volume2, Play } from "lucide-react";

export function VoiceCustomization() {
    const { state, setVoiceSettings } = useVideoCreation();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Customize Voice Settings
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                    Choose the language and voice characteristics for your video.
                </p>
            </div>

            {/* Language Selection */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Language
                </label>
                <select
                    value={state.voiceSettings.language}
                    onChange={(e) => setVoiceSettings({ language: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Voice Gender */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Voice Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {voiceGenders.map((gender) => (
                        <button
                            key={gender.value}
                            onClick={() => setVoiceSettings({ gender: gender.value })}
                            className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${state.voiceSettings.gender === gender.value
                                    ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                                }`}
                        >
                            {gender.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Voice Speed */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Speaking Speed
                    </label>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {state.voiceSettings.speed.toFixed(1)}x
                    </span>
                </div>
                <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={state.voiceSettings.speed}
                    onChange={(e) => setVoiceSettings({ speed: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span>Slower (0.5x)</span>
                    <span>Normal (1.0x)</span>
                    <span>Faster (2.0x)</span>
                </div>
            </div>

            {/* Voice Pitch */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Voice Pitch
                    </label>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {state.voiceSettings.pitch > 0 ? "+" : ""}
                        {state.voiceSettings.pitch}
                    </span>
                </div>
                <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={state.voiceSettings.pitch}
                    onChange={(e) => setVoiceSettings({ pitch: parseInt(e.target.value) })}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span>Lower (-10)</span>
                    <span>Normal (0)</span>
                    <span>Higher (+10)</span>
                </div>
            </div>

            {/* Voice Preview */}
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <Volume2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                                Preview Voice
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Hear a sample with your settings
                            </p>
                        </div>
                    </div>
                    <Button size="sm" variant="outline" disabled>
                        <Play className="h-4 w-4 mr-2" />
                        Play Sample
                    </Button>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">
                    Voice preview will be available once you connect to a voice generation service.
                </p>
            </div>
        </div>
    );
}
