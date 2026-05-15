// frontend/components/ui/progress-bar.tsx
'use client';

type Props = {
    current: number;
    total: number;
    label?: string;
};

export default function ProgressBar({ current, total, label }: Props) {
    const percent = total === 0 ? 0 : Math.round((current / total) * 100);
    return (
        <div className="w-full max-w-md">
            {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
            <div className="relative h-4 rounded-full bg-muted/20 overflow-hidden">
                <div
                    className="h-4 bg-primary transition-all duration-300"
                    style={{ width: `${percent}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs text-foreground">
                    {percent}%
                </span>
            </div>
        </div>
    );
}
