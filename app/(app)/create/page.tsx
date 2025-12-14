"use client";

import * as React from "react";
import { useEffect } from "react";
import { AppLayout, Container } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { VideoCreationProvider, useVideoCreation } from "@/lib/contexts/VideoCreationContext";
import { VideoCreationWizard } from "@/components/video";
import { Video } from "lucide-react";

function CreateVideoContent() {
    const { loadTemplate } = useVideoCreation();

    useEffect(() => {
        // Check if a template was selected
        const templateData = localStorage.getItem("selectedTemplate");
        if (templateData) {
            try {
                const template = JSON.parse(templateData);
                loadTemplate(template);
                localStorage.removeItem("selectedTemplate");
            } catch (error) {
                console.error("Failed to load template:", error);
            }
        }
    }, [loadTemplate]);

    return (
        <AppLayout>
            <Container size="full">
                <div className="py-8">
                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                                <Video className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                    Create AI Video
                                </h1>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Generate professional videos with AI avatars in minutes
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Wizard */}
                    <VideoCreationProvider>
                        <VideoCreationWizard />
                    </VideoCreationProvider>
                </div>
            </Container>
        </AppLayout>
    );
}

export default function CreatePage() {
    return (
        <ProtectedRoute>
            <VideoCreationProvider>
                <CreateVideoContent />
            </VideoCreationProvider>
        </ProtectedRoute>
    );
}
