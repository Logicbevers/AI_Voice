"use client";

import * as React from "react";
import { useState } from "react";
import { AppLayout, Container } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AssetCard } from "@/components/assets/AssetCard";
import { mockAssets, assetTypes, Asset } from "@/lib/data/assets";
import { useToast } from "@/components/ui";
import { FolderOpen, Upload, Search } from "lucide-react";

function AssetsLibraryContent() {
    const { addToast } = useToast();
    const [assets, setAssets] = useState<Asset[]>(mockAssets);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    // Filter assets
    const filteredAssets = assets.filter((asset) => {
        const matchesSearch =
            asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = typeFilter === "all" || asset.type === typeFilter;

        return matchesSearch && matchesType;
    });

    const handleDelete = (assetId: string) => {
        if (!confirm("Are you sure you want to delete this asset?")) {
            return;
        }

        setAssets((prev) => prev.filter((a) => a.id !== assetId));
        addToast({
            title: "Asset deleted",
            description: "The asset has been removed from your library",
            variant: "success",
        });
    };

    const handleUpload = () => {
        addToast({
            title: "Upload feature",
            description: "File upload will be implemented with a backend service",
            variant: "default",
        });
    };

    return (
        <AppLayout>
            <Container size="full">
                <div className="py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                                    <FolderOpen className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                        Asset Library
                                    </h1>
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        Manage your logos, images, and brand assets
                                    </p>
                                </div>
                            </div>

                            {/* Upload Button */}
                            <button
                                onClick={handleUpload}
                                className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Asset
                            </button>
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
                                    placeholder="Search assets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            {/* Type Filter */}
                            <div className="flex gap-2 overflow-x-auto">
                                {assetTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setTypeFilter(type.value)}
                                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${typeFilter === type.value
                                                ? "bg-primary-600 text-white"
                                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                            Showing {filteredAssets.length} of {assets.length} assets
                        </div>
                    </div>

                    {/* Assets Grid */}
                    {filteredAssets.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredAssets.map((asset) => (
                                <AssetCard
                                    key={asset.id}
                                    asset={asset}
                                    onDelete={() => handleDelete(asset.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FolderOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                No assets found
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                {searchQuery || typeFilter !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "Upload your first asset to get started"}
                            </p>
                            <button
                                onClick={handleUpload}
                                className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors inline-flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Asset
                            </button>
                        </div>
                    )}
                </div>
            </Container>
        </AppLayout>
    );
}

export default function AssetsPage() {
    return (
        <ProtectedRoute>
            <AssetsLibraryContent />
        </ProtectedRoute>
    );
}
