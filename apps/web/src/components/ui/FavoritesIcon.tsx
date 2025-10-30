'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';

export function FavoritesIcon() {
    const { state } = useFavorites();

    return (
        <Link
            href="/favorites"
            className="relative text-hi-graphite hover:text-hi-platinum transition-colors duration-200"
            aria-label={`Избранное (${state.totalItems})`}
        >
            <Heart size={24} className={state.totalItems > 0 ? 'fill-current text-red-500' : ''} />

            {state.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {state.totalItems > 99 ? '99+' : state.totalItems}
                </span>
            )}
        </Link>
    );
}
