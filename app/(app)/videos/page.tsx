"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { AppLayout, Container } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { VideoCard } from "@/components/video/VideoCard";
import { VideoPlayerModal } from "@/components/video/VideoPlayerModal";
import { useWorkspace } from "@/lib/contexts/WorkspaceContext";
import { useToast } from "@/components/ui";
import { Video, Search } from "lucide-react";

interface VideoJob {
    id: string;
    status: string;
    videoUrl?: string;
    duration?: number;
    createdAt: Date;
    completedAt?: Date;
}

interface Project {
    id: string;
    title: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    videoJob?: VideoJob;
}

function VideosLibraryContent() {
    const { currentWorkspace } = useWorkspace();
    const { addToast } = useToast();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedVideo, setSelectedVideo] = useState<{ url: string; name: string; projectId: string } | null>(null);
    const [showPlayer, setShowPlayer] = useState(false);

    const fetchProjects = useCallback(async () => {
        if (!currentWorkspace) return;

        try {
            const response = await fetch(`/api/projects?workspaceId=${currentWorkspace.id}`);
            if (response.ok) {
                const data = await response.json();
                setProjects(data.projects || []);
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentWorkspace]);

    useEffect(() => {
        if (currentWorkspace) {
            fetchProjects();
        }
    }, [currentWorkspace, fetchProjects]);

    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            project.status === statusFilter ||
            (project.videoJob?.status === statusFilter);

        return matchesSearch && matchesStatus;
    });

    const handlePlay = (project: Project) => {
        const latestJob = project.videoJob;
        if (latestJob?.videoUrl) {
            setSelectedVideo({ url: latestJob.videoUrl, name: project.title, projectId: project.id });
            setShowPlayer(true);
        }
    };

    const handleDownload = (project: Project) => {
        const latestJob = project.videoJob;
        if (latestJob?.videoUrl) {
            const link = document.createElement("a");
            link.href = latestJob.videoUrl;
            link.download = `${project.title}.mp4`;
            link.click();

            addToast({
                title: "Download started",
                description: "Your video is being downloaded",
                variant: "success",
            });
        }
    };

    const handleDelete = async (project: Project) => {
        if (!confirm(`Are you sure you want to delete "${project.title}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/projects/${project.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete project");
            }

            addToast({
                title: "Project deleted",
                description: "The project has been deleted successfully",
                variant: "success",
            });

            await fetchProjects();
        } catch (error) {
            addToast({
                title: "Error",
                description: "Failed to delete project",
                variant: "error",
            });
        }
    };

    const statusCounts = {
        all: projects.length,
        completed: projects.filter((p) => p.videoJob?.status === "completed").length,
        processing: projects.filter((p) => p.videoJob?.status === "processing").length,
        failed: projects.filter((p) => p.videoJob?.status === "failed").length,
    };

    return (
        <AppLayout>
            <Container size="full">
                <div className="py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                                <Video className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                    My Videos
                                </h1>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    {statusCounts.all} videos • {statusCounts.processing} processing
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
                                    placeholder="Search videos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            {/* Status Tabs */}
                            <div className="flex gap-2">
                                {[
                                    { value: "all", label: "All", count: statusCounts.all },
                                    { value: "completed", label: "Completed", count: statusCounts.completed },
                                    { value: "processing", label: "Processing", count: statusCounts.processing },
                                    { value: "failed", label: "Failed", count: statusCounts.failed },
                                ].map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() => setStatusFilter(tab.value)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === tab.value
                                            ? "bg-primary-600 text-white"
                                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                            }`}
                                    >
                                        {tab.label} ({tab.count})
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Video Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <VideoCard
                                    key={project.id}
                                    project={project}
                                    onPlay={() => handlePlay(project)}
                                    onDownload={() => handleDownload(project)}
                                    onDelete={() => handleDelete(project)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Video className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                No videos found
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                {searchQuery || statusFilter !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "Create your first video to get started"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Video Player Modal */}
                <VideoPlayerModal
                    videoUrl={selectedVideo?.url || null}
                    projectName={selectedVideo?.name || ""}
                    projectId={selectedVideo?.projectId || ""}
                    isOpen={showPlayer}
                    onClose={() => setShowPlayer(false)}
                />
            </Container>
        </AppLayout>
    );
}

export default function VideosPage() {
    return (
        <ProtectedRoute>
            <VideosLibraryContent />
        </ProtectedRoute>
    );
}
