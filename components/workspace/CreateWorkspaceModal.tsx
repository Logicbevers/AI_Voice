"use client";

import * as React from "react";
import { useState } from "react";
import { useWorkspace } from "@/lib/contexts/WorkspaceContext";
import { Modal, Input, Button } from "@/components/ui";
import { useToast } from "@/components/ui";

interface CreateWorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
    const { refreshWorkspaces } = useWorkspace();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData({
            name,
            slug: generateSlug(name),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/workspaces", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create workspace");
            }

            addToast({
                title: "Success!",
                description: "Workspace created successfully",
                variant: "success",
            });

            await refreshWorkspaces();
            onClose();
            setFormData({ name: "", slug: "" });
        } catch (error) {
            addToast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create workspace",
                variant: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        Create Workspace
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        Create a new workspace to organize your projects and collaborate with your team.
                    </p>

                    <div className="space-y-4">
                        <Input
                            label="Workspace Name"
                            type="text"
                            placeholder="My Awesome Workspace"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                        />
                        <Input
                            label="Workspace Slug"
                            type="text"
                            placeholder="my-awesome-workspace"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            helperText="This will be used in URLs"
                            required
                        />
                    </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 p-6 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Create Workspace
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
