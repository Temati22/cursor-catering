'use client';

import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { getImageUrl } from '@/lib/api';

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { removeItem, updateQuantity } = useCart();
    const { menu, dish, quantity } = item;

    const itemData = menu || dish;
    const itemId = menu?.id || dish?.id;
    const itemType = menu ? 'menu' : 'dish';

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(itemId!, itemType);
        } else {
            updateQuantity(itemId!, itemType, newQuantity);
        }
    };

    const itemTotal = quantity * (menu?.pricePerPerson || dish?.price || 0);

    return (
        <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
            {/* Item Image */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                {menu?.image && menu.image.length > 0 ? (
                    <StrapiImage
                        src={getImageUrl(menu.image[0].url)}
                        alt={menu.image[0].alternativeText || menu.name}
                        fill
                        className="object-cover"
                    />
                ) : dish?.images && dish.images.length > 0 ? (
                    <StrapiImage
                        src={getImageUrl(dish.images[0].url)}
                        alt={dish.images[0].alternativeText || dish.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Нет фото</span>
                    </div>
                )}
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-hi-graphite truncate">
                    {itemData?.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    {menu?.pricePerPerson ? `${menu.pricePerPerson} ${menu.currency}/чел` : `${dish?.price} ${dish?.currency}`}
                </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Уменьшить количество"
                >
                    <Minus size={16} className="text-gray-600" />
                </button>

                <span className="text-sm font-medium text-hi-graphite min-w-[2rem] text-center">
                    {quantity}
                </span>

                <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Увеличить количество"
                >
                    <Plus size={16} className="text-gray-600" />
                </button>
            </div>

            {/* Total Price */}
            <div className="text-sm font-medium text-hi-graphite min-w-[4rem] text-right">
                {itemTotal} {menu?.currency || 'руб'}
            </div>

            {/* Remove Button */}
            <button
                onClick={() => removeItem(itemId!, itemType)}
                className="p-1 rounded-full hover:bg-red-50 transition-colors"
                aria-label="Удалить из корзины"
            >
                <X size={16} className="text-red-500" />
            </button>
        </div>
    );
}
