"use client";

import * as React from "react";
import { Asset } from "@/lib/data/assets";
import { Badge } from "@/components/ui";
import { Image as ImageIcon, FileVideo, FileAudio, Sparkles, Trash2 } from "lucide-react";

interface AssetCardProps {
    asset: Asset;
    onDelete?: () => void;
}

export function AssetCard({ asset, onDelete }: AssetCardProps) {
    const getIcon = () => {
        switch (asset.type) {
            case "logo":
                return <Sparkles className="h-4 w-4" />;
            case "image":
                return <ImageIcon className="h-4 w-4" />;
            case "video":
                return <FileVideo className="h-4 w-4" />;
            case "audio":
                return <FileAudio className="h-4 w-4" />;
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="group relative rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all">
            {/* Thumbnail */}
            <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={asset.thumbnail}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                />

                {/* Type Badge */}
                <div className="absolute top-2 left-2">
                    <Badge variant="default" className="bg-white/90 dark:bg-neutral-900/90 flex items-center gap-1">
                        {getIcon()}
                        {asset.type}
                    </Badge>
                </div>

                {/* Delete Button */}
                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-3">
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1 line-clamp-1">
                    {asset.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                    {formatSize(asset.size)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    {asset.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
