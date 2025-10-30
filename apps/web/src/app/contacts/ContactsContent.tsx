'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useContactsData } from '@/hooks/useContactsData';
import { YandexMap } from '@/components/ui/YandexMap';

export function ContactsContent() {
    const {
        contactsData,
        loading,
        error,
        primaryPhone,
        secondaryPhone,
        email,
        address,
        title,
        description,
        workingHours
    } = useContactsData();

    // Данные из Strapi админки (с fallback)
    const displayPhone = primaryPhone;
    const displayPhone2 = secondaryPhone;
    const displayEmail = email;
    const displayAddress = address;

    // Показываем загрузку, если данные еще не получены
    if (loading) {
        return (
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hi-luxe mx-auto"></div>
                        <p className="mt-4 text-hi-graphite">Загрузка контактной информации...</p>
                    </div>
                </div>
            </div>
        );
    }

    // В продакшн не логируем ошибки в консоль, UI остаётся чистым
    if (error) {
        // no-op: данные имеют безопасные fallback значения
    }

    return (
        <>
            {/* Контактная информация */}
            <section className="py-16 bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Левая колонка - Контакты */}
                        <div>
                            <div className="mb-8">
                                <h2 className="text-3xl md:text-4xl font-bold text-hi-graphite">
                                    Свяжитесь с нами
                                </h2>
                            </div>
                            <div className="space-y-6">
                                {/* Телефоны */}
                                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 border border-hi-silver/30 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-[#BFA76F] rounded-lg flex items-center justify-center shadow-hi">
                                            <Phone className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-hi-graphite mb-2 group-hover:text-hi-platinum transition-colors">
                                            Телефоны
                                        </h3>
                                        <p className="text-hi-platinum text-sm mb-3">
                                            Звоните нам для консультации и заказа
                                        </p>
                                        <div className="space-y-2">
                                            <div>
                                                <a
                                                    href={`tel:${displayPhone}`}
                                                    className="text-hi-graphite hover:text-hi-platinum font-medium transition-colors block"
                                                >
                                                    {displayPhone}
                                                </a>
                                                <span className="text-sm text-hi-graphite/60">Основной</span>
                                            </div>
                                            {displayPhone2 && displayPhone2 !== displayPhone && (
                                                <div>
                                                    <a
                                                        href={`tel:${displayPhone2}`}
                                                        className="text-hi-graphite hover:text-hi-platinum font-medium transition-colors block"
                                                    >
                                                        {displayPhone2}
                                                    </a>
                                                    <span className="text-sm text-hi-graphite/60">Дополнительный</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 border border-hi-silver/30 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-[#BFA76F] rounded-lg flex items-center justify-center shadow-hi">
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-hi-graphite mb-2 group-hover:text-hi-platinum transition-colors">
                                            Email
                                        </h3>
                                        <p className="text-hi-platinum text-sm mb-2">
                                            Напишите нам для получения предложения
                                        </p>
                                        <a
                                            href={`mailto:${displayEmail}`}
                                            className="text-hi-graphite hover:text-hi-platinum font-medium transition-colors"
                                        >
                                            {displayEmail}
                                        </a>
                                    </div>
                                </div>

                                {/* Адрес */}
                                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 border border-hi-silver/30 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-[#BFA76F] rounded-lg flex items-center justify-center shadow-hi">
                                            <MapPin className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-hi-graphite mb-2 group-hover:text-hi-platinum transition-colors">
                                            Адрес
                                        </h3>
                                        <p className="text-hi-platinum text-sm mb-2">
                                            Наш офис и кухня
                                        </p>
                                        <p className="text-hi-graphite font-medium">
                                            {displayAddress}
                                        </p>
                                    </div>
                                </div>

                                {/* Время работы */}
                                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 border border-hi-silver/30 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-[#BFA76F] rounded-lg flex items-center justify-center shadow-hi">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-hi-graphite mb-2 group-hover:text-hi-platinum transition-colors">
                                            Время работы
                                        </h3>
                                        <p className="text-hi-platinum text-sm mb-2">
                                            Мы работаем для вас
                                        </p>
                                        <div className="space-y-1 text-hi-graphite">
                                            {workingHours ? (
                                                <p>{workingHours}</p>
                                            ) : (
                                                <>
                                                    <p>Пн-Пт: 9:00 - 21:00</p>
                                                    <p>Сб-Вс: 10:00 - 20:00</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Правая колонка - Форма обратной связи */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-hi-graphite mb-8">
                                Оставьте заявку
                            </h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-hi-graphite mb-2">
                                            Имя *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="w-full px-4 py-3 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-luxe focus:border-transparent transition-colors"
                                            placeholder="Ваше имя"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-hi-graphite mb-2">
                                            Телефон *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            className="w-full px-4 py-3 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-luxe focus:border-transparent transition-colors"
                                            placeholder="+7 (999) 999-99-99"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-hi-graphite mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full px-4 py-3 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-luxe focus:border-transparent transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="event-date" className="block text-sm font-medium text-hi-graphite mb-2">
                                        Дата мероприятия
                                    </label>
                                    <input
                                        type="date"
                                        id="event-date"
                                        name="event-date"
                                        className="w-full px-4 py-3 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-luxe focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="guests" className="block text-sm font-medium text-hi-graphite mb-2">
                                        Количество гостей
                                    </label>
                                    <select
                                        id="guests"
                                        name="guests"
                                        className="w-full px-4 py-3 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-luxe focus:border-transparent transition-colors"
                                    >
                                        <option value="">Выберите количество</option>
                                        <option value="10-20">10-20 человек</option>
                                        <option value="20-50">20-50 человек</option>
                                        <option value="50-100">50-100 человек</option>
                                        <option value="100+">Более 100 человек</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-hi-graphite mb-2">
                                        Сообщение
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        className="w-full px-4 py-3 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-luxe focus:border-transparent transition-colors resize-none"
                                        placeholder="Расскажите о вашем мероприятии..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    aria-label="Отправить заявку"
                                    className="w-full bg-[#BFA76F] hover:bg-[#BFA76F]/90 text-white px-4 py-4 rounded-lg font-medium text-sm transition-all shadow-hi hover:shadow-hi-hover"
                                >
                                    Отправить заявку
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO-текст */}
            <section className="py-16 bg-hi-ash">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 border border-hi-silver/30 p-6 sm:p-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-hi-graphite mb-4">
                            Кейтеринг в Москве — контакты, заказ и условия
                        </h2>
                        <p className="text-hi-platinum text-sm mb-6">
                            Узнайте подробности, сроки и стоимость — мы быстро подготовим предложение под вашу задачу.
                        </p>
                        <div className="prose max-w-none prose-p:text-hi-graphite prose-strong:text-hi-graphite prose-a:text-hi-platinum">
                            {description ? (
                                <p>{description}</p>
                            ) : (
                                <>
                                    <p>
                                        Hi‑Catering — профессиональный выездной кейтеринг в Москве и области. Мы
                                        организуем корпоративные и частные мероприятия: от кофе‑брейков и фуршетов до
                                        банкетов и барбекю. Собственное производство, отработанные процессы и
                                        продуманная логистика позволяют нам обеспечивать стабильное качество и точность
                                        исполнения.
                                    </p>
                                    <p>
                                        На странице контактов вы можете заказать кейтеринг, получить консультацию по
                                        меню, рассчитаться по бюджету и уточнить условия доставки. Работаем с любыми
                                        форматами — свадьбы, корпоративы, презентации, дни рождения и городские
                                        мероприятия. Подберём меню под количество гостей и особенности площадки.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Карта */}
            <section className="py-16 bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-hi-graphite mb-8 text-center">
                        Как нас найти
                    </h2>
                    <div className="bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 border border-hi-silver/30 overflow-hidden">
                        <YandexMap className="h-[400px] sm:h-[480px] md:h-[560px]" />
                    </div>
                </div>
            </section>
        </>
    );
}
