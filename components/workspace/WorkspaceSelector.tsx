"use client";

import * as React from "react";
import { useState } from "react";
import { useWorkspace } from "@/lib/contexts/WorkspaceContext";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";
import { ChevronDown, Plus, Check } from "lucide-react";

export function WorkspaceSelector() {
    const { currentWorkspace, workspaces, switchWorkspace } = useWorkspace();
    const [isOpen, setIsOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    if (!currentWorkspace) {
        return null;
    }

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                    <div
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-semibold"
                        style={{
                            background: currentWorkspace.primaryColor || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        }}
                    >
                        {currentWorkspace.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hidden md:block">
                        {currentWorkspace.name}
                    </span>
                    <ChevronDown className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-neutral-900 rounded-lg shadow-strong border border-neutral-200 dark:border-neutral-800 py-2 z-20">
                            <div className="px-3 py-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">
                                Workspaces
                            </div>

                            {workspaces.map((workspace) => (
                                <button
                                    key={workspace.id}
                                    onClick={() => {
                                        switchWorkspace(workspace.id);
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                                >
                                    <div
                                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                                        style={{
                                            background: workspace.primaryColor || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        }}
                                    >
                                        {workspace.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-neutral-900 dark:text-neutral-100 flex-1">
                                        {workspace.name}
                                    </span>
                                    {currentWorkspace.id === workspace.id && (
                                        <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                    )}
                                </button>
                            ))}

                            <div className="border-t border-neutral-200 dark:border-neutral-800 my-2" />

                            <button
                                onClick={() => {
                                    setShowCreateModal(true);
                                    setIsOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-primary-600 dark:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Create Workspace
                            </button>
                        </div>
                    </>
                )}
            </div>

            <CreateWorkspaceModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </>
    );
}
