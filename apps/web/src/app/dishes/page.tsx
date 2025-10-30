import { Metadata } from 'next';
import { apiClient, Dish } from '@/lib/api';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { HorizontalCtaSection } from '@/components/sections/HorizontalCtaSection';
import { CompactCtaSection } from '@/components/sections/CompactCtaSection';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { ChefHat, Utensils } from 'lucide-react';

// Helper function to get absolute URL for images
const getImageUrl = (url: string): string => {
    if (url.startsWith('http')) {
        return url;
    }
    return `http://localhost:1337${url}`;
};

export const metadata: Metadata = {
    title: 'Все блюда | Hi-Catering',
    description: 'Полный каталог наших блюд. Выберите вкусные блюда для вашего мероприятия.',
    openGraph: {
        title: 'Все блюда | Hi-Catering',
        description: 'Полный каталог наших блюд',
        type: 'website',
    },
};

export default async function DishesPage() {
    try {
        const response = await apiClient.getDishes({ populate: '*' });
        const dishes = response.data as Dish[];

        // Подготавливаем хлебные крошки
        const breadcrumbItems: BreadcrumbItem[] = [
            { label: 'Главная', href: '/' },
            { label: 'Все блюда' }
        ];

        return (
            <div className="min-h-screen bg-hi-white">
                {/* Breadcrumb */}
                <Breadcrumbs items={breadcrumbItems} />

                {/* Header */}
                <section className="py-16 bg-hi-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold text-hi-graphite mb-4">
                            Все наши блюда
                        </h1>
                        <p className="text-lg text-hi-graphite max-w-3xl mx-auto">
                            Выберите вкусные блюда для любого случая - от корпоративных мероприятий до семейных праздников.
                            Каждое блюдо приготовлено нашими шеф-поварами с любовью.
                        </p>
                    </div>
                </section>

                {/* Dishes Grid */}
                <section className="py-16 bg-hi-ash">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {dishes.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-hi-graphite text-lg">Блюда пока не добавлены</p>
                                <Link
                                    href="/"
                                    className="inline-block mt-4 text-hi-green hover:text-hi-green/80 transition-colors"
                                >
                                    Вернуться на главную
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {dishes.map((dish) => (
                                    <Link
                                        key={dish.id}
                                        href={dish.menu ? `/menus/${dish.menu.slug}/${dish.slug}` : `/dishes/${dish.slug}`}
                                        className="block bg-hi-white rounded-lg shadow-hi overflow-hidden hover:shadow-hi-hover transition-shadow duration-300"
                                    >
                                        {dish.images && dish.images.length > 0 ? (
                                            <div className="relative h-64">
                                                <StrapiImage
                                                    src={getImageUrl(dish.images[0].url)}
                                                    alt={dish.images[0].alternativeText || dish.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <ImagePlaceholder
                                                className="h-64"
                                                text="Блюдо"
                                            />
                                        )}

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-semibold text-hi-graphite">{dish.name}</h3>
                                                <span className="text-lg font-bold text-hi-green">
                                                    {dish.price} {dish.currency}
                                                </span>
                                            </div>

                                            {dish.description && (
                                                <p className="text-hi-graphite mb-4 line-clamp-2">
                                                    {dish.description}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {dish.isVegetarian && (
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                                                        Вегетарианское
                                                    </span>
                                                )}
                                                {dish.isVegan && (
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                                                        Веганское
                                                    </span>
                                                )}
                                                {dish.isGlutenFree && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                                                        Без глютена
                                                    </span>
                                                )}
                                                {dish.isSpicy && (
                                                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium">
                                                        Острое
                                                    </span>
                                                )}
                                            </div>

                                            {dish.menu && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-hi-graphite mb-2">
                                                        Входит в меню:
                                                    </p>
                                                    <span className="text-sm bg-hi-white px-2 py-1 rounded border border-hi-silver text-hi-graphite font-medium">
                                                        {dish.menu.name}
                                                    </span>
                                                </div>
                                            )}

                                            {dish.preparationTime && (
                                                <div className="text-xs text-hi-graphite mb-4">
                                                    Время приготовления: {dish.preparationTime} мин
                                                </div>
                                            )}

                                            <div className="text-center">
                                                <span className="inline-flex items-center text-hi-green font-semibold text-sm hover:text-hi-green/80 transition-colors">
                                                    Подробнее
                                                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Горизонтальный CTA блок */}
                <HorizontalCtaSection
                    variant="luxury"
                    title="Не нашли подходящее блюдо?"
                    subtitle="Создадим уникальное блюдо"
                    description="Наши шеф-повара разработают эксклюзивное блюдо специально для вашего мероприятия с учетом всех пожеланий и диетических ограничений."
                    ctaText="Создать уникальное блюдо"
                    icon={<Utensils className="h-6 w-6" />}
                />

                {/* Компактный CTA блок */}
                <CompactCtaSection
                    variant="secondary"
                    title="Нужна консультация по блюдам?"
                    subtitle="Наши шеф-повара помогут выбрать идеальные блюда"
                    ctaText="Получить консультацию"
                    showContactInfo={true}
                    showTimer={true}
                />
            </div>
        );
    } catch (error) {
        console.error('Error loading dishes:', error);
        return (
            <div className="min-h-screen bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-hi-graphite mb-4">
                            Ошибка загрузки
                        </h1>
                        <p className="text-hi-graphite mb-8">
                            Не удалось загрузить блюда. Попробуйте обновить страницу.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-hi-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-hi-green/90 transition-colors"
                        >
                            Вернуться на главную
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
