'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartIconProps {
    className?: string;
    compact?: boolean;
    size?: number;
    color?: string;
    showBadge?: boolean;
}

export function CartIcon({ className = '', compact = false, size = 24, color = '#E6B800', showBadge = true }: CartIconProps) {
    const { state, toggleCart } = useCart();

    return (
        <button
            onClick={toggleCart}
            className={`relative ${compact ? 'p-0' : 'p-2'} text-hi-graphite hover:text-hi-green transition-colors ${className}`}
            aria-label="Открыть корзину"
        >
            <ShoppingCart color={color} size={size} />
            {showBadge && state.totalItems > 0 && (
                <span className="absolute -top-0 -right-1 bg-hi-green text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {state.totalItems}
                </span>
            )}
        </button>
    );
}
