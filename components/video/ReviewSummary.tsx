"use client";

import * as React from "react";
import { useVideoCreation } from "@/lib/contexts/VideoCreationContext";
import { Button, Badge } from "@/components/ui";
import { FileText, User, Volume2, Monitor, Check, AlertCircle } from "lucide-react";

export function ReviewSummary() {
    const { state } = useVideoCreation();

    const canGenerate = state.script && state.selectedAvatar;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Review & Generate
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                    Review your video settings before generating.
                </p>
            </div>

            {/* Project Name */}
            {state.projectName && (
                <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        Project Name
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300">{state.projectName}</p>
                </div>
            )}

            {/* Script Summary */}
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                            Script
                        </h3>
                        {state.script ? (
                            <>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3 mb-2">
                                    {state.script}
                                </p>
                                <div className="flex gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                                    <span>{state.script.length} characters</span>
                                    <span>•</span>
                                    <span>{state.script.trim().split(/\s+/).filter(Boolean).length} words</span>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-error-DEFAULT">No script provided</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Avatar Summary */}
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                            Avatar
                        </h3>
                        {state.selectedAvatar ? (
                            <div className="flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={state.selectedAvatar.thumbnail}
                                    alt={state.selectedAvatar.name}
                                    className="w-12 h-12 rounded-lg"
                                />
                                <div>
                                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                        {state.selectedAvatar.name}
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="default" size="sm">
                                            {state.selectedAvatar.gender}
                                        </Badge>
                                        <Badge variant="default" size="sm">
                                            {state.selectedAvatar.style}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-error-DEFAULT">No avatar selected</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Voice Settings Summary */}
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <div className="flex items-start gap-3">
                    <Volume2 className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                            Voice Settings
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-neutral-500 dark:text-neutral-400">Language:</span>
                                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                    {state.voiceSettings.language}
                                </p>
                            </div>
                            <div>
                                <span className="text-neutral-500 dark:text-neutral-400">Gender:</span>
                                <p className="font-medium text-neutral-900 dark:text-neutral-100 capitalize">
                                    {state.voiceSettings.gender}
                                </p>
                            </div>
                            <div>
                                <span className="text-neutral-500 dark:text-neutral-400">Speed:</span>
                                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                    {state.voiceSettings.speed.toFixed(1)}x
                                </p>
                            </div>
                            <div>
                                <span className="text-neutral-500 dark:text-neutral-400">Pitch:</span>
                                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                    {state.voiceSettings.pitch > 0 ? "+" : ""}
                                    {state.voiceSettings.pitch}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Settings Summary */}
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <div className="flex items-start gap-3">
                    <Monitor className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                            Video Settings
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-neutral-500 dark:text-neutral-400">Format:</span>
                                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                    {state.videoSettings.format}
                                </p>
                            </div>
                            <div>
                                <span className="text-neutral-500 dark:text-neutral-400">Subtitles:</span>
                                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                    {state.videoSettings.subtitles ? "Enabled" : "Disabled"}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <span className="text-neutral-500 dark:text-neutral-400">Background:</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div
                                        className="w-6 h-6 rounded border border-neutral-300 dark:border-neutral-700"
                                        style={{ backgroundColor: state.videoSettings.background }}
                                    />
                                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                        {state.videoSettings.background}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Validation Message */}
            {!canGenerate && (
                <div className="p-4 border border-error-DEFAULT/20 rounded-lg bg-error-DEFAULT/10">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-error-DEFAULT flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-error-DEFAULT mb-1">
                                Cannot Generate Video
                            </h4>
                            <p className="text-sm text-error-DEFAULT/80">
                                Please provide a script and select an avatar before generating your video.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Estimated Time */}
            {canGenerate && (
                <div className="p-4 border border-primary-200 dark:border-primary-800 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                    <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-1">
                                Ready to Generate
                            </h4>
                            <p className="text-sm text-primary-800 dark:text-primary-200">
                                Estimated generation time: 2-5 minutes
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
