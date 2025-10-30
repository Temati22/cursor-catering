'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, Menu } from '@/lib/api';
import { MenuCard } from '@/components/ui/MenuCard';
import { HorizontalCtaSection } from '@/components/sections/HorizontalCtaSection';
import { CompactCtaSection } from '@/components/sections/CompactCtaSection';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export default function MenusPage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setLoading(true);
                const response = await apiClient.getMenus({ populate: '*' });
                const allMenus = response.data as Menu[];
                setMenus(allMenus);
                setFilteredMenus(allMenus);
            } catch (err) {
                console.error('Error loading menus:', err);
                setError('Не удалось загрузить меню');
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    // Фильтрация меню при изменении выбранного типа
    useEffect(() => {
        if (selectedType === null) {
            setFilteredMenus(menus);
        } else {
            const filtered = menus.filter(menu => menu.type === selectedType);
            setFilteredMenus(filtered);
        }
    }, [selectedType, menus]);

    const handleFilterClick = (type: string | null) => {
        setSelectedType(type);
    };

    const handleImageError = (menuId: number) => {
        // Handle image error silently
    };

    // Подготавливаем хлебные крошки
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Главная', href: '/' },
        { label: 'Все меню' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <p className="text-hi-graphite text-lg">Загрузка меню...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-hi-graphite mb-4">
                            Ошибка загрузки
                        </h1>
                        <p className="text-hi-graphite mb-8">
                            {error}
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-hi-platinum text-white px-8 py-3 rounded-lg font-semibold hover:bg-hi-green/90 transition-colors"
                        >
                            Вернуться на главную
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-hi-white">
            {/* Breadcrumb */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* Header */}
            <section className="py-16 bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold text-hi-graphite mb-4">
                        Все наши меню
                    </h1>
                    <p className="text-lg text-hi-graphite max-w-3xl mx-auto">
                        Выберите идеальное меню для любого случая - от корпоративных мероприятий до семейных праздников.
                        Каждое меню тщательно подобрано нашими шеф-поварами.
                    </p>
                </div>
            </section>

            {/* Main Content with Sidebar */}
            <section className="py-16 bg-hi-ash">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Menu */}
                        <div className="lg:w-1/4">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 z-10">
                                <h2 className="text-xl font-bold text-hi-graphite mb-4">
                                    Типы меню
                                </h2>
                                <nav className="space-y-2">
                                    <div
                                        className={`font-medium py-2 px-3 rounded-md transition-colors cursor-pointer ${selectedType === null
                                            ? 'bg-hi-platinum text-white'
                                            : 'text-hi-graphite hover:bg-hi-ash'
                                            }`}
                                        onClick={() => handleFilterClick(null)}
                                    >
                                        Все виды меню
                                    </div>
                                    <div
                                        className={`font-medium py-2 px-3 rounded-md transition-colors cursor-pointer ${selectedType === 'gastrobox'
                                            ? 'bg-hi-platinum text-white'
                                            : 'text-hi-graphite hover:bg-hi-ash'
                                            }`}
                                        onClick={() => handleFilterClick('gastrobox')}
                                    >
                                        Гастробоксы
                                    </div>
                                    <div
                                        className={`font-medium py-2 px-3 rounded-md transition-colors cursor-pointer ${selectedType === 'coffee-break'
                                            ? 'bg-hi-platinum text-white'
                                            : 'text-hi-graphite hover:bg-hi-ash'
                                            }`}
                                        onClick={() => handleFilterClick('coffee-break')}
                                    >
                                        Кофе брейк
                                    </div>
                                    <div
                                        className={`font-medium py-2 px-3 rounded-md transition-colors cursor-pointer ${selectedType === 'buffet'
                                            ? 'bg-hi-platinum text-white'
                                            : 'text-hi-graphite hover:bg-hi-ash'
                                            }`}
                                        onClick={() => handleFilterClick('buffet')}
                                    >
                                        Фуршет
                                    </div>
                                    <div
                                        className={`font-medium py-2 px-3 rounded-md transition-colors cursor-pointer ${selectedType === 'banquet'
                                            ? 'bg-hi-platinum text-white'
                                            : 'text-hi-graphite hover:bg-hi-ash'
                                            }`}
                                        onClick={() => handleFilterClick('banquet')}
                                    >
                                        Банкет
                                    </div>
                                    <div
                                        className={`font-medium py-2 px-3 rounded-md transition-colors cursor-pointer ${selectedType === 'barbecue-banquet'
                                            ? 'bg-hi-platinum text-white'
                                            : 'text-hi-graphite hover:bg-hi-ash'
                                            }`}
                                        onClick={() => handleFilterClick('barbecue-banquet')}
                                    >
                                        Банкет барбекю
                                    </div>
                                    <div
                                        className={`font-medium py-2 px-3 rounded-md transition-colors cursor-pointer ${selectedType === 'kids-menu'
                                            ? 'bg-hi-platinum text-white'
                                            : 'text-hi-graphite hover:bg-hi-ash'
                                            }`}
                                        onClick={() => handleFilterClick('kids-menu')}
                                    >
                                        Детское меню
                                    </div>
                                    <div
                                        className={`font-medium py-2 px-3 rounded-md transition-colors cursor-pointer ${selectedType === 'mobile-bar'
                                            ? 'bg-hi-platinum text-white'
                                            : 'text-hi-graphite hover:bg-hi-ash'
                                            }`}
                                        onClick={() => handleFilterClick('mobile-bar')}
                                    >
                                        Выездной бар
                                    </div>
                                    <div
                                        className={`font-medium py-2 px-3 rounded-md transition-colors cursor-pointer ${selectedType === 'hookah-catering'
                                            ? 'bg-hi-platinum text-white'
                                            : 'text-hi-graphite hover:bg-hi-ash'
                                            }`}
                                        onClick={() => handleFilterClick('hookah-catering')}
                                    >
                                        Кальянный кейтеринг
                                    </div>
                                    <div
                                        className={`font-medium py-2 px-3 rounded-md transition-colors cursor-pointer ${selectedType === 'boat-sets'
                                            ? 'bg-hi-platinum text-white'
                                            : 'text-hi-graphite hover:bg-hi-ash'
                                            }`}
                                        onClick={() => handleFilterClick('boat-sets')}
                                    >
                                        Наборы на катера
                                    </div>
                                </nav>
                            </div>
                        </div>

                        {/* Menus Grid */}
                        <div className="lg:w-3/4">
                            {filteredMenus.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-hi-graphite text-lg">
                                        {selectedType ? 'Меню данного типа пока не добавлены' : 'Меню пока не добавлены'}
                                    </p>
                                    <Link
                                        href="/"
                                        className="inline-block mt-4 text-hi-green hover:text-hi-green/80 transition-colors"
                                    >
                                        Вернуться на главную
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {Array.from({ length: Math.ceil(filteredMenus.length / 3) }, (_, rowIndex) => {
                                        const startIndex = rowIndex * 3;
                                        const endIndex = Math.min(startIndex + 3, filteredMenus.length);
                                        const rowMenus = filteredMenus.slice(startIndex, endIndex);
                                        const isLastRow = rowIndex === Math.ceil(filteredMenus.length / 3) - 1;

                                        return (
                                            <React.Fragment key={rowIndex}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    {rowMenus.map((menu) => (
                                                        <MenuCard
                                                            key={menu.id}
                                                            menu={menu}
                                                            showPrice={true}
                                                            showDescription={true}
                                                            onImageError={handleImageError}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Вставляем CTA после каждой второй строки (кроме последней) */}
                                                {rowIndex % 2 === 1 && !isLastRow && (
                                                    <div className="my-4">
                                                        <CompactCtaSection
                                                            variant="gold"
                                                            title="Нужна консультация?"
                                                            subtitle="Получите персональное предложение за 5 минут"
                                                            ctaText="Получить предложение"
                                                            showContactInfo={true}
                                                            showTimer={true}
                                                            className="rounded-lg"
                                                            containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                                                        />
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Горизонтальный CTA блок */}
            <HorizontalCtaSection
                variant="luxury"
                title="Не нашли подходящее меню?"
                subtitle="Создадим индивидуальное меню"
                description="Наши шеф-повара разработают уникальное меню специально для вашего мероприятия с учетом всех пожеланий и диетических ограничений."
                ctaText="Создать индивидуальное меню"
                icon={<ChefHat className="h-6 w-6" />}
            />

            {/* Компактный CTA блок */}
            <CompactCtaSection
                variant="secondary"
                title="Нужна консультация по меню?"
                subtitle="Наши эксперты помогут выбрать идеальное меню"
                ctaText="Получить консультацию"
                showContactInfo={true}
                showTimer={true}
            />
        </div>
    );
}
