'use client';

import React from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Dish, DishType, DISH_TYPE_LABELS } from '@/lib/api';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { useCart } from '@/contexts/CartContext';
import { getImageUrl } from '@/lib/imageUtils';

interface DishCardProps {
    dish: Dish;
    showType?: boolean;
    showPrice?: boolean;
    showDescription?: boolean;
    showDietaryInfo?: boolean;
    showAdditionalInfo?: boolean;
    onImageError?: (dishId: number) => void;
    imageError?: boolean;
}

export function DishCard({
    dish,
    showType = true,
    showPrice = true,
    showDescription = true,
    showDietaryInfo = true,
    showAdditionalInfo = true,
    onImageError,
    imageError = false
}: DishCardProps) {
    const mainImage = dish.images && dish.images.length > 0 ? dish.images[0] : null;
    const { addDish, updateQuantity, removeItem, state } = useCart();

    const handleAddToCart = () => {
        addDish(dish, 1);
    };

    const handleDecrease = () => {
        if (cartQuantity <= 1) {
            removeItem(dish.id, 'dish');
        } else {
            updateQuantity(dish.id, 'dish', cartQuantity - 1);
        }
    };

    // Check if this dish is already in cart
    const isInCart = state.items.some(item => item.dish?.id === dish.id);
    const cartQuantity = state.items.find(item => item.dish?.id === dish.id)?.quantity || 0;

    return (
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-hi-silver/30 group relative transform hover:scale-[1.02] hover:-translate-y-1 h-full flex flex-col">

            {/* Enhanced Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-hi-ash to-hi-silver/20">
                {/* Shimmer loading effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {mainImage && !imageError ? (
                    <StrapiImage
                        src={getImageUrl(mainImage.url)}
                        alt={mainImage.alternativeText || dish.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 filter group-hover:brightness-110 group-hover:saturate-110"
                        onError={() => onImageError?.(dish.id)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-hi-ash to-hi-silver/50 flex items-center justify-center">
                        <div className="text-center text-hi-platinum animate-pulse">
                            <div className="w-16 h-16 mx-auto mb-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🍽️</span>
                            </div>
                            <p className="text-sm font-medium">Фото скоро появится</p>
                        </div>
                    </div>
                )}

                {/* Enhanced Type Badge */}
                {showType && dish.type && (
                    <div className="absolute bottom-4 left-4 bg-gradient-to-r from-[#BFA76F] to-[#BFA76F]/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-white/20">
                        <span className="mr-2">
                            {dish.type === 'hot' ? '🔥' :
                                dish.type === 'cold' ? '🧊' :
                                    dish.type === 'side' ? '🥗' :
                                        dish.type === 'baked' ? '🥖' :
                                            dish.type === 'drink' ? '🥤' :
                                                dish.type === 'sweet' ? '🍰' : '✨'}
                        </span>
                        {DISH_TYPE_LABELS[dish.type] || dish.type}
                    </div>
                )}

                {/* Gradient overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Enhanced Content */}
            <div className="p-6 relative flex-1 flex flex-col">
                {/* Decorative element */}
                <div className="absolute top-0 left-6 w-12 h-1 bg-gradient-to-r from-[#BFA76F] to-transparent rounded-full"></div>

                <div className="pt-3">
                    <h3 className="text-xl font-bold text-hi-graphite mb-3 group-hover:text-[#BFA76F] transition-colors leading-tight">
                        {dish.name}
                        <span className="ml-2 text-lg">✨</span>
                    </h3>

                    {showDescription && dish.description && (
                        <p className="text-hi-platinum text-sm mb-4 line-clamp-3 leading-relaxed">
                            {dish.description}
                        </p>
                    )}

                </div>

                {/* Dietary Info */}
                {showDietaryInfo && (dish.isVegetarian || dish.isVegan || dish.isGlutenFree || dish.isSpicy) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {dish.isVegan && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Веган
                            </span>
                        )}
                        {dish.isVegetarian && !dish.isVegan && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Вегетарианское
                            </span>
                        )}
                        {dish.isGlutenFree && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Безглютеновое
                            </span>
                        )}
                        {dish.isSpicy && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                Острое 🌶️
                            </span>
                        )}
                    </div>
                )}

                {/* Additional Info */}
                {showAdditionalInfo && (dish.preparationTime || dish.servingSize) && (
                    <div className="flex justify-between items-center text-sm text-hi-silver mb-4">
                        {dish.preparationTime && (
                            <span className="flex items-center gap-1">
                                ⏱️ {dish.preparationTime} мин
                            </span>
                        )}
                        {dish.servingSize && (
                            <span className="flex items-center gap-1">
                                👥 {dish.servingSize}
                            </span>
                        )}
                    </div>
                )}

                {/* Enhanced Price and Cart Actions */}
                <div className="mt-auto pt-4 border-t border-hi-silver/20">
                    {/* Price with enhanced styling */}
                    {showPrice && (
                        <div className="mb-3">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-[#BFA76F]">
                                    {dish.price}
                                </span>
                                <span className="text-sm text-hi-platinum font-medium">
                                    {dish.currency === 'USD' ? '$' : 'руб'}
                                </span>
                                {/* Fake discount indicator */}
                                <span className="text-xs text-red-500 line-through opacity-75 ml-auto">
                                    {Math.floor(dish.price * 1.2)}₽
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Enhanced Cart Actions */}
                    {isInCart ? (
                        <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-[#BFA76F] to-[#BFA76F]/80 rounded-xl px-4 py-3 shadow-lg">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDecrease();
                                }}
                                className="text-white hover:text-yellow-200 transition-colors bg-white/20 rounded-full p-1"
                                aria-label="Уменьшить количество"
                            >
                                <Minus size={18} />
                            </button>
                            <div className="text-center">
                                <span className="text-white font-bold text-lg min-w-[30px] block">
                                    {cartQuantity}
                                </span>
                                <span className="text-white/80 text-xs">в корзине</span>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="text-white hover:text-yellow-200 transition-colors bg-white/20 rounded-full p-1"
                                aria-label="Увеличить количество"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-gradient-to-r from-[#BFA76F] to-[#BFA76F]/80 hover:from-[#BFA76F]/90 hover:to-[#BFA76F]/70 text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 relative overflow-hidden"
                        >
                            {/* Button shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>

                            <ShoppingCart size={20} className="relative z-10" />
                            <span className="relative z-10">Заказать</span>

                        </button>
                    )}

                </div>
            </div>
        </div>
    );
}