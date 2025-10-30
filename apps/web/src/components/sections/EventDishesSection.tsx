'use client';

import React, { useState, useEffect } from 'react';
import { Dish, DishType, DISH_TYPE_LABELS, apiClient } from '@/lib/api';
import { DishCard } from '@/components/ui/DishCard';
import { FallbackComponent } from '@/components/ui/FallbackComponent';

// Add keyframes for animations
if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translate3d(0, 30px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes shimmer {
      0% { background-position: -200px 0; }
      100% { background-position: calc(200px + 100%) 0; }
    }
  `;
    document.head.appendChild(style);
}

interface EventDishesSectionProps {
    title?: string;
    showOnlyFeatured?: boolean;
    dishes?: Dish[];
}

export function EventDishesSection({
    title = "Наши блюда",
    showOnlyFeatured = false,
    dishes: propDishes
}: EventDishesSectionProps) {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    useEffect(() => {
        const initializeDishes = async () => {
            try {
                setLoading(true);

                let dishesData: Dish[];

                if (propDishes && propDishes.length > 0) {
                    // Use dishes passed as props (from event page)
                    dishesData = propDishes;
                } else {
                    // Fallback: load all dishes
                    const response = await apiClient.getDishes({
                        populate: '*'
                    });
                    dishesData = response.data || [];
                }

                setDishes(dishesData);

                // Keep default active tab as 'all' to show all dishes by default
            } catch (err) {
                console.error('Error loading dishes:', err);
                setError('Не удалось загрузить блюда');
            } finally {
                setLoading(false);
            }
        };

        initializeDishes();
    }, [propDishes]);

    const handleImageError = (dishId: number) => {
        setImageErrors(prev => new Set(prev).add(dishId));
    };

    // Group dishes by type
    const groupedDishes = dishes.reduce((acc, dish) => {
        const type = dish.type || 'other';
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(dish);
        return acc;
    }, {} as Record<string, Dish[]>);

    // Get available tabs (types that have dishes)
    const availableTabs = Object.keys(groupedDishes).filter(type => groupedDishes[type].length > 0);

    // Add "all" tab if there are multiple types
    const tabs = availableTabs.length > 1 ? ['all', ...availableTabs] : availableTabs;

    // Get dishes to display based on active tab
    const dishesToShow = activeTab === 'all' ? dishes : (groupedDishes[activeTab] || []);

    if (loading) {
        return (
            <section className="py-16 bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-hi-graphite mb-4">{title}</h2>
                        <div className="animate-pulse">
                            <div className="h-12 bg-hi-silver rounded w-64 mx-auto mb-8"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-hi-silver rounded-2xl h-96"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || dishes.length === 0) {
        return (
            <section className="py-16 bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-hi-graphite mb-8">{title}</h2>
                        <FallbackComponent
                            message={error || "Блюда не найдены"}
                            size="lg"
                            variant="card"
                        />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className=" py-20 via-hi-ash/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23BFA76F\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>

            <div className="max-w-7xl mx-auto relative z-10 ">
                {/* Enhanced Section Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-hi-graphite via-[#BFA76F] to-hi-graphite bg-clip-text text-transparent mb-6 leading-tight">
                        {title}
                    </h2>
                    <p className="text-xl md:text-2xl text-hi-platinum max-w-4xl mx-auto mb-8 leading-relaxed">
                        🌟 Каждое блюдо — это <span className="text-[#BFA76F] font-semibold">кулинарный шедевр</span>, созданный с любовью специально для вас
                    </p>
                </div>

                {/* Enhanced Tab Navigation */}
                {tabs.length > 1 && (
                    <div className="mb-16 ">
                        <div className="flex flex-wrap justify-center gap-4">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab;
                                const count = tab === 'all' ? dishes.length : groupedDishes[tab]?.length || 0;

                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${isActive
                                            ? 'bg-gradient-to-r from-[#BFA76F] to-[#BFA76F]/80 text-white shadow-xl shadow-[#BFA76F]/25'
                                            : 'bg-white/80 backdrop-blur-sm text-hi-graphite border-2 border-hi-silver/50 hover:border-[#BFA76F]/50 hover:text-[#BFA76F] hover:shadow-lg'
                                            }`}
                                    >
                                        {/* Active tab glow effect */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#BFA76F] to-[#BFA76F]/80 rounded-2xl animate-pulse opacity-20"></div>
                                        )}

                                        <div className="relative flex items-center gap-3">
                                            <span className="text-xl">
                                                {tab === 'all' ? '🍽️' :
                                                    tab === 'hot' ? '🔥' :
                                                        tab === 'cold' ? '🧊' :
                                                            tab === 'side' ? '🥗' :
                                                                tab === 'baked' ? '🥖' :
                                                                    tab === 'drink' ? '🥤' :
                                                                        tab === 'sweet' ? '🍰' : '✨'}
                                            </span>

                                            <div className="text-left">
                                                <div className="text-base font-bold">
                                                    {tab === 'all' ? 'Все блюда' : DISH_TYPE_LABELS[tab as DishType] || tab}
                                                </div>
                                                <div className={`text-xs font-medium ${isActive ? 'text-white/80' : 'text-hi-platinum'}`}>
                                                    {count} {count === 1 ? 'блюдо' : count < 5 ? 'блюда' : 'блюд'}
                                                </div>
                                            </div>

                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Dishes Grid with enhanced styling */}
                <div className="relative bg-white rounded-3xl border border-hi-silver/30 shadow-2xl shadow-[#BFA76F]/10 overflow-hidden">
                    {/* Grid background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#BFA76F]/5 to-transparent"></div>

                    <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8 items-stretch">
                        {dishesToShow.map((dish, index) => (
                            <div
                                key={dish.id}
                                className="transform hover:scale-105 transition-all duration-300 h-full"
                                style={{
                                    animationName: 'fadeInUp',
                                    animationDuration: '0.6s',
                                    animationTimingFunction: 'ease-out',
                                    animationFillMode: 'forwards',
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <DishCard
                                    dish={dish}
                                    onImageError={handleImageError}
                                    imageError={imageErrors.has(dish.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Success stories / Social proof section */}
                <div className="mt-20 text-center">
                    <div className="bg-gradient-to-r from-[#BFA76F]/10 via-[#BFA76F]/5 to-[#BFA76F]/10 rounded-3xl p-8 backdrop-blur-sm border border-[#BFA76F]/20">
                        <div className="flex flex-wrap justify-center items-center gap-8 mb-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#BFA76F] mb-1">500+</div>
                                <div className="text-sm text-hi-platinum">Довольных клиентов</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#BFA76F] mb-1">4.9⭐</div>
                                <div className="text-sm text-hi-platinum">Средний рейтинг</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#BFA76F] mb-1">98%</div>
                                <div className="text-sm text-hi-platinum">Повторных заказов</div>
                            </div>
                        </div>

                        <p className="text-lg text-hi-graphite font-medium mb-4">
                            💬 <em>"Каждый заказ — это маленький праздник для наших клиентов!"</em>
                        </p>

                        <div className="flex justify-center items-center gap-2 text-sm text-hi-platinum">
                            <span>⚡ Заказать проще простого</span>
                            <span>•</span>
                            <span>🚀 Доставим в лучшем виде</span>
                            <span>•</span>
                            <span>❤️ Гарантия качества</span>
                        </div>
                    </div>
                </div>

                {/* Empty state for filtered results */}
                {dishesToShow.length === 0 && activeTab !== 'all' && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-semibold text-hi-graphite mb-2">
                            Блюда типа "{DISH_TYPE_LABELS[activeTab as DishType] || activeTab}" не найдены
                        </h3>
                        <p className="text-hi-platinum">
                            Попробуйте выбрать другую категорию или посмотрите все блюда
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
