// frontend/components/ui/breadcrumbs.tsx
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Crumb = {
    label: string;
    href?: string;   // si no se define, el ítem es solo texto
};

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <nav aria-label="breadcrumb" className="flex items-center text-sm mb-4">
            {items.map((item, i) => (
                <span key={i} className="flex items-center">
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground">{item.label}</span>
                    )}
                    {i < items.length - 1 && (
                        <ChevronRight className="w-3 h-3 mx-1 text-muted-foreground" />
                    )}
                </span>
            ))}
        </nav>
    );
}
