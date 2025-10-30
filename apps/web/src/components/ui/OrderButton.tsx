'use client';

import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { Menu } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';

interface OrderButtonProps {
    menu: Menu;
    className?: string;
    variant?: 'default' | 'compact';
}

export function OrderButton({ menu, className = '', variant = 'default' }: OrderButtonProps) {
    const { addMenu, state } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);

    const cartItem = state.items.find(item => item.menu?.id === menu.id);
    const isInCart = !!cartItem;

    const handleAddToCart = () => {
        addMenu(menu, quantity);
        setIsExpanded(false);
        setQuantity(1);
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    if (variant === 'compact') {
        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                {!isExpanded ? (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="flex items-center space-x-1 bg-hi-green text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-hi-green-dark transition-colors"
                    >
                        <ShoppingCart size={16} />
                        <span>Add to cart</span>
                    </button>
                ) : (
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg">
                            <button
                                onClick={() => handleQuantityChange(quantity - 1)}
                                className="p-1 hover:bg-gray-200 rounded-l-lg transition-colors"
                                disabled={quantity <= 1}
                            >
                                <Minus size={14} />
                            </button>
                            <span className="px-2 text-sm font-medium min-w-[2rem] text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={() => handleQuantityChange(quantity + 1)}
                                className="p-1 hover:bg-gray-200 rounded-r-lg transition-colors"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="bg-hi-green text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-hi-green-dark transition-colors"
                        >
                            Добавить
                        </button>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-hi-graphite">Количество:</span>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                        disabled={quantity <= 1}
                    >
                        <Minus size={16} />
                    </button>
                    <span className="text-lg font-semibold text-hi-graphite min-w-[3rem] text-center">
                        {quantity}
                    </span>
                    <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Price Display */}
            <div className="text-center">
                <div className="text-2xl font-bold text-hi-green">
                    {(menu.pricePerPerson || 0) * quantity} {menu.currency}
                </div>
                <div className="text-sm text-gray-500">
                    {menu.pricePerPerson} {menu.currency} × {quantity} чел
                </div>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                className="w-full bg-hi-green text-white py-3 px-4 rounded-lg font-medium hover:bg-hi-green-dark transition-colors flex items-center justify-center space-x-2"
            >
                <ShoppingCart size={20} />
                <span>
                    {isInCart ? `Добавить еще ${quantity}` : `Добавить в корзину`}
                </span>
            </button>

            {isInCart && (
                <div className="text-center text-sm text-hi-green">
                    ✓ Уже в корзине ({cartItem.quantity} шт.)
                </div>
            )}
        </div>
    );
}
