'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu } from '@/lib/api';
import { StrapiImage } from './StrapiImage';
import { ImagePlaceholder } from './ImagePlaceholder';
import { OrderButton } from './OrderButton';
import { Star, ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface MenuCardProps {
    menu: Menu;
    showPrice?: boolean;
    showDescription?: boolean;
    onImageError?: (menuId: number) => void;
    className?: string;
}

// Helper function to get absolute URL for images
const getImageUrl = (url: string | undefined | null): string => {
    if (!url) {
        return '';
    }
    if (url.startsWith('http')) {
        return url;
    }
    return `http://localhost:1337${url}`;
};

// Rating component with stars
function Rating({ rating = 5 }: { rating?: number }) {
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={16}
                    className={`${star <= rating
                        ? 'text-hi-yellow fill-hi-yellow'
                        : 'text-gray-300'
                        }`}
                />
            ))}
        </div>
    );
}

export function MenuCard({
    menu,
    showPrice = true,
    showDescription = true,
    onImageError,
    className = ''
}: MenuCardProps) {
    const [imageError, setImageError] = useState(false);
    const { addMenu, removeItem, updateQuantity, state } = useCart();
    const { addMenu: addMenuToFavorites, removeFavorite, isFavorite } = useFavorites();

    const handleImageError = () => {
        setImageError(true);
        onImageError?.(menu.id);
    };

    const isMenuFavorite = isFavorite(menu.id, 'menu');

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isMenuFavorite) {
            removeFavorite(menu.id, 'menu');
        } else {
            addMenuToFavorites(menu);
        }
    };

    const handleAddToCart = () => {
        addMenu(menu, 1);
    };

    const cartItem = state.items.find(item => item.menu?.id === menu.id);
    const quantity = cartItem?.quantity || 0;

    const handleIncrease = () => {
        if (quantity === 0) {
            addMenu(menu, 1);
        } else {
            updateQuantity(menu.id, 'menu', quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity <= 1) {
            removeItem(menu.id, 'menu');
        } else {
            updateQuantity(menu.id, 'menu', quantity - 1);
        }
    };

    return (
        <Link
            href={`/menus/${menu.slug}`}
            className={`flex flex-col bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 overflow-hidden group cursor-pointer ${className}`}
        >
            {/* Image Section */}
            <div className="relative h-50 overflow-hidden">
                {menu.image && menu.image.length > 0 && !imageError ? (
                    <StrapiImage
                        src={getImageUrl(menu.image[0].url)}
                        alt={menu.image[0].alternativeText || menu.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={handleImageError}
                    />
                ) : (
                    <ImagePlaceholder
                        className="h-64"
                        text={imageError ? "Ошибка загрузки" : "Нет изображения"}
                    />
                )}

                {/* Favorite button */}
                <button
                    onClick={handleFavoriteClick}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-10 ${isMenuFavorite
                        ? 'bg-red-500/90 text-white'
                        : 'bg-white/80 text-gray-600 hover:text-red-500 hover:bg-white'
                        }`}
                    aria-label={isMenuFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                    <Heart size={16} className={isMenuFavorite ? 'fill-current' : ''} />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-6  h-50 flex flex-col justify-between">
                {/* Title and Price Row */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-hi-graphite leading-tight mb-2">
                            {menu.name}
                        </h3>
                        {showDescription && menu.smallDescription && (
                            <p className="text-gray-600 text-sm  line-clamp-2 leading-relaxed">
                                {menu.smallDescription}
                            </p>
                        )}
                    </div>
                </div>

                {/* Description */}


                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                    {showPrice && menu.pricePerPerson && (
                        <div className="text-right">
                            <div className="text-base text-hi-platinum">
                                ${menu.pricePerPerson} руб
                            </div>
                        </div>
                    )}

                    {/* Quantity Counter */}
                    {quantity > 0 ? (
                        <div
                            className="flex items-center space-x-2 bg-[#BFA76F] rounded-lg px-3 py-2 shadow-hi"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDecrease();
                                }}
                                className="text-white hover:text-hi-platinum transition-colors"
                                aria-label="Уменьшить количество"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="text-white font-medium text-sm min-w-[20px] text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleIncrease();
                                }}
                                className="text-white hover:text-hi-platinum transition-colors"
                                aria-label="Увеличить количество"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart();
                            }}
                            className="bg-[#BFA76F] hover:bg-[#BFA76F]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-hi hover:shadow-hi-hover flex items-center space-x-1"
                        >
                            <ShoppingCart size={16} />
                            <span>Заказать</span>
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
}
