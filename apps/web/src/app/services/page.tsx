import { Metadata } from 'next';
import { apiClient, Service } from '@/lib/api';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { HorizontalCtaSection } from '@/components/sections/HorizontalCtaSection';
import { CompactCtaSection } from '@/components/sections/CompactCtaSection';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Briefcase, ShoppingCart } from 'lucide-react';
import { getImageUrl } from '@/lib/imageUtils';

export const metadata: Metadata = {
    title: 'Услуги | Hi-Catering',
    description: 'Полный спектр наших услуг кейтеринга. Выберите подходящую услугу для вашего мероприятия.',
    openGraph: {
        title: 'Услуги | Hi-Catering',
        description: 'Полный спектр наших услуг кейтеринга',
        type: 'website',
    },
};

export default async function ServicesPage() {
    try {
        const response = await apiClient.getServices({ populate: '*' });
        const services = response.data as Service[];

        // Подготавливаем хлебные крошки
        const breadcrumbItems: BreadcrumbItem[] = [
            { label: 'Главная', href: '/' },
            { label: 'Услуги' }
        ];

        return (
            <div className="min-h-screen bg-hi-white">
                {/* Breadcrumb */}
                <Breadcrumbs items={breadcrumbItems} />

                {/* Header */}
                <section className="py-16 bg-hi-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold text-hi-graphite mb-4">
                            Наши услуги
                        </h1>
                        <p className="text-lg text-hi-graphite max-w-3xl mx-auto">
                            Полный спектр услуг кейтеринга для любых мероприятий - от корпоративных событий до семейных праздников.
                            Мы предлагаем комплексные решения для организации вашего идеального события.
                        </p>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-16 bg-hi-ash">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {services.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-hi-graphite text-lg">Услуги пока не добавлены</p>
                                <Link
                                    href="/"
                                    className="inline-block mt-4 text-hi-green hover:text-hi-green/80 transition-colors"
                                >
                                    Вернуться на главную
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {services.map((service) => (
                                    <Link
                                        key={service.id}
                                        href={`/services/${service.slug}`}
                                        className="block bg-hi-white rounded-lg shadow-hi overflow-hidden hover:shadow-hi-hover transition-shadow duration-300"
                                    >
                                        {service.Images && service.Images.length > 0 ? (
                                            <div className="relative h-64">
                                                <StrapiImage
                                                    src={getImageUrl(service.Images[0].url)}
                                                    alt={service.Images[0].alternativeText || service.Title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <ImagePlaceholder
                                                className="h-64"
                                                text="Услуга"
                                            />
                                        )}

                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-hi-graphite mb-3">
                                                {service.TitleInmenu || service.Title}
                                            </h3>

                                            {(service.ShortDescription || service.Description) && (
                                                <div
                                                    className="text-hi-graphite mb-4 line-clamp-3 prose prose-sm max-w-none"
                                                    dangerouslySetInnerHTML={{
                                                        __html: typeof (service.ShortDescription || service.Description) === 'string'
                                                            ? (service.ShortDescription || (service.Description?.substring(0, 150) + '...'))
                                                            : ''
                                                    }}
                                                />
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
            </div>
        );
    } catch (error) {
        console.error('Error loading services:', error);
        return (
            <div className="min-h-screen bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-hi-graphite mb-4">
                            Ошибка загрузки
                        </h1>
                        <p className="text-hi-graphite mb-8">
                            Не удалось загрузить услуги. Попробуйте обновить страницу.
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

