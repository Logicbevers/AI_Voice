"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";
import { useToast } from "@/components/ui";
import { User, Mail, Lock } from "lucide-react";

export function SignupForm() {
    const router = useRouter();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: "Passwords don't match" });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.details) {
                    const fieldErrors: Record<string, string> = {};
                    data.details.forEach((error: any) => {
                        fieldErrors[error.path[0]] = error.message;
                    });
                    setErrors(fieldErrors);
                } else {
                    addToast({
                        title: "Signup Failed",
                        description: data.error || "Something went wrong",
                        variant: "error",
                    });
                }
                return;
            }

            // Auto-login after successful signup
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                addToast({
                    title: "Account Created",
                    description: "Please log in with your credentials",
                    variant: "success",
                });
                router.push("/login");
            } else {
                addToast({
                    title: "Welcome!",
                    description: "Your account has been created successfully",
                    variant: "success",
                });
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            addToast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                leftIcon={<User className="h-4 w-4" />}
                required
            />
            <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                leftIcon={<Mail className="h-4 w-4" />}
                required
            />
            <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                leftIcon={<Lock className="h-4 w-4" />}
                helperText="At least 6 characters"
                required
            />
            <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                leftIcon={<Lock className="h-4 w-4" />}
                required
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Account
            </Button>
        </form>
    );
}
