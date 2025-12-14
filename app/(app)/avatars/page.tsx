"use client";

import * as React from "react";
import { useState } from "react";
import { AppLayout, Container } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AvatarCard } from "@/components/gallery/AvatarCard";
import { AvatarDetailModal } from "@/components/gallery/AvatarDetailModal";
import { avatars, Avatar } from "@/lib/data/avatars";
import { Users, Search } from "lucide-react";

function AvatarsGalleryContent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
    const [styleFilter, setStyleFilter] = useState<"all" | "professional" | "casual" | "friendly">("all");
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Filter avatars
    const filteredAvatars = avatars.filter((avatar) => {
        const matchesSearch = avatar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            avatar.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGender = genderFilter === "all" || avatar.gender === genderFilter;
        const matchesStyle = styleFilter === "all" || avatar.style === styleFilter;

        return matchesSearch && matchesGender && matchesStyle;
    });

    const handleAvatarClick = (avatar: Avatar) => {
        setSelectedAvatar(avatar);
        setShowModal(true);
    };

    return (
        <AppLayout>
            <Container size="full">
                <div className="py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                    AI Avatars
                                </h1>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Browse our collection of {avatars.length} professional AI avatars
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
                                    placeholder="Search avatars..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            {/* Gender Filter */}
                            <select
                                value={genderFilter}
                                onChange={(e) => setGenderFilter(e.target.value as any)}
                                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="all">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>

                            {/* Style Filter */}
                            <select
                                value={styleFilter}
                                onChange={(e) => setStyleFilter(e.target.value as any)}
                                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="all">All Styles</option>
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                                <option value="friendly">Friendly</option>
                            </select>
                        </div>

                        {/* Results Count */}
                        <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                            Showing {filteredAvatars.length} of {avatars.length} avatars
                        </div>
                    </div>

                    {/* Avatar Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredAvatars.map((avatar) => (
                            <AvatarCard
                                key={avatar.id}
                                avatar={avatar}
                                onClick={() => handleAvatarClick(avatar)}
                            />
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredAvatars.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                No avatars found
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>

                {/* Avatar Detail Modal */}
                <AvatarDetailModal
                    avatar={selectedAvatar}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                />
            </Container>
        </AppLayout>
    );
}

export default function AvatarsPage() {
    return (
        <ProtectedRoute>
            <AvatarsGalleryContent />
        </ProtectedRoute>
    );
}
