"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWorkspace } from "@/lib/contexts/WorkspaceContext";
import { AppLayout, Container } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Button } from "@/components/ui";
import { useToast } from "@/components/ui";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { InviteMemberModal } from "@/components/workspace/InviteMemberModal";
import { MembersList } from "@/components/workspace/MembersList";
import { Building2, Palette, Trash2, UserPlus } from "lucide-react";

function WorkspaceSettingsContent() {
    const { currentWorkspace, refreshWorkspaces } = useWorkspace();
    const { data: session } = useSession();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        primaryColor: "",
    });

    useEffect(() => {
        if (currentWorkspace) {
            setFormData({
                name: currentWorkspace.name,
                slug: currentWorkspace.slug,
                primaryColor: currentWorkspace.primaryColor || "#667eea",
            });
        }
    }, [currentWorkspace]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentWorkspace) return;

        setIsLoading(true);

        try {
            const response = await fetch(`/api/workspaces/${currentWorkspace.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update workspace");
            }

            addToast({
                title: "Success!",
                description: "Workspace settings updated",
                variant: "success",
            });

            await refreshWorkspaces();
        } catch (error: any) {
            addToast({
                title: "Error",
                description: error.message || "Failed to update workspace",
                variant: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!currentWorkspace) return;

        if (!confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch(`/api/workspaces/${currentWorkspace.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete workspace");
            }

            addToast({
                title: "Success!",
                description: "Workspace deleted successfully",
                variant: "success",
            });

            await refreshWorkspaces();
            window.location.href = "/dashboard";
        } catch (error: any) {
            addToast({
                title: "Error",
                description: error.message || "Failed to delete workspace",
                variant: "error",
            });
        }
    };

    if (!currentWorkspace) {
        return (
            <AppLayout>
                <Container>
                    <div className="py-8">
                        <p className="text-neutral-600 dark:text-neutral-400">No workspace selected</p>
                    </div>
                </Container>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Container size="lg">
                <div className="py-8 space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                            Workspace Settings
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                            Manage your workspace settings and preferences
                        </p>
                    </div>

                    {/* General Settings */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                                <CardTitle>General Settings</CardTitle>
                            </div>
                            <CardDescription>Update your workspace name and URL</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Workspace Name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Workspace Slug"
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    helperText="This will be used in URLs"
                                    required
                                />
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="submit" isLoading={isLoading}>
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Branding */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Palette className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                                <CardTitle>Branding</CardTitle>
                            </div>
                            <CardDescription>Customize your workspace appearance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        Primary Color
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            value={formData.primaryColor}
                                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                            className="h-10 w-20 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer"
                                        />
                                        <Input
                                            type="text"
                                            value={formData.primaryColor}
                                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                            placeholder="#667eea"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                {/* Color Preview */}
                                <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                                        Preview
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                                            style={{ backgroundColor: formData.primaryColor }}
                                        >
                                            {formData.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                {formData.name}
                                            </p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                Workspace Avatar
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Trash2 className="h-5 w-5 text-error-DEFAULT" />
                                <CardTitle className="text-error-DEFAULT">Danger Zone</CardTitle>
                            </div>
                            <CardDescription>Irreversible actions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border border-error-DEFAULT/20 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                                        Delete Workspace
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                        Permanently delete this workspace and all associated data
                                    </p>
                                </div>
                                <Button variant="danger" size="sm" onClick={handleDelete}>
                                    Delete Workspace
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <InviteMemberModal
                    workspaceId={currentWorkspace.id}
                    isOpen={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                    onSuccess={() => { }}
                />
            </Container>
        </AppLayout>
    );
}

export default function WorkspaceSettingsPage() {
    return (
        <ProtectedRoute>
            <WorkspaceSettingsContent />
        </ProtectedRoute>
    );
}
