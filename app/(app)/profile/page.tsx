"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { AppLayout, Container } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Button } from "@/components/ui";
import { useToast } from "@/components/ui";
import { User, Mail, Camera } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function ProfileContent() {
    const { data: session, update } = useSession();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
    });

    React.useEffect(() => {
        if (session?.user) {
            setFormData({
                name: session.user.name || "",
                email: session.user.email || "",
            });
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Implement profile update API
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            addToast({
                title: "Success!",
                description: "Your profile has been updated",
                variant: "success",
            });

            // Update session
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: formData.name,
                },
            });
        } catch (error) {
            addToast({
                title: "Error",
                description: "Failed to update profile",
                variant: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <Container size="lg">
                <div className="py-8 space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                            Profile Settings
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Picture */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Picture</CardTitle>
                                <CardDescription>Update your profile photo</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-4xl font-semibold">
                                        {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <Button variant="outline" size="sm" leftIcon={<Camera className="h-4 w-4" />}>
                                        Change Photo
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Profile Information */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your personal details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        label="Full Name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        leftIcon={<User className="h-4 w-4" />}
                                        required
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        leftIcon={<Mail className="h-4 w-4" />}
                                        helperText="Email cannot be changed"
                                        disabled
                                    />
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button type="button" variant="ghost">
                                            Cancel
                                        </Button>
                                        <Button type="submit" isLoading={isLoading}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>View your account details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                        User ID
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-mono">
                                        {session?.user?.id || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                        Account Created
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-error-DEFAULT">Danger Zone</CardTitle>
                            <CardDescription>Irreversible actions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border border-error-DEFAULT/20 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                                        Delete Account
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                        Permanently delete your account and all associated data
                                    </p>
                                </div>
                                <Button variant="danger" size="sm">
                                    Delete Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </AppLayout>
    );
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}
