"use client";

import * as React from "react";
import { VideoTemplate } from "@/lib/data/templates";
import { Modal, Button, Badge } from "@/components/ui";
import { X, Clock, User, Mic, Video as VideoIcon } from "lucide-react";

interface TemplatePreviewModalProps {
    template: VideoTemplate | null;
    isOpen: boolean;
    onClose: () => void;
    onUse: () => void;
}

export function TemplatePreviewModal({
    template,
    isOpen,
    onClose,
    onUse,
}: TemplatePreviewModalProps) {
    if (!template) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="relative p-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Preview */}
                    <div>
                        <div className="aspect-video rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={template.thumbnail}
                                alt={template.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <Badge variant="default">{template.category}</Badge>
                            <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                                <Clock className="h-4 w-4" />
                                <span>{template.estimatedDuration}s</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {template.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                {template.name}
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                {template.description}
                            </p>

                            {/* Script */}
                            <div className="mb-4">
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                    Script Preview
                                </h3>
                                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-h-32 overflow-y-auto">
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                        {template.script}
                                    </p>
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-neutral-500" />
                                    <span className="text-neutral-600 dark:text-neutral-400">
                                        Avatar: {template.avatar.name} ({template.avatar.style})
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Mic className="h-4 w-4 text-neutral-500" />
                                    <span className="text-neutral-600 dark:text-neutral-400">
                                        Voice: {template.voiceSettings.language} • {template.voiceSettings.gender}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <VideoIcon className="h-4 w-4 text-neutral-500" />
                                    <span className="text-neutral-600 dark:text-neutral-400">
                                        Format: {template.videoSettings.format}
                                    </span>
                                </div>
                            </div>

                            {/* Use Cases */}
                            <div className="mb-4">
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                    Perfect For
                                </h3>
                                <ul className="space-y-1">
                                    {template.useCases.map((useCase, index) => (
                                        <li
                                            key={index}
                                            className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2"
                                        >
                                            <span className="text-primary-600 mt-1">•</span>
                                            <span>{useCase}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <Button variant="ghost" onClick={onClose} className="flex-1">
                                Cancel
                            </Button>
                            <Button onClick={onUse} className="flex-1">
                                Use This Template
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
