'use client';

import { Label } from '@/components/ui/Label';
import { Slider } from '@/components/ui/Slider';

interface AdvancedControlsProps {
    stability: number;
    similarityBoost: number;
    onStabilityChange: (value: number) => void;
    onSimilarityBoostChange: (value: number) => void;
}

export default function AdvancedControls({
    stability,
    similarityBoost,
    onStabilityChange,
    onSimilarityBoostChange,
}: AdvancedControlsProps) {
    return (
        <div className="space-y-6 p-4 border rounded-lg">
            <h3 className="font-semibold">Advanced Settings</h3>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <Label htmlFor="stability">Stability</Label>
                    <span className="text-sm text-muted-foreground">{stability.toFixed(2)}</span>
                </div>
                <Slider
                    id="stability"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[stability]}
                    onValueChange={([value]: number[]) => onStabilityChange(value)}
                />
                <p className="text-xs text-muted-foreground">
                    Higher values make the voice more consistent but less expressive
                </p>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <Label htmlFor="similarity">Similarity Boost</Label>
                    <span className="text-sm text-muted-foreground">{similarityBoost.toFixed(2)}</span>
                </div>
                <Slider
                    id="similarity"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[similarityBoost]}
                    onValueChange={([value]: number[]) => onSimilarityBoostChange(value)}
                />
                <p className="text-xs text-muted-foreground">
                    Higher values make the voice clearer and more similar to the original
                </p>
            </div>
        </div>
    );
}
