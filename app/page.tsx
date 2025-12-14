"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-6 px-6">
                <h1 className="text-6xl font-bold gradient-primary bg-clip-text text-transparent">
                    AI Video SaaS
                </h1>
                <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                    Create professional talking avatar videos from text with our advanced AI-powered platform.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                    <button
                        className="btn-primary"
                        onClick={() => router.push("/dashboard")}
                    >
                        Get Started
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => router.push("/dashboard")}
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </main>
    );
}
