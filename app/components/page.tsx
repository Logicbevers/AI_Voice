"use client";

import * as React from "react";
import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Input,
    Textarea,
    Select,
    Modal,
    Badge,
    Skeleton,
    Progress,
    ToastProvider,
    useToast,
} from "@/components/ui";
import { Play, Download, Share2, Heart, Search, Mail } from "lucide-react";

function ComponentShowcase() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const { addToast } = useToast();

    const handleShowToast = (variant: "default" | "success" | "error" | "warning" | "info") => {
        addToast({
            title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
            description: "This is a sample toast notification message.",
            variant,
            duration: 3000,
        });
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold gradient-primary bg-clip-text text-transparent">
                        UI Component Showcase
                    </h1>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Phase 2: Design System & Core UI Components
                    </p>
                </div>

                {/* Buttons */}
                <Card>
                    <CardHeader>
                        <CardTitle>Buttons</CardTitle>
                        <CardDescription>Various button variants and sizes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                                    Variants
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    <Button variant="primary">Primary</Button>
                                    <Button variant="secondary">Secondary</Button>
                                    <Button variant="ghost">Ghost</Button>
                                    <Button variant="danger">Danger</Button>
                                    <Button variant="success">Success</Button>
                                    <Button variant="outline">Outline</Button>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                                    Sizes
                                </h4>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button size="sm">Small</Button>
                                    <Button size="md">Medium</Button>
                                    <Button size="lg">Large</Button>
                                    <Button size="xl">Extra Large</Button>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                                    With Icons
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    <Button leftIcon={<Play className="h-4 w-4" />}>Play Video</Button>
                                    <Button variant="secondary" rightIcon={<Download className="h-4 w-4" />}>
                                        Download
                                    </Button>
                                    <Button variant="outline" leftIcon={<Share2 className="h-4 w-4" />}>
                                        Share
                                    </Button>
                                    <Button size="icon" variant="ghost">
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                                    States
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    <Button isLoading>Loading</Button>
                                    <Button disabled>Disabled</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Inputs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Inputs</CardTitle>
                        <CardDescription>Input fields with various configurations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                leftIcon={<Mail className="h-4 w-4" />}
                            />
                            <Input
                                label="Search"
                                type="text"
                                placeholder="Search videos..."
                                leftIcon={<Search className="h-4 w-4" />}
                            />
                            <Input
                                label="With Error"
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                error="This field is required"
                            />
                            <Input
                                label="With Helper Text"
                                type="text"
                                helperText="Enter your full name as it appears on your ID"
                            />
                            <div className="md:col-span-2">
                                <Textarea
                                    label="Video Script"
                                    placeholder="Enter your video script here..."
                                    rows={4}
                                    showCharCount
                                    maxLength={500}
                                    helperText="Write a compelling script for your video"
                                />
                            </div>
                            <Select
                                label="Select Language"
                                placeholder="Choose a language"
                                options={[
                                    { value: "en", label: "English" },
                                    { value: "es", label: "Spanish" },
                                    { value: "fr", label: "French" },
                                    { value: "de", label: "German" },
                                    { value: "ja", label: "Japanese" },
                                ]}
                            />
                            <Select
                                label="Video Template"
                                options={[
                                    { value: "explainer", label: "Product Explainer" },
                                    { value: "tutorial", label: "Tutorial" },
                                    { value: "announcement", label: "Announcement" },
                                    { value: "promo", label: "Social Promo" },
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Badges */}
                <Card>
                    <CardHeader>
                        <CardTitle>Badges</CardTitle>
                        <CardDescription>Status indicators and labels</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Badge variant="default">Default</Badge>
                            <Badge variant="primary">Primary</Badge>
                            <Badge variant="success">Completed</Badge>
                            <Badge variant="warning">Pending</Badge>
                            <Badge variant="error">Failed</Badge>
                            <Badge variant="info">Processing</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>Progress Bars</CardTitle>
                        <CardDescription>Visual progress indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <Progress value={25} showLabel />
                            <Progress value={50} variant="success" showLabel />
                            <Progress value={75} variant="warning" showLabel />
                            <Progress value={90} variant="error" showLabel />
                        </div>
                    </CardContent>
                </Card>

                {/* Modal & Toast */}
                <Card>
                    <CardHeader>
                        <CardTitle>Modal & Notifications</CardTitle>
                        <CardDescription>Dialogs and toast notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                                    Modal Dialog
                                </h4>
                                <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                                    Toast Notifications
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    <Button size="sm" onClick={() => handleShowToast("default")}>
                                        Default Toast
                                    </Button>
                                    <Button size="sm" variant="success" onClick={() => handleShowToast("success")}>
                                        Success Toast
                                    </Button>
                                    <Button size="sm" variant="danger" onClick={() => handleShowToast("error")}>
                                        Error Toast
                                    </Button>
                                    <Button size="sm" onClick={() => handleShowToast("warning")}>
                                        Warning Toast
                                    </Button>
                                    <Button size="sm" onClick={() => handleShowToast("info")}>
                                        Info Toast
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skeletons */}
                <Card>
                    <CardHeader>
                        <CardTitle>Loading Skeletons</CardTitle>
                        <CardDescription>Placeholder components for loading states</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Skeleton variant="circular" width={48} height={48} />
                                <div className="flex-1 space-y-2">
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" width="60%" />
                                </div>
                            </div>
                            <Skeleton variant="rectangular" height={200} />
                        </div>
                    </CardContent>
                </Card>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card hover>
                        <CardHeader>
                            <CardTitle>Hover Card</CardTitle>
                            <CardDescription>Hover to see effect</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                This card has a hover effect that increases the shadow.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Standard Card</CardTitle>
                            <CardDescription>No hover effect</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                This is a standard card without hover effects.
                            </p>
                        </CardContent>
                    </Card>
                    <Card padding="lg">
                        <CardHeader>
                            <CardTitle>Large Padding</CardTitle>
                            <CardDescription>More spacious</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                This card has larger padding for a more spacious feel.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Sample Modal"
                description="This is a demonstration of the modal component"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-neutral-600 dark:text-neutral-400">
                        This modal demonstrates the dialog component with a title, description, and close
                        button. It can be closed by clicking the X button, clicking outside, or pressing the
                        Escape key.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default function ComponentsPage() {
    return (
        <ToastProvider>
            <ComponentShowcase />
        </ToastProvider>
    );
}
