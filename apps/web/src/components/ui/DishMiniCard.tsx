'use client';

import React from 'react';
import { Dish } from '@/lib/api';
import { StrapiImage } from './StrapiImage';
import { ImagePlaceholder } from './ImagePlaceholder';

interface DishMiniCardProps {
    dish: Dish;
    className?: string;
}

export function DishMiniCard({ dish, className = '' }: DishMiniCardProps) {
    const getImageUrl = (url: string): string => {
        if (url.startsWith('http')) {
            return url;
        }
        return `http://localhost:1337${url}`;
    };

    return (
        <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden min-h-[120px] ${className}`}>
            <div className="flex h-full">
                {/* Dish Image */}
                <div
                    className="relative w-[30%] h-full min-h-[150px] overflow-hidden flex-shrink-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: dish.images && dish.images.length > 0 && dish.images[0] && dish.images[0].url
                            ? `url(${getImageUrl(dish.images[0].url)})`
                            : 'none'
                    }}
                >
                    {(!dish.images || dish.images.length === 0 || !dish.images[0] || !dish.images[0].url) && (
                        <ImagePlaceholder
                            className="h-full"
                            text="Блюдо"
                        />
                    )}
                </div>

                {/* Dish Info */}
                <div className="flex-1 p-2 flex flex-col justify-between h-full">
                    <div>
                        <h4 className="text-lg font-semibold text-hi-graphite mb-2">
                            {dish.name}
                        </h4>

                        {/* Ingredients */}
                        {dish.ingredients && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                Состав: {dish.ingredients}
                            </p>
                        )}

                        {/* Dietary tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {dish.isVegetarian && (
                                <span className="px-2 py-1 bg-hi-green bg-opacity-20 text-hi-graphite text-xs rounded font-medium">
                                    Вегетарианское
                                </span>
                            )}
                            {dish.isVegan && (
                                <span className="px-2 py-1 bg-hi-green bg-opacity-20 text-hi-graphite text-xs rounded font-medium">
                                    Веганское
                                </span>
                            )}
                            {dish.isGlutenFree && (
                                <span className="px-2 py-1 bg-hi-platinum bg-opacity-20 text-hi-graphite text-xs rounded font-medium">
                                    Без глютена
                                </span>
                            )}
                            {dish.isSpicy && (
                                <span className="px-2 py-1 bg-hi-red bg-opacity-20 text-hi-graphite text-xs rounded font-medium">
                                    Острое
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Bottom row with weight and price */}
                    <div className="flex justify-between items-center">
                        {/* Weight */}
                        {dish.servingSize && (
                            <span className="text-sm text-gray-500 font-medium">
                                {dish.servingSize}
                            </span>
                        )}

                        {/* Price */}
                        <span className="text-lg font-bold text-hi-green">
                            {dish.price} {dish.currency}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
