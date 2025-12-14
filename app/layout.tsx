import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { WorkspaceProvider } from "@/lib/contexts/WorkspaceContext";
import { ToastProvider } from "@/components/ui";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "AI Video SaaS - Create Talking Avatar Videos",
    description: "Create professional AI-powered talking avatar videos from text with our advanced video generation platform.",
    keywords: ["AI video", "talking avatar", "text to video", "video generation", "AI SaaS"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                <SessionProvider>
                    <WorkspaceProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <ToastProvider>
                                {children}
                            </ToastProvider>
                        </ThemeProvider>
                    </WorkspaceProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
