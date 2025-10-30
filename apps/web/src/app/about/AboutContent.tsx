'use client';

import { useEffect, useState } from 'react';
import { apiClient, About, AboutBlock } from '@/lib/api';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { HorizontalCtaSection } from '@/components/sections/HorizontalCtaSection';
import { SocialProofCtaSection } from '@/components/sections/SocialProofCtaSection';
import { Users, Heart } from 'lucide-react';

// Компонент для отображения блока rich-text
function RichTextBlock({ block }: { block: AboutBlock }) {
    if (block.__component !== 'shared.rich-text' || !block.richTextBody) return null;

    return (
        <div className="prose prose-sm sm:prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: block.richTextBody }} />
        </div>
    );
}

// Компонент для отображения блока цитаты
function QuoteBlock({ block }: { block: AboutBlock }) {
    if (block.__component !== 'shared.quote' || !block.quoteBody) return null;

    return (
        <blockquote className="border-l-4 border-hi-luxe pl-4 sm:pl-6 py-3 sm:py-4 bg-hi-silver/20 rounded-r-lg">
            {block.title && (
                <h3 className="text-lg sm:text-xl font-semibold text-hi-graphite mb-2">
                    {block.title}
                </h3>
            )}
            <p className="text-base sm:text-lg text-hi-graphite italic leading-relaxed">
                "{block.quoteBody}"
            </p>
        </blockquote>
    );
}

// Компонент для отображения медиа блока
function MediaBlock({ block }: { block: AboutBlock }) {
    if (block.__component !== 'shared.media' || !block.file) return null;

    const imageUrl = block.file.url.startsWith('http')
        ? block.file.url
        : `http://localhost:1337${block.file.url}`;

    return (
        <div className="flex justify-center my-6 sm:my-8">
            <div className="relative w-full max-w-4xl">
                <StrapiImage
                    src={imageUrl}
                    alt={block.file.alternativeText || 'Изображение'}
                    width={block.file.width}
                    height={block.file.height}
                    className="rounded-lg shadow-lg object-cover w-full"
                />
                {block.file.caption && (
                    <p className="text-center text-hi-graphite mt-2 text-xs sm:text-sm italic">
                        {block.file.caption}
                    </p>
                )}
            </div>
        </div>
    );
}

// Компонент для отображения слайдера
function SliderBlock({ block }: { block: AboutBlock }) {
    if (block.__component !== 'shared.slider' || !block.files || block.files.length === 0) return null;

    return (
        <div className="my-6 sm:my-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {block.files.map((file) => {
                    const imageUrl = file.url.startsWith('http')
                        ? file.url
                        : `http://localhost:1337${file.url}`;

                    return (
                        <div key={file.id} className="relative">
                            <StrapiImage
                                src={imageUrl}
                                alt={file.alternativeText || 'Изображение'}
                                width={file.width}
                                height={file.height}
                                className="rounded-lg shadow-md object-cover w-full h-40 sm:h-48"
                            />
                            {file.caption && (
                                <p className="text-center text-hi-graphite mt-2 text-xs sm:text-sm">
                                    {file.caption}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Основной компонент блока
function BlockRenderer({ block }: { block: AboutBlock }) {
    switch (block.__component) {
        case 'shared.rich-text':
            return <RichTextBlock block={block} />;
        case 'shared.quote':
            return <QuoteBlock block={block} />;
        case 'shared.media':
            return <MediaBlock block={block} />;
        case 'shared.slider':
            return <SliderBlock block={block} />;
        default:
            return null;
    }
}

export function AboutContent() {
    const [aboutData, setAboutData] = useState<About | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.getAbout();

                if (response.data) {
                    setAboutData(response.data);
                } else {
                    setError('Данные страницы О нас не найдены');
                }
            } catch (err: any) {
                console.error('Error fetching about data:', err);
                setError('Ошибка загрузки данных страницы О нас');
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-hi-luxe"></div>
                    <span className="ml-3 text-sm sm:text-base text-hi-graphite">Загрузка...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                        <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">Ошибка</h1>
                        <p className="text-sm sm:text-base text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!aboutData) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-hi-graphite mb-6 sm:mb-8">О нас</h1>
                    <div className="bg-hi-silver/20 rounded-lg p-6 sm:p-8">
                        <p className="text-base sm:text-lg text-hi-graphite">
                            Данные страницы О нас пока не заполнены в админке.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Основной контент */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Блоки контента */}
                    <div className="space-y-6 sm:space-y-8">
                        {aboutData.blocks && aboutData.blocks.length > 0 ? (
                            aboutData.blocks.map((block, index) => (
                                <div key={`block-${block.id || index}-${block.__component}`} className="mb-6 sm:mb-8">
                                    <BlockRenderer block={block} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 sm:py-12">
                                <div className="bg-hi-silver/20 rounded-lg p-6 sm:p-8">
                                    <p className="text-base sm:text-lg text-hi-graphite">
                                        Контент страницы О нас пока не добавлен в админке.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Дополнительная информация */}
                    <div className="mt-12 sm:mt-16 bg-hi-silver/10 rounded-lg p-6 sm:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-hi-graphite mb-4 sm:mb-6 text-center">
                            Почему выбирают нас?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-hi-luxe rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-hi-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-hi-graphite mb-2">Качество</h3>
                                <p className="text-sm sm:text-base text-hi-graphite">Используем только свежие и качественные ингредиенты</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-hi-luxe rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-hi-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-hi-graphite mb-2">Пунктуальность</h3>
                                <p className="text-sm sm:text-base text-hi-graphite">Всегда доставляем вовремя и в срок</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-hi-luxe rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-hi-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-hi-graphite mb-2">Забота</h3>
                                <p className="text-sm sm:text-base text-hi-graphite">Индивидуальный подход к каждому клиенту</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA секции */}
            <section className="py-16 bg-hi-silver/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Горизонтальный CTA блок */}
                    <HorizontalCtaSection
                        variant="primary"
                        title="Готовы работать с нами?"
                        subtitle="Станьте частью нашей истории"
                        description="Присоединяйтесь к сотням довольных клиентов, которые уже доверили нам свои самые важные мероприятия."
                        ctaText="Стать клиентом"
                        icon={<Users className="h-6 w-6" />}
                    />

                    {/* CTA блок с социальными доказательствами */}
                    <SocialProofCtaSection
                        variant="testimonials"
                        title="Наши клиенты о нас"
                        subtitle="Более 500 довольных клиентов"
                        description="Узнайте, что говорят о нас наши клиенты и почему они выбирают именно нас"
                        ctaText="Заказать услугу"
                        showTestimonials={true}
                        showStats={true}
                        showFeatures={true}
                    />
                </div>
            </section>
        </>
    );
}
