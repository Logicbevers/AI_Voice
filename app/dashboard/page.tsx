import { AppLayout, Container } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Progress, Button } from "@/components/ui";
import { Video, TrendingUp, Users, Clock } from "lucide-react";

export default function DashboardPage() {
    return (
        <AppLayout>
            <Container>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                            Dashboard
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                            Welcome back! Here&apos;s what&apos;s happening with your videos.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                            Total Videos
                                        </p>
                                        <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                                            24
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                        <Video className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                            This Month
                                        </p>
                                        <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                                            12
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                            Team Members
                                        </p>
                                        <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                                            5
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                            Avg. Duration
                                        </p>
                                        <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                                            2:34
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Videos */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Videos</CardTitle>
                                    <CardDescription>Your latest video creations</CardDescription>
                                </div>
                                <Button variant="outline" size="sm">
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { title: "Product Demo Video", status: "completed", progress: 100 },
                                    { title: "Tutorial: Getting Started", status: "processing", progress: 65 },
                                    { title: "Customer Testimonial", status: "completed", progress: 100 },
                                    { title: "Marketing Campaign", status: "pending", progress: 0 },
                                ].map((video, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                                                    {video.title}
                                                </h4>
                                                <Badge
                                                    variant={
                                                        video.status === "completed"
                                                            ? "success"
                                                            : video.status === "processing"
                                                                ? "info"
                                                                : "default"
                                                    }
                                                >
                                                    {video.status}
                                                </Badge>
                                            </div>
                                            {video.status === "processing" && (
                                                <Progress value={video.progress} size="sm" className="mt-2" />
                                            )}
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            View
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Get started with common tasks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button className="h-auto py-4 flex-col gap-2">
                                    <Video className="h-6 w-6" />
                                    <span>Create New Video</span>
                                </Button>
                                <Button variant="secondary" className="h-auto py-4 flex-col gap-2">
                                    <Users className="h-6 w-6" />
                                    <span>Browse Avatars</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                                    <TrendingUp className="h-6 w-6" />
                                    <span>View Analytics</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </AppLayout>
    );
}
