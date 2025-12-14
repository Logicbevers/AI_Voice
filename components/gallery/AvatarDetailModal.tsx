"use client";

import * as React from "react";
import { Avatar } from "@/lib/data/avatars";
import { Modal, Button, Badge } from "@/components/ui";
import { X, Check } from "lucide-react";

interface AvatarDetailModalProps {
    avatar: Avatar | null;
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (avatar: Avatar) => void;
}

export function AvatarDetailModal({
    avatar,
    isOpen,
    onClose,
    onSelect,
}: AvatarDetailModalProps) {
    if (!avatar) return null;

    const handleSelect = () => {
        if (onSelect) {
            onSelect(avatar);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors z-10"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="grid md:grid-cols-2 gap-6 p-6">
                    {/* Avatar Preview */}
                    <div>
                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={avatar.thumbnail}
                                alt={avatar.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Avatar Details */}
                    <div className="flex flex-col">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                                {avatar.name}
                            </h2>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="default">{avatar.gender}</Badge>
                                <Badge variant="default">{avatar.style}</Badge>
                            </div>

                            <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                                {avatar.description}
                            </p>

                            {/* Characteristics */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                    Best For
                                </h3>
                                <ul className="space-y-2">
                                    {avatar.style === "professional" && (
                                        <>
                                            <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <Check className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                                                <span>Corporate presentations</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <Check className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                                                <span>Business communications</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <Check className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                                                <span>Training videos</span>
                                            </li>
                                        </>
                                    )}
                                    {avatar.style === "friendly" && (
                                        <>
                                            <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <Check className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                                                <span>Educational content</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <Check className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                                                <span>Customer support</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <Check className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                                                <span>Product demos</span>
                                            </li>
                                        </>
                                    )}
                                    {avatar.style === "casual" && (
                                        <>
                                            <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <Check className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                                                <span>Social media content</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <Check className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                                                <span>Lifestyle videos</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <Check className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                                                <span>Creative content</span>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {onSelect && (
                            <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                <Button variant="ghost" onClick={onClose} className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={handleSelect} className="flex-1">
                                    Use This Avatar
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
