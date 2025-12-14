"use client";

import * as React from "react";
import { useVideoCreation } from "@/lib/contexts/VideoCreationContext";
import { videoFormats, backgroundOptions } from "@/lib/data/voices";
import { Check, Monitor, Smartphone, Square } from "lucide-react";

export function VideoSettings() {
    const { state, setVideoSettings } = useVideoCreation();

    const formatIcons = {
        "16:9": Monitor,
        "9:16": Smartphone,
        "1:1": Square,
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Video Settings
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                    Configure the format and appearance of your video.
                </p>
            </div>

            {/* Video Format */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Video Format
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {videoFormats.map((format) => {
                        const Icon = formatIcons[format.value as keyof typeof formatIcons];
                        const isSelected = state.videoSettings.format === format.value;

                        return (
                            <button
                                key={format.value}
                                onClick={() => setVideoSettings({ format: format.value })}
                                className={`relative p-4 rounded-lg border-2 transition-all text-left ${isSelected
                                        ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                                    }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                                        <Icon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                            {format.label}
                                        </h4>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {format.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Background */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Background
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {backgroundOptions.map((bg) => {
                        const isSelected = state.videoSettings.background === bg.value;

                        return (
                            <button
                                key={bg.id}
                                onClick={() => setVideoSettings({ background: bg.value })}
                                className={`relative aspect-square rounded-lg border-2 transition-all ${isSelected
                                        ? "border-primary-600"
                                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                                    }`}
                                style={{ backgroundColor: bg.value }}
                            >
                                {isSelected && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                                            <Check className="h-4 w-4 text-primary-600" />
                                        </div>
                                    </div>
                                )}
                                <span className="sr-only">{bg.label}</span>
                            </button>
                        );
                    })}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                    Selected: {backgroundOptions.find((bg) => bg.value === state.videoSettings.background)?.label}
                </p>
            </div>

            {/* Subtitles */}
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                            Subtitles
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Display captions during the video
                        </p>
                    </div>
                    <button
                        onClick={() => setVideoSettings({ subtitles: !state.videoSettings.subtitles })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.videoSettings.subtitles
                                ? "bg-primary-600"
                                : "bg-neutral-300 dark:bg-neutral-700"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${state.videoSettings.subtitles ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
