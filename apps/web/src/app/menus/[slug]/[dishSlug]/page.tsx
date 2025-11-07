import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { apiClient, Dish } from '@/lib/api';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import { getImageUrl } from '@/lib/imageUtils';

interface CanonicalDishPageProps {
    params: Promise<{
        slug: string;
        dishSlug: string;
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CanonicalDishPageProps): Promise<Metadata> {
    try {
        const { dishSlug } = await params;
        const response = await apiClient.getDishBySlug(dishSlug);
        const dish = response.data?.[0] as Dish;

        if (!dish) {
            return {
                title: 'Блюдо не найдено | Hi-Catering',
                description: 'Запрашиваемое блюдо не найдено',
            };
        }

        return {
            title: `${dish.name} | Hi-Catering`,
            description: dish.description || `Вкусное блюдо ${dish.name} от Hi-Catering`,
            openGraph: {
                title: `${dish.name} | Hi-Catering`,
                description: dish.description || `Вкусное блюдо ${dish.name}`,
                type: 'website',
                images: dish.images && dish.images.length > 0 ? [
                    {
                        url: getImageUrl(dish.images[0].url),
                        width: dish.images[0].width,
                        height: dish.images[0].height,
                        alt: dish.images[0].alternativeText || dish.name,
                    }
                ] : [],
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Блюдо | Hi-Catering',
            description: 'Вкусное блюдо от Hi-Catering',
        };
    }
}

// Generate static params for all dishes with their canonical URLs
export async function generateStaticParams() {
    try {
        const response = await apiClient.getDishes({ populate: '*' });
        const dishes = response.data as Dish[];

        return dishes
            .filter(dish => dish.menu) // Only dishes that belong to a menu
            .map((dish) => ({
                menuSlug: dish.menu!.slug,
                dishSlug: dish.slug,
            }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Enable dynamic routes for development
export const dynamicParams = true;

export default async function CanonicalDishPage({ params }: CanonicalDishPageProps) {
    try {
        const { slug, dishSlug } = await params;
        const response = await apiClient.getDishBySlug(dishSlug);
        const dish = response.data?.[0] as Dish;

        if (!dish) {
            notFound();
        }

        // Verify that the dish belongs to the specified menu
        if (!dish.menu || dish.menu.slug !== slug) {
            notFound();
        }

        // Prepare breadcrumb items
        const breadcrumbItems: BreadcrumbItem[] = [
            { label: 'Главная', href: '/' },
            { label: 'Меню', href: '/menus' },
            { label: dish.menu.name, href: `/menus/${dish.menu.slug}` },
            { label: dish.name }
        ];

        return (
            <div className="min-h-screen bg-hi-white">
                {/* Breadcrumb */}
                <Breadcrumbs items={breadcrumbItems} />

                {/* Hero Section */}
                <section className="py-16 bg-hi-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Content */}
                            <div>
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

                                <h1 className="text-4xl font-bold text-hi-graphite mb-6">{dish.name}</h1>

                                {dish.description && (
                                    <p className="text-lg text-hi-graphite mb-6 leading-relaxed">
                                        {dish.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-6 mb-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-hi-green">
                                            {dish.price} {dish.currency}
                                        </div>
                                        <div className="text-sm text-hi-graphite">цена</div>
                                    </div>

                                    {dish.servingSize && (
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-hi-graphite">
                                                {dish.servingSize}
                                            </div>
                                            <div className="text-sm text-hi-graphite">порция</div>
                                        </div>
                                    )}

                                    {dish.preparationTime && (
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-hi-graphite">
                                                {dish.preparationTime} мин
                                            </div>
                                            <div className="text-sm text-hi-graphite">время приготовления</div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <button className="bg-hi-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-hi-green/90 transition-colors">
                                        Заказать блюдо
                                    </button>
                                    <button className="border border-hi-graphite text-hi-graphite px-8 py-3 rounded-lg font-semibold hover:bg-hi-graphite hover:text-white transition-colors">
                                        Связаться с нами
                                    </button>
                                </div>
                            </div>

                            {/* Image */}
                            <div className="relative">
                                {dish.images && dish.images.length > 0 && dish.images[0] && dish.images[0].url ? (
                                    <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-hi">
                                        <StrapiImage
                                            src={getImageUrl(dish.images[0].url)}
                                            alt={dish.images[0].alternativeText || dish.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <ImagePlaceholder
                                        className="h-96 lg:h-[500px] rounded-lg shadow-hi"
                                        text="Изображение блюда"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Images */}
                {dish.images && dish.images.length > 1 && (
                    <section className="py-16 bg-hi-ash">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-hi-graphite mb-8 text-center">
                                Дополнительные фотографии
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {dish.images.slice(1).map((image, index) => (
                                    <div key={index} className="relative h-64 rounded-lg overflow-hidden shadow-hi">
                                        <StrapiImage
                                            src={getImageUrl(image.url)}
                                            alt={image.alternativeText || `${dish.name} - фото ${index + 2}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Ingredients and Allergens */}
                {(dish.ingredients || dish.allergens) && (
                    <section className="py-16 bg-hi-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {dish.ingredients && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-hi-graphite mb-4">
                                            Ингредиенты
                                        </h3>
                                        <div className="bg-hi-ash p-6 rounded-lg">
                                            <p className="text-hi-graphite leading-relaxed">
                                                {dish.ingredients}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {dish.allergens && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-hi-graphite mb-4">
                                            Аллергены
                                        </h3>
                                        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                                            <p className="text-hi-graphite leading-relaxed">
                                                {dish.allergens}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Nutritional Info */}
                {dish.nutritionalInfo && (
                    <section className="py-16 bg-hi-ash">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h3 className="text-2xl font-bold text-hi-graphite mb-8 text-center">
                                Пищевая ценность
                            </h3>
                            <div className="bg-hi-white p-8 rounded-lg shadow-hi">
                                <pre className="text-hi-graphite whitespace-pre-wrap">
                                    {JSON.stringify(dish.nutritionalInfo, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </section>
                )}

                {/* Related Menu */}
                {dish.menu && (
                    <section className="py-16 bg-hi-graphite">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Это блюдо входит в меню "{dish.menu.name}"
                            </h2>
                            <p className="text-lg text-hi-silver mb-8 max-w-2xl mx-auto">
                                Посмотрите полное меню, чтобы увидеть другие блюда
                            </p>
                            <Link
                                href={`/menus/${dish.menu.slug}`}
                                className="inline-block bg-hi-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-hi-green/90 transition-colors"
                            >
                                Посмотреть меню
                            </Link>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-16 bg-hi-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-hi-graphite mb-4">
                            Готовы заказать это блюдо?
                        </h2>
                        <p className="text-lg text-hi-graphite mb-8 max-w-2xl mx-auto">
                            Свяжитесь с нами для обсуждения деталей и оформления заказа
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-hi-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-hi-green/90 transition-colors">
                                Заказать
                            </button>
                            <button className="border border-hi-graphite text-hi-graphite px-8 py-3 rounded-lg font-semibold hover:bg-hi-graphite hover:text-white transition-colors">
                                Позвонить нам
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        );
    } catch (error) {
        console.error('Error loading dish:', error);
        notFound();
    }
}
