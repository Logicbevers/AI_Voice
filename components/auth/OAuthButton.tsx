"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui";
import { Chrome } from "lucide-react";

interface OAuthButtonProps {
    provider: "google" | "github";
}

export function OAuthButton({ provider }: OAuthButtonProps) {
    const handleOAuthSignIn = () => {
        signIn(provider, { callbackUrl: "/dashboard" });
    };

    const providerConfig = {
        google: {
            name: "Google",
            icon: Chrome,
            bgColor: "bg-white dark:bg-neutral-800",
            textColor: "text-neutral-900 dark:text-neutral-100",
            borderColor: "border-neutral-300 dark:border-neutral-700",
        },
        github: {
            name: "GitHub",
            icon: Chrome, // Using Chrome as placeholder, would use GitHub icon in production
            bgColor: "bg-neutral-900 dark:bg-neutral-800",
            textColor: "text-white",
            borderColor: "border-neutral-900 dark:border-neutral-700",
        },
    };

    const config = providerConfig[provider];
    const Icon = config.icon;

    return (
        <Button
            type="button"
            variant="outline"
            className={`w-full ${config.bgColor} ${config.textColor} border-2 ${config.borderColor} hover:opacity-90`}
            onClick={handleOAuthSignIn}
            leftIcon={<Icon className="h-5 w-5" />}
        >
            Continue with {config.name}
        </Button>
    );
}
