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
        console.log('🏢 fetchWorkspaces called - PUBLIC ACCESS MODE');

        // TEMPORARY: Create mock workspace for public access
        const mockWorkspace: Workspace = {
            id: 'public-workspace',
            name: 'Public Workspace',
            slug: 'public-workspace',
            role: 'owner',
        };

        setWorkspaces([mockWorkspace]);
        setCurrentWorkspace(mockWorkspace);
        setIsLoading(false);
        console.log('✅ Mock workspace created for public access');
    }, []);

    useEffect(() => {
        console.log('🔄 WorkspaceContext useEffect triggered - PUBLIC ACCESS MODE');
        fetchWorkspaces();
    }, [fetchWorkspaces]);

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
