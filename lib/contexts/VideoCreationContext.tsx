"use client";

import React, { createContext, useContext, useState } from "react";
import { Avatar } from "@/lib/data/avatars";

export interface VoiceSettings {
    language: string;
    gender: string;
    speed: number;
    pitch: number;
}

export interface VideoSettings {
    format: string;
    background: string;
    subtitles: boolean;
}

export interface VideoCreationState {
    currentStep: number;
    projectName: string;
    script: string;
    selectedAvatar: Avatar | null;
    voiceSettings: VoiceSettings;
    videoSettings: VideoSettings;
    projectId?: string;
}

interface VideoCreationContextType {
    state: VideoCreationState;
    setCurrentStep: (step: number) => void;
    setProjectName: (name: string) => void;
    setScript: (script: string) => void;
    setSelectedAvatar: (avatar: Avatar | null) => void;
    setVoiceSettings: (settings: Partial<VoiceSettings>) => void;
    setVideoSettings: (settings: Partial<VideoSettings>) => void;
    setProjectId: (id: string) => void;
    resetState: () => void;
    nextStep: () => void;
    previousStep: () => void;
    loadTemplate: (template: any) => void;
}

const initialState: VideoCreationState = {
    currentStep: 0,
    projectName: "",
    script: "",
    selectedAvatar: null,
    voiceSettings: {
        language: "en-US",
        gender: "female",
        speed: 1.0,
        pitch: 0,
    },
    videoSettings: {
        format: "16:9",
        background: "#667eea",
        subtitles: true,
    },
};

const VideoCreationContext = createContext<VideoCreationContextType | undefined>(
    undefined
);

export function VideoCreationProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<VideoCreationState>(initialState);

    const setCurrentStep = (step: number) => {
        setState((prev) => ({ ...prev, currentStep: step }));
    };

    const setProjectName = (name: string) => {
        setState((prev) => ({ ...prev, projectName: name }));
    };

    const setScript = (script: string) => {
        setState((prev) => ({ ...prev, script }));
    };

    const setSelectedAvatar = (avatar: Avatar | null) => {
        setState((prev) => ({ ...prev, selectedAvatar: avatar }));
    };

    const setVoiceSettings = (settings: Partial<VoiceSettings>) => {
        setState((prev) => ({
            ...prev,
            voiceSettings: { ...prev.voiceSettings, ...settings },
        }));
    };

    const setVideoSettings = (settings: Partial<VideoSettings>) => {
        setState((prev) => ({
            ...prev,
            videoSettings: { ...prev.videoSettings, ...settings },
        }));
    };

    const setProjectId = (id: string) => {
        setState((prev) => ({ ...prev, projectId: id }));
    };

    const resetState = () => {
        setState(initialState);
    };

    const nextStep = () => {
        setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
    };

    const previousStep = () => {
        setState((prev) => ({
            ...prev,
            currentStep: Math.max(0, prev.currentStep - 1),
        }));
    };

    const loadTemplate = (template: any) => {
        setState((prev) => ({
            ...prev,
            projectName: template.name,
            script: template.script,
            selectedAvatar: template.avatar,
            voiceSettings: template.voiceSettings,
            videoSettings: template.videoSettings,
        }));
    };

    return (
        <VideoCreationContext.Provider
            value={{
                state,
                setCurrentStep,
                setProjectName,
                setScript,
                setSelectedAvatar,
                setVoiceSettings,
                setVideoSettings,
                setProjectId,
                resetState,
                nextStep,
                previousStep,
                loadTemplate,
            }}
        >
            {children}
        </VideoCreationContext.Provider>
    );
}

export function useVideoCreation() {
    const context = useContext(VideoCreationContext);
    if (context === undefined) {
        throw new Error(
            "useVideoCreation must be used within a VideoCreationProvider"
        );
    }
    return context;
}
