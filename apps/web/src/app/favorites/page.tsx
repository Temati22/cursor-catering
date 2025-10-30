'use client';

import React from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { EventCard } from '@/components/ui/EventCard';
import { DishCard } from '@/components/ui/DishCard';
import { MenuCard } from '@/components/ui/MenuCard';
import { Heart, Calendar, Utensils, BookOpen, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
    const { state, getFavoritesByType, clearFavorites } = useFavorites();

    const favoriteEvents = getFavoritesByType('event');
    const favoriteDishes = getFavoritesByType('dish');
    const favoriteMenus = getFavoritesByType('menu');

    const handleClearAll = () => {
        if (window.confirm('Вы уверены, что хотите очистить весь список избранного?')) {
            clearFavorites();
        }
    };

    if (state.totalItems === 0) {
        return (
            <div className="min-h-screen bg-hi-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-4">
                            <Heart className="text-hi-green mr-2" size={32} />
                            <h1 className="text-3xl font-bold text-hi-graphite">Избранное</h1>
                        </div>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Здесь будут храниться ваши любимые мероприятия, блюда и меню
                        </p>
                    </div>

                    {/* Empty state */}
                    <div className="text-center py-16">
                        <Heart size={64} className="text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600 mb-2">
                            У вас пока нет избранных элементов
                        </h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Нажимайте на сердечко на карточках мероприятий, блюд и меню, чтобы добавить их в избранное.
                        </p>
                        <div className="space-y-4">
                            <a
                                href="/"
                                className="inline-block bg-hi-green text-white px-6 py-3 rounded-lg font-medium hover:bg-hi-green-dark transition-colors"
                            >
                                Перейти на главную
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-hi-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div className="text-center flex-1">
                        <div className="flex items-center justify-center mb-4">
                            <Heart className="text-hi-green mr-2" size={32} />
                            <h1 className="text-3xl font-bold text-hi-graphite">Избранное</h1>
                        </div>
                        <p className="text-lg text-gray-600">
                            {state.totalItems} {state.totalItems === 1 ? 'элемент' : state.totalItems < 5 ? 'элемента' : 'элементов'} в избранном
                        </p>
                    </div>

                    {/* Clear all button */}
                    <button
                        onClick={handleClearAll}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                        <Trash2 size={16} />
                        <span>Очистить всё</span>
                    </button>
                </div>

                {/* Events Section */}
                {favoriteEvents.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center mb-8">
                            <Calendar className="text-hi-green mr-2" size={24} />
                            <h2 className="text-2xl font-bold text-hi-graphite">
                                Мероприятия ({favoriteEvents.length})
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {favoriteEvents.map((item) => item.event && (
                                <EventCard
                                    key={item.event.id}
                                    event={item.event}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Dishes Section */}
                {favoriteDishes.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center mb-8">
                            <Utensils className="text-hi-green mr-2" size={24} />
                            <h2 className="text-2xl font-bold text-hi-graphite">
                                Блюда ({favoriteDishes.length})
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {favoriteDishes.map((item) => item.dish && (
                                <DishCard
                                    key={item.dish.id}
                                    dish={item.dish}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Menus Section */}
                {favoriteMenus.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center mb-8">
                            <BookOpen className="text-hi-green mr-2" size={24} />
                            <h2 className="text-2xl font-bold text-hi-graphite">
                                Меню ({favoriteMenus.length})
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {favoriteMenus.map((item) => item.menu && (
                                <MenuCard
                                    key={item.menu.id}
                                    menu={item.menu}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
