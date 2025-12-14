"use client";

import * as React from "react";
import { useState } from "react";
import { useVideoCreation } from "@/lib/contexts/VideoCreationContext";
import { Textarea, Button } from "@/components/ui";
import { FileText, Sparkles } from "lucide-react";

const MAX_CHARACTERS = 5000;

export function ScriptInput() {
    const { state, setScript, setProjectName } = useVideoCreation();
    const [localScript, setLocalScript] = useState(state.script);
    const [localName, setLocalName] = useState(state.projectName);

    const characterCount = localScript.length;
    const wordCount = localScript.trim().split(/\s+/).filter(Boolean).length;

    const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newScript = e.target.value;
        if (newScript.length <= MAX_CHARACTERS) {
            setLocalScript(newScript);
            setScript(newScript);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setLocalName(newName);
        setProjectName(newName);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Create Your Video Script
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                    Enter the script for your AI avatar to speak. You can also give your project a name.
                </p>
            </div>

            {/* Project Name */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Project Name (Optional)
                </label>
                <input
                    type="text"
                    value={localName}
                    onChange={handleNameChange}
                    placeholder="My Awesome Video"
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
            </div>

            {/* Script Input */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Script
                    </label>
                    <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                        <span>{wordCount} words</span>
                        <span className={characterCount > MAX_CHARACTERS * 0.9 ? "text-warning-DEFAULT" : ""}>
                            {characterCount} / {MAX_CHARACTERS} characters
                        </span>
                    </div>
                </div>
                <Textarea
                    value={localScript}
                    onChange={handleScriptChange}
                    placeholder="Enter your script here... For example: 'Hello! Welcome to our product demo. Today I&apos;ll show you how our AI-powered platform can transform your business...'"
                    rows={12}
                    className="font-mono text-sm"
                />
                {characterCount > MAX_CHARACTERS * 0.9 && (
                    <p className="mt-2 text-sm text-warning-DEFAULT">
                        You&apos;re approaching the character limit
                    </p>
                )}
            </div>

            {/* AI Suggestions (Placeholder) */}
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                            AI Script Assistant (Coming Soon)
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Get AI-powered suggestions to improve your script, fix grammar, or generate content from bullet points.
                        </p>
                        <Button size="sm" variant="ghost" className="mt-2" disabled>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Script
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="p-4 border border-primary-200 dark:border-primary-800 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-1">
                            Script Writing Tips
                        </h4>
                        <ul className="text-sm text-primary-800 dark:text-primary-200 space-y-1">
                            <li>• Keep sentences short and clear for better delivery</li>
                            <li>• Use natural, conversational language</li>
                            <li>• Add pauses with commas or periods</li>
                            <li>• Avoid complex jargon unless necessary</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
