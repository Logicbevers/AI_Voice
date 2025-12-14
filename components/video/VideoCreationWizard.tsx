"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVideoCreation } from "@/lib/contexts/VideoCreationContext";
import { useWorkspace } from "@/lib/contexts/WorkspaceContext";
import { Button } from "@/components/ui";
import { useToast } from "@/components/ui";
import { ScriptInput } from "./ScriptInput";
import { AvatarGallery } from "./AvatarGallery";
import { VoiceCustomization } from "./VoiceCustomization";
import { VideoSettings } from "./VideoSettings";
import { ReviewSummary } from "./ReviewSummary";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const STEPS = [
    { id: 0, title: "Script", component: ScriptInput },
    { id: 1, title: "Avatar", component: AvatarGallery },
    { id: 2, title: "Voice", component: VoiceCustomization },
    { id: 3, title: "Video", component: VideoSettings },
    { id: 4, title: "Review", component: ReviewSummary },
];

export function VideoCreationWizard() {
    const router = useRouter();
    const { state, nextStep, previousStep, resetState } = useVideoCreation();
    const { currentWorkspace } = useWorkspace();
    const { addToast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);

    const currentStepData = STEPS[state.currentStep];
    const CurrentStepComponent = currentStepData.component;
    const isFirstStep = state.currentStep === 0;
    const isLastStep = state.currentStep === STEPS.length - 1;

    const canProceed = () => {
        switch (state.currentStep) {
            case 0: // Script
                return state.script.length > 0;
            case 1: // Avatar
                return state.selectedAvatar !== null;
            case 2: // Voice
            case 3: // Video
                return true;
            case 4: // Review
                return state.script && state.selectedAvatar;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (canProceed()) {
            nextStep();
        } else {
            addToast({
                title: "Required fields missing",
                description: "Please complete all required fields before continuing",
                variant: "error",
            });
        }
    };

    const handleGenerate = async () => {
        // DEBUGGER: Pause here to inspect state before video generation
        debugger;

        console.log('🎬 handleGenerate called');
        console.log('State:', {
            projectName: state.projectName,
            script: state.script?.substring(0, 50),
            avatar: state.selectedAvatar?.name,
            avatarId: state.selectedAvatar?.id,
            voiceSettings: state.voiceSettings,
            currentWorkspace: currentWorkspace?.id
        });

        if (!canProceed()) {
            console.error('❌ Cannot proceed - validation failed');
            addToast({
                title: "Cannot generate video",
                description: "Please provide a script and select an avatar",
                variant: "error",
            });
            return;
        }

        if (!currentWorkspace) {
            console.error('❌ No workspace selected');
            addToast({
                title: "No workspace selected",
                description: "Please select a workspace before generating a video",
                variant: "error",
            });
            return;
        }

        setIsGenerating(true);

        try {
            console.log('📝 Creating project...');
            // First, save the project
            const projectResponse = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: state.projectName || "Untitled Project",
                    workspaceId: currentWorkspace.id,
                    script: state.script,
                    settings: {
                        avatar: state.selectedAvatar,
                        voice: state.voiceSettings,
                        video: state.videoSettings,
                    },
                }),
            });

            console.log('📡 Project API response status:', projectResponse.status);

            if (!projectResponse.ok) {
                const errorData = await projectResponse.json();
                console.error('❌ Project creation failed:', errorData);
                throw new Error(errorData.error || "Failed to save project");
            }

            const { project } = await projectResponse.json();
            console.log('✅ Project created:', project.id);

            // Then, start video generation
            console.log('🎥 Starting video generation...');
            const generateResponse = await fetch(`/api/projects/${project.id}/generate`, {
                method: "POST",
            });

            console.log('📡 Generate API response status:', generateResponse.status);

            if (!generateResponse.ok) {
                const errorData = await generateResponse.json();
                console.error('❌ Video generation failed:', errorData);
                throw new Error(errorData.error || "Failed to start video generation");
            }

            const generateData = await generateResponse.json();
            console.log('✅ Video generation started:', generateData);

            addToast({
                title: "Video generation started!",
                description: "Your video is being generated. This may take a few minutes.",
                variant: "success",
            });

            // Reset wizard and redirect
            console.log('🔄 Resetting wizard and redirecting to /videos');
            resetState();
            router.push("/videos");
        } catch (error: any) {
            console.error('❌ Error in handleGenerate:', error);
            addToast({
                title: "Generation failed",
                description: error.message || "Failed to start video generation. Please try again.",
                variant: "error",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {STEPS.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${index < state.currentStep
                                        ? "bg-primary-600 text-white"
                                        : index === state.currentStep
                                            ? "bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900/30"
                                            : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                                        }`}
                                >
                                    {index < state.currentStep ? "✓" : index + 1}
                                </div>
                                <span
                                    className={`text-sm font-medium mt-2 ${index === state.currentStep
                                        ? "text-primary-600 dark:text-primary-400"
                                        : "text-neutral-500 dark:text-neutral-400"
                                        }`}
                                >
                                    {step.title}
                                </span>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div
                                    className={`flex-1 h-1 mx-2 rounded transition-colors ${index < state.currentStep
                                        ? "bg-primary-600"
                                        : "bg-neutral-200 dark:bg-neutral-800"
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Current Step Content */}
            <div className="surface-card p-8 mb-6">
                <CurrentStepComponent />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={previousStep}
                    disabled={isFirstStep || isGenerating}
                    leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                    Back
                </Button>

                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Step {state.currentStep + 1} of {STEPS.length}
                </div>

                {isLastStep ? (
                    <Button
                        onClick={handleGenerate}
                        disabled={!canProceed() || isGenerating}
                        isLoading={isGenerating}
                        leftIcon={isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                    >
                        {isGenerating ? "Generating..." : "Generate Video"}
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}
