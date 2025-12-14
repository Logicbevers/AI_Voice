"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout, Container } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplatePreviewModal } from "@/components/templates/TemplatePreviewModal";
import { templates, templateCategories, VideoTemplate } from "@/lib/data/templates";
import { FileText, Search } from "lucide-react";

function TemplatesGalleryContent() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    // Filter templates
    const filteredTemplates = templates.filter((template) => {
        const matchesSearch =
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory =
            categoryFilter === "all" || template.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const handlePreview = (template: VideoTemplate) => {
        setSelectedTemplate(template);
        setShowPreview(true);
    };

    const handleUseTemplate = (template: VideoTemplate) => {
        // Store template in localStorage for the create page to pick up
        localStorage.setItem("selectedTemplate", JSON.stringify(template));
        router.push("/create");
    };

    return (
        <AppLayout>
            <Container size="full">
                <div className="py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                    Video Templates
                                </h1>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Start with a pre-made template and customize it to your needs
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="surface-card p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            {/* Category Tabs */}
                            <div className="flex gap-2 overflow-x-auto">
                                {templateCategories.map((category) => (
                                    <button
                                        key={category.value}
                                        onClick={() => setCategoryFilter(category.value)}
                                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${categoryFilter === category.value
                                            ? "bg-primary-600 text-white"
                                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                            }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                            Showing {filteredTemplates.length} of {templates.length} templates
                        </div>
                    </div>

                    {/* Templates Grid */}
                    {filteredTemplates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTemplates.map((template) => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    onUse={() => handleUseTemplate(template)}
                                    onPreview={() => handlePreview(template)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                No templates found
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>

                {/* Template Preview Modal */}
                <TemplatePreviewModal
                    template={selectedTemplate}
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                    onUse={() => {
                        if (selectedTemplate) {
                            handleUseTemplate(selectedTemplate);
                        }
                    }}
                />
            </Container>
        </AppLayout>
    );
}

export default function TemplatesPage() {
    return (
        <ProtectedRoute>
            <TemplatesGalleryContent />
        </ProtectedRoute>
    );
}
