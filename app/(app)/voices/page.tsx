"use client";

import * as React from "react";
import { useState } from "react";
import { AppLayout, Container } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { VoiceCard } from "@/components/gallery/VoiceCard";
import { voices, languages } from "@/lib/data/voices";
import { Mic, Search } from "lucide-react";

function VoicesLibraryContent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [languageFilter, setLanguageFilter] = useState("all");
    const [genderFilter, setGenderFilter] = useState("all");
    const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

    // Filter voices
    const filteredVoices = voices.filter((voice) => {
        const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            voice.language.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLanguage = languageFilter === "all" || voice.language === languageFilter;
        const matchesGender = genderFilter === "all" || voice.gender === genderFilter;

        return matchesSearch && matchesLanguage && matchesGender;
    });

    const handlePreview = (voiceId: string) => {
        if (playingVoiceId === voiceId) {
            // Stop playing
            setPlayingVoiceId(null);
        } else {
            // Start playing (mock - in production would play actual audio)
            setPlayingVoiceId(voiceId);

            // Auto-stop after 3 seconds (simulating audio duration)
            setTimeout(() => {
                setPlayingVoiceId(null);
            }, 3000);
        }
    };

    return (
        <AppLayout>
            <Container size="full">
                <div className="py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                                <Mic className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                    Voice Library
                                </h1>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Choose from {voices.length} professional AI voices
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="surface-card p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search voices..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            {/* Language Filter */}
                            <select
                                value={languageFilter}
                                onChange={(e) => setLanguageFilter(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="all">All Languages</option>
                                {languages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.flag} {lang.name}
                                    </option>
                                ))}
                            </select>

                            {/* Gender Filter */}
                            <select
                                value={genderFilter}
                                onChange={(e) => setGenderFilter(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="all">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="neutral">Neutral</option>
                            </select>
                        </div>

                        {/* Results Count */}
                        <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                            Showing {filteredVoices.length} of {voices.length} voices
                        </div>
                    </div>

                    {/* Voice List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredVoices.map((voice) => (
                            <VoiceCard
                                key={voice.id}
                                voice={voice}
                                onPreview={() => handlePreview(voice.id)}
                                isPlaying={playingVoiceId === voice.id}
                            />
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredVoices.length === 0 && (
                        <div className="text-center py-12">
                            <Mic className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                No voices found
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>
            </Container>
        </AppLayout>
    );
}

export default function VoicesPage() {
    return (
        <ProtectedRoute>
            <VoicesLibraryContent />
        </ProtectedRoute>
    );
}
