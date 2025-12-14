'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { TtsJob } from '@prisma/client';

interface JobHistoryProps {
    workspaceId?: string;
    refresh?: number;
    onSelectJob: (job: TtsJob) => void;
}

export default function JobHistory({ workspaceId, refresh, onSelectJob }: JobHistoryProps) {
    const [jobs, setJobs] = useState<TtsJob[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchJobs = useCallback(async () => {
        if (!workspaceId) return;

        try {
            setIsLoading(true);
            const response = await fetch(`/api/tts/jobs?workspaceId=${workspaceId}&limit=10`);

            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }

            const data = await response.json();
            setJobs(data.jobs || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setIsLoading(false);
        }
    }, [workspaceId]);

    useEffect(() => {
        if (workspaceId) {
            fetchJobs();
        }
    }, [workspaceId, refresh, fetchJobs]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done':
                return 'bg-green-500';
            case 'processing':
                return 'bg-blue-500';
            case 'failed':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    if (!workspaceId) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        Select a workspace to view history
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No jobs yet. Generate your first audio!
                    </div>
                ) : (
                    <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                            {jobs.map((job) => (
                                <button
                                    key={job.id}
                                    onClick={() => onSelectJob(job)}
                                    className="w-full text-left p-3 border rounded-lg hover:bg-accent transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {job.text.substring(0, 60)}
                                                {job.text.length > 60 && '...'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-muted-foreground">
                                                    {job.voiceName}
                                                </span>
                                                <Badge variant="outline" className={`text-xs ${getStatusColor(job.status)} text-white`}>
                                                    {job.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
