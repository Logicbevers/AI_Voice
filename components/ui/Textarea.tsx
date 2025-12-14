import * as React from "react";
import { clsx } from "clsx";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    showCharCount?: boolean;
    maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helperText, showCharCount, maxLength, id, value, ...props }, ref) => {
        const generatedId = React.useId();
        const textareaId = id || `textarea-${generatedId}`;
        const hasError = !!error;
        const charCount = value ? String(value).length : 0;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    id={textareaId}
                    className={clsx(
                        "w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none",
                        hasError && "border-error-DEFAULT focus:border-error-DEFAULT focus:ring-error-DEFAULT/20",
                        className
                    )}
                    ref={ref}
                    maxLength={maxLength}
                    value={value}
                    aria-invalid={hasError}
                    aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
                    {...props}
                />
                <div className="flex items-center justify-between mt-1.5">
                    <div className="flex-1">
                        {error && (
                            <p id={`${textareaId}-error`} className="text-sm text-error-DEFAULT">
                                {error}
                            </p>
                        )}
                        {helperText && !error && (
                            <p id={`${textareaId}-helper`} className="text-sm text-neutral-600 dark:text-neutral-400">
                                {helperText}
                            </p>
                        )}
                    </div>
                    {showCharCount && maxLength && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

export { Textarea };
