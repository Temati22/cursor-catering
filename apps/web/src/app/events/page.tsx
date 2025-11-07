'use client';

import Link from 'next/link';
import { useState } from 'react';
import { EventsListSection } from '@/components/sections/EventsListSection';
import { ServicesButtonsSection } from '@/components/sections/ServicesButtonsSection';
import { ServicesCardsSection } from '@/components/sections/ServicesCardsSection';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import { Popup, PopupType } from '@/components/ui/Popup';
import { UserCheck, ChefHat, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function EventsPage() {
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupType, setPopupType] = useState<PopupType>('order-catering');

    const handleOpenPopup = (type: PopupType) => {
        setPopupType(type);
        setPopupOpen(true);
    };
    // Подготавливаем хлебные крошки
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Главная', href: '/' },
        { label: 'События' }
    ];

    return (
        <div className="min-h-screen bg-hi-white">
            {/* JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": "Hi-Catering - Премиум кейтеринг",
                        "description": "Эксклюзивный кейтеринг премиум-класса для свадеб, корпоративов, юбилеев и дней рождения",
                        "provider": {
                            "@type": "Organization",
                            "name": "Hi-Catering",
                            "url": "https://hi-catering.ru",
                            "logo": "https://hi-catering.ru/Logo.png",
                            "sameAs": [
                                "https://instagram.com/hi_catering",
                                "https://vk.com/hi_catering"
                            ]
                        },
                        "areaServed": {
                            "@type": "City",
                            "name": "Москва"
                        },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "RUB",
                            "price": "1500",
                            "description": "Кейтеринг от 1500 рублей на человека"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "bestRating": "5",
                            "ratingCount": "500"
                        }
                    })
                }}
            />

            {/* Breadcrumb */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* Hero Section with Enhanced Marketing Focus */}
            <section className="relative py-16 lg:py-24 overflow-hidden" style={{
                background: '#e7ebed url(/bg-4.jpg) no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'right',
                backgroundRepeat: 'no-repeat',
                backgroundPositionX: '24rem'
            }}>
                {/* Background decorative elements */}

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-left mb-12">
                        {/* Emotional hook */}
                        <div className="inline-flex items-center bg-hi-graphite/90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-6 border border-hi-graphite/30">
                            <span className="w-2 h-2 bg-hi-green rounded-full mr-3 animate-pulse"></span>
                            Доверяют уже более 500+ клиентов
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-hi-graphite mb-6 leading-tight">
                            Любое событие с выездом в
                            <span className="block text-transparent bg-clip-text bg-background-[#BFA76F]">
                                Санкт-Петербурге
                            </span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-hi-graphite/90 max-w-4xl leading-relaxed mb-8">
                            <strong>Эксклюзивный кейтеринг премиум-класса</strong> для ваших особых событий.
                            Каждое блюдо — это произведение искусства, каждое мероприятие — это история.
                        </p>

                        {/* Social proof stats */}
                        <div className="flex flex-wrap justify-start gap-8 mb-10 text-hi-graphite">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#BFA76F]">500+</div>
                                <div className="text-sm">Событий</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#BFA76F]">9+</div>
                                <div className="text-sm">Лет опыта</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#BFA76F]">99%</div>
                                <div className="text-sm">Довольных клиентов</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#BFA76F]">24/7</div>
                                <div className="text-sm">Поддержка</div>
                            </div>
                        </div>

                        {/* Primary CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-start items-start mb-10">
                            <Button
                                className="bg-[#BFA76F] hover:bg-[#BFA76F]/90 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-hi-hover flex items-center space-x-3"
                                onClick={() => handleOpenPopup('calculate-event')}
                            >
                                <span>Получить бесплатную консультацию</span>
                            </Button>


                            <Button
                                className="bg-hi-dark hover:bg-[#BFA76F]/90 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-hi-hover flex items-center space-x-3"
                                onClick={() => handleOpenPopup('calculate-event')}
                            >
                                <span>Рассчитать стоимость</span>
                            </Button>


                        </div>

                    </div>
                </div>
            </section >

            {/* Services Buttons Section */}
            {/* <ServicesButtonsSection
                title="Наши услуги"
                description="Выберите подходящую услугу для организации вашего мероприятия"
                className="py-16"
            /> */}

            {/* Services Cards Section */}
            <ServicesCardsSection
                title="Все наши услуги"
                description="Ознакомьтесь с полным спектром наших услуг для организации мероприятий"
                showDescription={true}
                className="py-16"
                showCta={true}
                ctaTitle="Нужна консультация?"
                ctaDescription="Свяжитесь с нами для обсуждения деталей вашего мероприятия и получите персональное предложение"
                ctaButtonText="Оставить заявку"
                onCtaClick={() => handleOpenPopup('order-catering')}
            />





            {/* Social Proof Section */}
            <section className="py-16 bg-hi-ash/30 border-y border-hi-silver/20" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-hi-graphite mb-4">
                            Что говорят наши клиенты
                        </h2>
                        <p className="text-lg text-hi-platinum max-w-2xl mx-auto">
                            Мы гордимся доверием наших клиентов и их положительными отзывами
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {/* Review 1 */}
                        <div className="bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 p-8 border border-hi-silver/30">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-xl">★</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-hi-graphite mb-6 leading-relaxed italic">
                                "Наша свадьба прошла сказочно! Каждое блюдо было произведением искусства, а обслуживание — на высшем уровне. Благодарим Hi-Catering за незабываемый день!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-hi-platinum to-hi-green rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                    АМ
                                </div>
                                <div>
                                    <div className="font-semibold text-hi-graphite">Анна Маринова</div>
                                    <div className="text-hi-platinum text-sm">Свадьба, 150 гостей</div>
                                </div>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 p-8 border border-hi-silver/30">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-xl">★</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-hi-graphite mb-6 leading-relaxed italic">
                                "Организация корпоратива на 5+! Коллеги до сих пор вспоминают невероятно вкусную еду и профессионализм команды."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-hi-platinum to-hi-green rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                    ПВ
                                </div>
                                <div>
                                    <div className="font-semibold text-hi-graphite">Павел Волков</div>
                                    <div className="text-hi-platinum text-sm">Корпоратив, 80 человек</div>
                                </div>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 p-8 border border-hi-silver/30">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-xl">★</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-hi-graphite mb-6 leading-relaxed italic">
                                "День рождения мамы прошел великолепно! Вы смогли учесть все пожелания и предпочтения, создав истинно праздничную атмосферу."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-hi-platinum to-hi-green rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                    МИ
                                </div>
                                <div>
                                    <div className="font-semibold text-hi-graphite">Мария Иванова</div>
                                    <div className="text-hi-platinum text-sm">День рождения, 25 гостей</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Events List Section */}
            <EventsListSection
                showTitle={true}
                title="Окунитесь в мир наших событий"
                description="Каждое мероприятие — это история, каждая служба — это миссия. Позвольте нам сделать ваш день исключительным."
                className="p-8"
            />



            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-start mb-10" >
                <button
                    onClick={() => handleOpenPopup('calculate-event')}
                    className="bg-[#BFA76F] margin-auto hover:bg-[#BFA76F]/90 text-white px-8 py-4 rounded-xl font-medium text-lg text-[20px] transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-hi-hover flex items-center space-x-3"
                >
                    <span>Консультация по меню</span>
                </button>

                <button
                    onClick={() => handleOpenPopup('order-catering')}
                    className="bg-hi-dark margin-auto hover:bg-[#BFA76F]/90 text-white px-8 py-4 rounded-xl font-medium text-lg text-[20px] transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-hi-hover flex items-center space-x-3"
                >
                    <span>Скачать меню</span>
                </button>

            </div>






            {/* FAQ Section */}
            < section className="relative py-16 overflow-hidden" style={{
                background: "#f1f6fc url('/bg-5.png') no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "right",

            }
            }>
                {/* Overlay for better text readability */}
                < div className="absolute inset-0 bg-white/30 backdrop-blur-[0.5px]" ></div >

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-hi-graphite mb-4">
                            Часто задаваемые вопросы
                        </h2>
                        <p className="text-lg text-hi-platinum">
                            Отвечаем на самые распространённые вопросы о наших услугах
                        </p>
                    </div>

                    <div className="space-y-6">
                        <details className="bg-white/80 backdrop-blur-sm rounded-xl p-6 group hover:bg-white/90 transition-all  shadow-md hover:shadow-lg">
                            <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-hi-graphite group-hover:text-hi-platinum">
                                За сколько дней до мероприятия нужно сделать заказ?
                                <span className="text-hi-platinum group-hover:rotate-180 transition-transform duration-300">+</span>
                            </summary>
                            <div className="mt-4 pt-4 border-t border-hi-silver/30 text-hi-platinum leading-relaxed">
                                Мы рекомендуем обращаться к нам минимум за 2 недели до мероприятия. Однако мы можем рассмотреть и срочные заказы — свяжитесь с нами для уточнения возможностей.
                            </div>
                        </details>

                        <details className="bg-white/80 backdrop-blur-sm rounded-xl p-6 group hover:bg-white/90 transition-all  shadow-md hover:shadow-lg">
                            <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-hi-graphite group-hover:text-hi-platinum">
                                Как проходит расчёт стоимости?
                                <span className="text-hi-platinum group-hover:rotate-180 transition-transform duration-300">+</span>
                            </summary>
                            <div className="mt-4 pt-4 border-t border-hi-silver/30 text-hi-platinum leading-relaxed">
                                Стоимость зависит от количества гостей, выбранного меню, локации и дополнительных услуг. Обычно стоимость составляет от 1500 рублей на человека. Мы предоставляем бесплатные консультации и подробные сметы.
                            </div>
                        </details>

                        <details className="bg-white/80 backdrop-blur-sm rounded-xl p-6 group hover:bg-white/90 transition-all  shadow-md hover:shadow-lg">
                            <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-hi-graphite group-hover:text-hi-platinum">
                                Можно ли заказать индивидуальное меню?
                                <span className="text-hi-platinum group-hover:rotate-180 transition-transform duration-300">+</span>
                            </summary>
                            <div className="mt-4 pt-4 border-t border-hi-silver/30 text-hi-platinum leading-relaxed">
                                Конечно! Мы специализируемся на создании уникальных меню для каждого мероприятия. Наш шеф-повар с радостью создаст блюда по вашим пожеланиям и предпочтениям. Мы учитываем диетические ограничения и аллергии.
                            </div>
                        </details>

                        <details className="bg-white/80 backdrop-blur-sm rounded-xl p-6 group hover:bg-white/90 transition-all  shadow-md hover:shadow-lg">
                            <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-hi-graphite group-hover:text-hi-platinum">
                                Какие гарантии вы предоставляете?
                                <span className="text-hi-platinum group-hover:rotate-180 transition-transform duration-300">+</span>
                            </summary>
                            <div className="mt-4 pt-4 border-t border-hi-silver/30 text-hi-platinum leading-relaxed">
                                Мы гарантируем качество всех блюд, пунктуальность доставки и профессиональное обслуживание. При любых проблемах с качеством мы возмещаем ущерб или переделываем заказ бесплатно.
                            </div>
                        </details>

                        <details className="bg-white/80 backdrop-blur-sm rounded-xl p-6 group hover:bg-white/90 transition-all  shadow-md hover:shadow-lg">
                            <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-hi-graphite group-hover:text-hi-platinum">
                                Работаете ли вы в выходные и праздничные дни?
                                <span className="text-hi-platinum group-hover:rotate-180 transition-transform duration-300">+</span>
                            </summary>
                            <div className="mt-4 pt-4 border-t border-hi-silver/30 text-hi-platinum leading-relaxed">
                                Да, мы работаем 7 дней в неделю, включая праздничные дни. Мы понимаем, что самые важные события часто проходят именно в эти дни. За работу в праздники может взиматься небольшая доплата.
                            </div>
                        </details>
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-hi-platinum mb-6">
                            Не нашли ответ на свой вопрос? Обращайтесь к нам любым удобным способом!
                        </p>
                    </div>
                </div>
            </section >


            {/* Popup для обратной связи */}
            < Popup
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
                type={popupType}
            />
        </div >
    );
}