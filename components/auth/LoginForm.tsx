"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";
import { useToast } from "@/components/ui";
import { Mail, Lock } from "lucide-react";

export function LoginForm() {
    const router = useRouter();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                addToast({
                    title: "Login Failed",
                    description: "Invalid email or password",
                    variant: "error",
                });
            } else {
                addToast({
                    title: "Success!",
                    description: "You have been logged in successfully",
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
                required
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In
            </Button>
        </form>
    );
}
