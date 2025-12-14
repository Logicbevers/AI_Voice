"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useVideoCreation } from "@/lib/contexts/VideoCreationContext";
import { Badge } from "@/components/ui";
import { Check, User, Loader2 } from "lucide-react";

interface HeyGenAvatar {
    avatar_id: string;
    avatar_name: string;
    preview_image_url?: string;
    gender?: string;
}

export function AvatarGallery() {
    const { state, setSelectedAvatar } = useVideoCreation();
    const [filter, setFilter] = useState<"all" | "male" | "female">("all");
    const [avatars, setAvatars] = useState<HeyGenAvatar[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAvatars = async () => {
            try {
                console.log('🎭 Fetching avatars from /api/heygen/avatars...');
                setIsLoading(true);
                const response = await fetch("/api/heygen/avatars");

                console.log('📡 Avatar API response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('❌ Avatar API error:', errorData);
                    throw new Error(errorData.error || "Failed to fetch avatars");
                }

                const data = await response.json();
                console.log('✅ Avatars loaded:', data.count, 'avatars');
                setAvatars(data.avatars || []);
            } catch (err) {
                console.error("❌ Error fetching avatars:", err);
                setError(err instanceof Error ? err.message : "Failed to load avatars. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvatars();
    }, []);

    const filteredAvatars = avatars.filter((avatar) => {
        if (filter === "all") return true;
        return avatar.gender?.toLowerCase() === filter;
    });

    const handleSelectAvatar = (avatar: HeyGenAvatar) => {
        // Convert HeyGen avatar to our format
        const gender = avatar.gender?.toLowerCase();
        setSelectedAvatar({
            id: avatar.avatar_id,
            name: avatar.avatar_name,
            thumbnail: avatar.preview_image_url || "/placeholder-avatar.png",
            gender: (gender === "male" || gender === "female") ? gender : "male",
            style: "professional",
            description: `AI Avatar: ${avatar.avatar_name}`,
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
                    <p className="text-neutral-600 dark:text-neutral-400">Loading avatars...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 border border-error-DEFAULT/20 rounded-lg bg-error-DEFAULT/10">
                <p className="text-sm font-medium text-error-DEFAULT">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Choose Your Avatar
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                    Select an AI avatar to present your video content.
                </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Filter:
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === "all"
                            ? "bg-primary-600 text-white"
                            : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                            }`}
                    >
                        All ({avatars.length})
                    </button>
                    <button
                        onClick={() => setFilter("male")}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === "male"
                            ? "bg-primary-600 text-white"
                            : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                            }`}
                    >
                        Male
                    </button>
                    <button
                        onClick={() => setFilter("female")}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === "female"
                            ? "bg-primary-600 text-white"
                            : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                            }`}
                    >
                        Female
                    </button>
                </div>
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAvatars.map((avatar) => {
                    const isSelected = state.selectedAvatar?.id === avatar.avatar_id;

                    return (
                        <button
                            key={avatar.avatar_id}
                            onClick={() => handleSelectAvatar(avatar)}
                            className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${isSelected
                                ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                                : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                                }`}
                        >
                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                                    <Check className="h-4 w-4 text-white" />
                                </div>
                            )}

                            {/* Avatar Image */}
                            <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-neutral-100 dark:bg-neutral-800">
                                {avatar.preview_image_url ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={avatar.preview_image_url}
                                            alt={avatar.avatar_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="h-12 w-12 text-neutral-400" />
                                    </div>
                                )}
                            </div>

                            {/* Avatar Info */}
                            <div className="text-left">
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                    {avatar.avatar_name}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                    {avatar.gender && (
                                        <Badge variant="default">
                                            {avatar.gender}
                                        </Badge>
                                    )}
                                    <Badge variant="default">
                                        HeyGen
                                    </Badge>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* No Avatars State */}
            {filteredAvatars.length === 0 && !isLoading && (
                <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                        No avatars found for this filter.
                    </p>
                </div>
            )}

            {/* No Selection State */}
            {!state.selectedAvatar && (
                <div className="p-4 border border-warning-DEFAULT/20 rounded-lg bg-warning-DEFAULT/10">
                    <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-warning-DEFAULT flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-warning-DEFAULT">
                                Please select an avatar to continue
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
