'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient, Menu } from '@/lib/api';
import { MenuCard } from '@/components/ui/MenuCard';
import { FallbackComponent } from '@/components/ui/FallbackComponent';

interface MenusSectionProps {
    limit?: number;
    showPrice?: boolean;
    showDescription?: boolean;
}

export function MenusSection({
    limit = 4,
    showPrice = true,
    showDescription = true
}: MenusSectionProps) {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setLoading(true);
                const response = await apiClient.getMenus({
                    populate: '*'
                });
                const allMenus = response.data || [];
                // Limit menus on client side since server pagination causes 400 errors
                setMenus(allMenus.slice(0, limit));
            } catch (err) {
                console.error('Error fetching menus:', err);
                setError('Не удалось загрузить меню');
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, [limit]);

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            gastrobox: 'Гастробоксы',
            'coffee-break': 'Кофе брейк',
            buffet: 'Фуршет',
            banquet: 'Банкет',
            'barbecue-banquet': 'Банкет барбекю',
            'kids-menu': 'Детское меню',
            'mobile-bar': 'Выездной бар',
            'hookah-catering': 'Кальянный кейтеринг',
            'boat-sets': 'Наборы на катера'
        };
        return labels[type] || type;
    };

    const getOccasionLabel = (occasion: string) => {
        const labels: Record<string, string> = {
            wedding: 'Свадьба',
            corporate: 'Корпоратив',
            birthday: 'День рождения',
            anniversary: 'Годовщина',
            holiday: 'Праздник',
            casual: 'Повседневное',
            formal: 'Формальное',
            buffet: 'Фуршет'
        };
        return labels[occasion] || occasion;
    };

    if (loading) {
        return (
            <section className="py-16 bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-hi-graphite mb-8">Наши меню</h2>
                        <FallbackComponent
                            message="Загружаем меню..."
                            size="lg"
                            variant="card"
                        />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-hi-graphite mb-8">Наши меню</h2>
                        <FallbackComponent
                            message={error}
                            size="lg"
                            variant="card"
                            className="border-red-200 bg-red-50 text-red-600"
                        />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-hi-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-hi-graphite mb-4">Наши меню</h2>
                    <p className="text-lg text-hi-graphite max-w-2xl mx-auto mb-6">
                        Выберите идеальное меню для любого случая - от корпоративных мероприятий до семейных праздников
                    </p>
                    <Link
                        href="/menus"
                        className="inline-block text-hi-green font-semibold hover:text-hi-green/80 transition-colors"
                    >
                        Посмотреть все меню →
                    </Link>
                </div>

                {menus.length === 0 ? (
                    <FallbackComponent
                        message="Меню пока не добавлены"
                        size="md"
                        variant="minimal"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {menus.map((menu) => (
                            <MenuCard
                                key={menu.id}
                                menu={menu}
                                showPrice={showPrice}
                                showDescription={showDescription}
                                onImageError={(menuId) => setImageErrors(prev => new Set(prev).add(menuId))}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
