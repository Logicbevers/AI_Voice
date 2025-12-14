"use client";

import * as React from "react";
import { Avatar } from "@/lib/data/avatars";
import { Badge } from "@/components/ui";

interface AvatarCardProps {
    avatar: Avatar;
    onClick?: () => void;
    isSelected?: boolean;
}

export function AvatarCard({ avatar, onClick, isSelected }: AvatarCardProps) {
    return (
        <button
            onClick={onClick}
            className={`group relative p-4 rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 text-left ${isSelected
                ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
        >
            {/* Avatar Image */}
            <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-neutral-100 dark:bg-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={avatar.thumbnail}
                    alt={avatar.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
            </div>

            {/* Avatar Info */}
            <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {avatar.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="default">
                        {avatar.gender}
                    </Badge>
                    <Badge variant="default">
                        {avatar.style}
                    </Badge>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {avatar.description}
                </p>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                    <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
            )}
        </button>
    );
}
