'use client';

import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TextInput({ value, onChange }: TextInputProps) {
    const maxLength = 5000;
    const remaining = maxLength - value.length;

    return (
        <div className="space-y-2">
            <Label htmlFor="text-input">Script</Label>
            <Textarea
                id="text-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your text here (up to 5,000 characters)..."
                className="min-h-[200px] resize-y"
                maxLength={maxLength}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>Enter up to 5,000 characters</span>
                <span className={remaining < 100 ? 'text-orange-500' : ''}>
                    {remaining} characters remaining
                </span>
            </div>
        </div>
    );
}
