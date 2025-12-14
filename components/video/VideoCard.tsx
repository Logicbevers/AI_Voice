"use client";

import * as React from "react";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui";
import { Play, Download, Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VideoJob {
    id: string;
    status: string;
    videoUrl?: string;
    duration?: number;
    createdAt: Date;
    completedAt?: Date;
}

interface Project {
    id: string;
    title: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    videoJob?: VideoJob;
}

interface VideoCardProps {
    project: Project;
    onPlay?: () => void;
    onDownload?: () => void;
    onDelete?: () => void;
}

export function VideoCard({ project, onPlay, onDownload, onDelete }: VideoCardProps) {
    const latestJob = project.videoJob;
    const hasVideo = latestJob?.status === "completed" && latestJob.videoUrl;

    return (
        <div className="group relative rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800">
                {hasVideo ? (
                    <>
                        <video
                            src={latestJob.videoUrl}
                            className="w-full h-full object-cover"
                            preload="metadata"
                        />
                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={onPlay}
                                className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                            >
                                <Play className="h-8 w-8 text-neutral-900 ml-1" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Clock className="h-12 w-12 text-neutral-400" />
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                    <StatusBadge status={latestJob?.status as any || "draft"} />
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-1">
                    {project.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    <Clock className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {hasVideo && (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onPlay}
                                leftIcon={<Play className="h-4 w-4" />}
                                className="flex-1"
                            >
                                Play
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onDownload}
                                leftIcon={<Download className="h-4 w-4" />}
                            >
                                Download
                            </Button>
                        </>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onDelete}
                        leftIcon={<Trash2 className="h-4 w-4" />}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
