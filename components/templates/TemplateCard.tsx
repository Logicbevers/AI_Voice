"use client";

import * as React from "react";
import { VideoTemplate } from "@/lib/data/templates";
import { Badge } from "@/components/ui";
import { Clock, Play } from "lucide-react";

interface TemplateCardProps {
    template: VideoTemplate;
    onUse: () => void;
    onPreview: () => void;
}

export function TemplateCard({ template, onUse, onPreview }: TemplateCardProps) {
    return (
        <div className="group relative rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                    <Badge variant="default" className="bg-white/90 dark:bg-neutral-900/90">
                        {template.category}
                    </Badge>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 text-white text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{template.estimatedDuration}s</span>
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onPreview}
                        className="w-14 h-14 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                    >
                        <Play className="h-6 w-6 text-neutral-900 ml-0.5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-1">
                    {template.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                    {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Use Button */}
                <button
                    onClick={onUse}
                    className="w-full px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
                >
                    Use Template
                </button>
            </div>
        </div>
    );
}
