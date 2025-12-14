"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react"; // DISABLED FOR PUBLIC ACCESS

interface Workspace {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    primaryColor?: string;
    role: string; // owner or member
}

interface WorkspaceContextType {
    currentWorkspace: Workspace | null;
    workspaces: Workspace[];
    isLoading: boolean;
    switchWorkspace: (workspaceId: string) => void;
    refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
    // const { data: session } = useSession(); // DISABLED FOR PUBLIC ACCESS
    const session = null; // Temporary: No authentication
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWorkspaces = useCallback(async () => {
        console.log('🏢 fetchWorkspaces called, session:', session?.user?.id);
        if (!session?.user?.id) {
            console.log('❌ No session user ID, skipping workspace fetch');
            setIsLoading(false);
            return;
        }

        try {
            console.log('📡 Fetching workspaces from /api/workspaces');
            const response = await fetch("/api/workspaces");
            console.log('📡 Workspaces API response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Workspaces data:', data);
                setWorkspaces(data.workspaces || []);

                if (data.workspaces.length === 0) {
                    console.log('⚠️ No workspaces available for this user');
                    return;
                }

                // Get saved workspace ID from localStorage
                const savedWorkspaceId = localStorage.getItem("currentWorkspaceId");
                console.log('💾 Saved workspace ID from localStorage:', savedWorkspaceId);

                // Try to find the saved workspace
                let workspace = savedWorkspaceId
                    ? data.workspaces.find((w: Workspace) => w.id === savedWorkspaceId)
                    : null;

                if (!workspace) {
                    // Workspace not found - either no saved ID or stale ID
                    if (savedWorkspaceId) {
                        console.log('⚠️ Saved workspace ID not found - clearing stale localStorage');
                        localStorage.removeItem("currentWorkspaceId");
                    }

                    // Use first available workspace
                    workspace = data.workspaces[0];
                    console.log('✅ Using first available workspace:', workspace.name, workspace.id);
                    setCurrentWorkspace(workspace);
                    localStorage.setItem("currentWorkspaceId", workspace.id);
                } else {
                    // Found saved workspace
                    console.log('✅ Restored workspace from localStorage:', workspace.name, workspace.id);
                    setCurrentWorkspace(workspace);
                }
            } else {
                console.error('❌ Workspaces API failed with status:', response.status);
            }
        } catch (error) {
            console.error("❌ Failed to fetch workspaces:", error);
        } finally {
            setIsLoading(false);
        }
    }, [session?.user?.id]);

    useEffect(() => {
        console.log('🔄 WorkspaceContext useEffect triggered, session?.user?.id:', session?.user?.id);
        fetchWorkspaces();
    }, [fetchWorkspaces, session?.user?.id]);

    const switchWorkspace = (workspaceId: string) => {
        console.log('🔀 switchWorkspace called with ID:', workspaceId);
        const workspace = workspaces.find((w) => w.id === workspaceId);
        if (workspace) {
            console.log('✅ Switching to workspace:', workspace.name);
            setCurrentWorkspace(workspace);
            localStorage.setItem("currentWorkspaceId", workspaceId);
        } else {
            console.log('❌ Workspace not found in workspaces array');
        }
    };

    const refreshWorkspaces = async () => {
        console.log('🔄 refreshWorkspaces called');
        await fetchWorkspaces();
    };

    console.log('🏢 WorkspaceProvider rendering, state:', {
        currentWorkspace: currentWorkspace?.name || 'null',
        workspacesCount: workspaces.length,
        isLoading,
    });

    return (
        <WorkspaceContext.Provider
            value={{
                currentWorkspace,
                workspaces,
                isLoading,
                switchWorkspace,
                refreshWorkspaces,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error("useWorkspace must be used within a WorkspaceProvider");
    }
    console.log('🎯 useWorkspace called, currentWorkspace:', context.currentWorkspace?.name || 'null');
    return context;
}
