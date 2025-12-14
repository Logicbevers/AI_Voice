"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { AppLayout, Container } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StatusBadge } from "@/components/video/StatusBadge";
import { useWorkspace } from "@/lib/contexts/WorkspaceContext";
import { useToast } from "@/components/ui";
import { Button } from "@/components/ui";
import { FolderOpen, Trash2, Edit, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VideoJob {
    id: string;
    status: string;
    videoUrl?: string;
    createdAt: Date;
}

interface Project {
    id: string;
    name: string;
    status: string;
    script?: string;
    createdAt: Date;
    updatedAt: Date;
    videoJob?: VideoJob;
}

function ProjectsManagementContent() {
    const { currentWorkspace } = useWorkspace();
    const { addToast } = useToast();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const handleDelete = async (project: Project) => {
        if (!confirm(`Are you sure you want to delete "${project.name}"?`)) {
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

    const handleRegenerate = async (project: Project) => {
        try {
            const response = await fetch(`/api/projects/${project.id}/generate`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to regenerate video");
            }

            addToast({
                title: "Video generation started",
                description: "Your video is being regenerated",
                variant: "success",
            });

            await fetchProjects();
        } catch (error) {
            addToast({
                title: "Error",
                description: "Failed to regenerate video",
                variant: "error",
            });
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
                                <FolderOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                    Projects
                                </h1>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Manage all your video projects
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Projects List */}
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-24 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : projects.length > 0 ? (
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="surface-card p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                                    {project.name}
                                                </h3>
                                                <StatusBadge status={project.videoJob?.status || "draft"} />
                                            </div>

                                            {project.script && (
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">
                                                    {project.script}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                <span>
                                                    Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                                                </span>
                                                {project.videoJob && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Video Generated</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleRegenerate(project)}
                                                leftIcon={<RefreshCw className="h-4 w-4" />}
                                            >
                                                Regenerate
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(project)}
                                                leftIcon={<Trash2 className="h-4 w-4" />}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FolderOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                No projects yet
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                Create your first video project to get started
                            </p>
                            <Button href="/create">Create Video</Button>
                        </div>
                    )}
                </div>
            </Container>
        </AppLayout>
    );
}

export default function ProjectsPage() {
    return (
        <ProtectedRoute>
            <ProjectsManagementContent />
        </ProtectedRoute>
    );
}
