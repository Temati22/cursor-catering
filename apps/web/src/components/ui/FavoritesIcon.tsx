'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';

interface FavoritesIconProps {
    size?: number;
    asLink?: boolean;
    className?: string;
    showBadge?: boolean;
}

export function FavoritesIcon({ size = 24, asLink = true, className = '', showBadge = true }: FavoritesIconProps) {
    const { state } = useFavorites();

    const IconContent = (
        <span className={`relative ${className}`} aria-label={`Избранное (${state.totalItems})`}>
            <Heart size={size} className={state.totalItems > 0 ? 'fill-current text-red-500' : ''} />
            {showBadge && state.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {state.totalItems > 99 ? '99+' : state.totalItems}
                </span>
            )}
        </span>
    );

    if (!asLink) return IconContent;

    return (
        <Link
            href="/favorites"
            className="relative text-hi-graphite hover:text-hi-platinum transition-colors duration-200"
            aria-label={`Избранное (${state.totalItems})`}
        >
            {IconContent}
        </Link>
    );
}
