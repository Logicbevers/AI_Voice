"use client";

import * as React from "react";
import { useState } from "react";
import { Modal, Button } from "@/components/ui";
import { X, Download, Share2 } from "lucide-react";
import { useToast } from "@/components/ui";
import { ShareModal } from "./ShareModal";

interface VideoPlayerModalProps {
    videoUrl: string | null;
    projectName: string;
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function VideoPlayerModal({
    videoUrl,
    projectName,
    projectId,
    isOpen,
    onClose,
}: VideoPlayerModalProps) {
    const { addToast } = useToast();
    const [showShareModal, setShowShareModal] = useState(false);

    if (!videoUrl) return null;

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = videoUrl;
        link.download = `${projectName}.mp4`;
        link.click();

        addToast({
            title: "Download started",
            description: "Your video is being downloaded",
            variant: "success",
        });
    };

    const handleShare = () => {
        if (projectId) {
            setShowShareModal(true);
        } else {
            // Fallback to copying video URL
            navigator.clipboard.writeText(videoUrl);
            addToast({
                title: "Link copied!",
                description: "Video link copied to clipboard",
                variant: "success",
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <div className="relative bg-black">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                >
                    <X className="h-5 w-5 text-white" />
                </button>

                {/* Video Player */}
                <div className="flex items-center justify-center min-h-[80vh]">
                    <video
                        src={videoUrl}
                        controls
                        autoPlay
                        className="max-w-full max-h-[80vh]"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                                {projectName}
                            </h3>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleShare}
                                leftIcon={<Share2 className="h-4 w-4" />}
                                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                            >
                                Share
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleDownload}
                                leftIcon={<Download className="h-4 w-4" />}
                            >
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                projectId={projectId}
                projectName={projectName}
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
            />
        </Modal>
    );
}
