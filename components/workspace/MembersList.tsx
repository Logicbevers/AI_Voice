"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button, Badge } from "@/components/ui";
import { useToast } from "@/components/ui";
import { Trash2, Crown, User as UserIcon } from "lucide-react";

interface Member {
    id: string;
    role: string;
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
}

interface MembersListProps {
    workspaceId: string;
    currentUserId: string;
    onMemberRemoved: () => void;
}

export function MembersList({
    workspaceId,
    currentUserId,
    onMemberRemoved,
}: MembersListProps) {
    const { addToast } = useToast();
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const fetchMembers = async () => {
        try {
            const response = await fetch(`/api/workspaces/${workspaceId}/members`);
            if (response.ok) {
                const data = await response.json();
                setMembers(data.members || []);
            }
        } catch (error) {
            console.error("Failed to fetch members:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [workspaceId]);

    const handleRemoveMember = async (userId: string) => {
        if (!confirm("Are you sure you want to remove this member?")) {
            return;
        }

        setRemovingId(userId);

        try {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/members?userId=${userId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to remove member");
            }

            addToast({
                title: "Success!",
                description: "Member removed successfully",
                variant: "success",
            });

            await fetchMembers();
            onMemberRemoved();
        } catch (error: any) {
            addToast({
                title: "Error",
                description: error.message || "Failed to remove member",
                variant: "error",
            });
        } finally {
            setRemovingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {members.map((member) => (
                <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {member.user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                    {member.user.name}
                                    {member.user.id === currentUserId && (
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">
                                            (You)
                                        </span>
                                    )}
                                </p>
                                {member.role === "owner" ? (
                                    <Badge variant="warning" icon={<Crown className="h-3 w-3" />}>
                                        Owner
                                    </Badge>
                                ) : (
                                    <Badge variant="default" icon={<UserIcon className="h-3 w-3" />}>
                                        Member
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {member.user.email}
                            </p>
                        </div>
                    </div>

                    {member.user.id !== currentUserId && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.user.id)}
                            isLoading={removingId === member.user.id}
                            leftIcon={<Trash2 className="h-4 w-4" />}
                        >
                            Remove
                        </Button>
                    )}
                </div>
            ))}

            {members.length === 0 && (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                    No members yet. Invite someone to get started!
                </div>
            )}
        </div>
    );
}
