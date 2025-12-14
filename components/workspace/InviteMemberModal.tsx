"use client";

import * as React from "react";
import { useState } from "react";
import { Modal, Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { useToast } from "@/components/ui";
import { Mail, UserPlus } from "lucide-react";

interface InviteMemberModalProps {
    workspaceId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function InviteMemberModal({
    workspaceId,
    isOpen,
    onClose,
    onSuccess,
}: InviteMemberModalProps) {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        role: "member",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`/api/workspaces/${workspaceId}/members`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to invite member");
            }

            addToast({
                title: "Success!",
                description: "Member invited successfully",
                variant: "success",
            });

            setFormData({ email: "", role: "member" });
            onSuccess();
            onClose();
        } catch (error) {
            addToast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to invite member",
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
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <UserPlus className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            Invite Member
                        </h2>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        Invite a team member to collaborate on this workspace.
                    </p>

                    <div className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="colleague@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            leftIcon={<Mail className="h-4 w-4" />}
                            helperText="User must have an account to be invited"
                            required
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Role
                            </label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="owner">Owner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                <strong>Member:</strong> Can view and create projects<br />
                                <strong>Owner:</strong> Full access including settings and member management
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 p-6 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Send Invitation
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
