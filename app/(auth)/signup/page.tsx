import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { ToastProvider } from "@/components/ui";
import { Video } from "lucide-react";

export default function SignupPage() {
    return (
        <ToastProvider>
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-2">
                            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                                <Video className="h-7 w-7 text-white" />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-4">
                            Create Your Account
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Start creating amazing AI videos today
                        </p>
                    </div>

                    {/* Signup Form */}
                    <div className="surface-card p-8">
                        <SignupForm />

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* OAuth Buttons */}
                        <div className="space-y-3">
                            <OAuthButton provider="google" />
                            <OAuthButton provider="github" />
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-8">
                        By creating an account, you agree to our{" "}
                        <Link href="/terms" className="hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </ToastProvider>
    );
}
