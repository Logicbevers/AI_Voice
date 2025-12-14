"use client";

import * as React from "react";
import { useState } from "react";
import { Modal, Button } from "@/components/ui";
import { useToast } from "@/components/ui";
import { X, Copy, Check, Link as LinkIcon } from "lucide-react";

interface ShareModalProps {
    projectId: string;
    projectName: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ShareModal({
    projectId,
    projectName,
    isOpen,
    onClose,
}: ShareModalProps) {
    const { addToast } = useToast();
    const [shareUrl, setShareUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    React.useEffect(() => {
        if (isOpen && projectId) {
            fetchShareUrl();
        }
    }, [isOpen, projectId]);

    const fetchShareUrl = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/share`);
            if (response.ok) {
                const data = await response.json();
                setShareUrl(data.shareUrl);
            } else {
                throw new Error("Failed to generate share URL");
            }
        } catch (error) {
            addToast({
                title: "Error",
                description: "Failed to generate share link",
                variant: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            addToast({
                title: "Link copied!",
                description: "Share link copied to clipboard",
                variant: "success",
            });

            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            addToast({
                title: "Error",
                description: "Failed to copy link",
                variant: "error",
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <LinkIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                Share Video
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {projectName}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Share URL */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Share Link
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-sm"
                                />
                                <Button
                                    onClick={handleCopy}
                                    leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    variant={copied ? "success" : "primary"}
                                >
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 border border-primary-200 dark:border-primary-800 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                            <p className="text-sm text-primary-800 dark:text-primary-200">
                                <strong>Note:</strong> This is a shareable link to your video. Anyone with this link can view the video.
                            </p>
                        </div>
                    </>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
