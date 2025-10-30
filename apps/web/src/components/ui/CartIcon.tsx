'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartIconProps {
    className?: string;
}

export function CartIcon({ className = '' }: CartIconProps) {
    const { state, toggleCart } = useCart();

    return (
        <button
            onClick={toggleCart}
            className={`relative p-2 text-hi-graphite hover:text-hi-green transition-colors ${className}`}
            aria-label="Открыть корзину"
        >
            <ShoppingCart color='#E6B800' size={24} />
            {state.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-hi-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {state.totalItems}
                </span>
            )}
        </button>
    );
}
