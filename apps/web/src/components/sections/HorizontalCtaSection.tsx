'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, Calendar, Users, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useContactsData } from '@/hooks/useContactsData';

interface HorizontalCtaSectionProps {
    variant?: 'primary' | 'secondary' | 'luxury';
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    showContactForm?: boolean;
    showPhoneButton?: boolean;
    showEmailButton?: boolean;
    icon?: React.ReactNode;
    className?: string;
}

export function HorizontalCtaSection({
    variant = 'primary',
    title = 'Готовы заказать кейтеринг?',
    subtitle = 'Получите персональное предложение',
    description = 'Оставьте заявку и наш менеджер свяжется с вами в течение 15 минут для обсуждения деталей вашего мероприятия.',
    ctaText = 'Получить предложение',
    showContactForm = true,
    showPhoneButton = true,
    showEmailButton = true,
    icon,
    className = '',
}: HorizontalCtaSectionProps) {
    const { primaryPhone, email } = useContactsData();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        eventDate: '',
        guests: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Применяем маску для телефона
        if (name === 'phone') {
            const phoneValue = value.replace(/\D/g, ''); // Удаляем все нецифровые символы
            let formattedPhone = '';

            if (phoneValue.length > 0) {
                if (phoneValue.startsWith('7')) {
                    formattedPhone = '+7';
                } else if (phoneValue.startsWith('8')) {
                    formattedPhone = '+7';
                } else {
                    formattedPhone = '+7';
                }

                if (phoneValue.length > 1) {
                    const number = phoneValue.startsWith('7') || phoneValue.startsWith('8')
                        ? phoneValue.slice(1)
                        : phoneValue;

                    if (number.length > 0) {
                        formattedPhone += ` (${number.slice(0, 3)}`;
                    }
                    if (number.length > 3) {
                        formattedPhone += `) ${number.slice(3, 6)}`;
                    }
                    if (number.length > 6) {
                        formattedPhone += ` ${number.slice(6, 8)}`;
                    }
                    if (number.length > 8) {
                        formattedPhone += ` ${number.slice(8, 10)}`;
                    }
                }
            }

            setFormData(prev => ({ ...prev, [name]: formattedPhone }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                phone: '',
                eventDate: '',
                guests: '',
                message: '',
            });
        }, 3000);
    };

    const variants = {
        primary: {
            bg: 'bg-hi-luxe',
            text: 'text-hi-white',
            button: 'primary',
            accent: 'bg-hi-platinum',
        },
        secondary: {
            bg: 'bg-hi-ash',
            text: 'text-hi-white', // Изменен на белый для контраста с overlay
            button: 'secondary',
            accent: 'bg-hi-platinum',
        },
        luxury: {
            bg: 'bg-hi-deep',
            text: 'text-hi-white',
            button: 'primary',
            accent: 'bg-hi-platinum',
        },
    };

    const currentVariant = variants[variant];

    return (
        <section className={`relative py-10 sm:py-12 lg:py-16 ${currentVariant.bg} ${className}`}>
            {/* Background image with overlay */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(/bg-2.webp)'
                    }}
                />
                <div className="absolute inset-0 bg-hi-graphite/75" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                        {/* Left Column - Content */}
                        <motion.div
                            className="space-y-4 sm:space-y-6"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            {icon && (
                                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-hi-platinum text-hi-white mb-3 sm:mb-4">
                                    {icon}
                                </div>
                            )}

                            <div className="space-y-3 sm:space-y-4">
                                <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${currentVariant.text}`}>
                                    {title}
                                </h2>
                                <p className={`text-base sm:text-lg font-medium ${currentVariant.text} opacity-90`}>
                                    {subtitle}
                                </p>
                                <p className={`text-sm sm:text-base ${currentVariant.text} opacity-80`}>
                                    {description}
                                </p>
                            </div>

                            {/* Contact Info */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                {showPhoneButton && primaryPhone && (
                                    <a
                                        href={`tel:${primaryPhone}`}
                                        className={`inline-flex items-center justify-center rounded-lg border border-current px-4 py-2 text-sm font-medium transition-all hover:bg-hi-platinum hover:text-hi-white focus:outline-none focus:ring-2 focus:ring-hi-platinum ${currentVariant.text}`}
                                    >
                                        <Phone className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        {primaryPhone}
                                    </a>
                                )}
                                {showEmailButton && email && (
                                    <a
                                        href={`mailto:${email}`}
                                        className={`inline-flex items-center justify-center rounded-lg border border-current px-4 py-2 text-sm font-medium transition-all hover:bg-hi-platinum hover:text-hi-white focus:outline-none focus:ring-2 focus:ring-hi-platinum ${currentVariant.text}`}
                                    >
                                        <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        {email}
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        {/* Right Column - Form */}
                        {showContactForm && (
                            <motion.div
                                className="bg-hi-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-hi"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                {isSubmitted ? (
                                    <div className="text-center py-6 sm:py-8">
                                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-hi-green text-hi-white mb-3 sm:mb-4">
                                            <Calendar className="h-6 w-6 sm:h-8 sm:w-8" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-hi-graphite mb-2">
                                            Заявка отправлена!
                                        </h3>
                                        <p className="text-sm sm:text-base text-hi-graphite opacity-70">
                                            Мы свяжемся с вами в течение 15 минут
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-hi-graphite mb-1">
                                                    Имя *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-hi-platinum focus:border-transparent text-hi-graphite text-sm sm:text-base"
                                                    placeholder="Ваше имя"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-hi-graphite mb-1">
                                                    Телефон *
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    maxLength={18}
                                                    className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-hi-platinum focus:border-transparent text-hi-graphite text-sm sm:text-base"
                                                    placeholder="+7 (999) 999 99 99"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label htmlFor="eventDate" className="block text-xs sm:text-sm font-medium text-hi-graphite mb-1">
                                                    Дата мероприятия
                                                </label>
                                                <input
                                                    type="date"
                                                    id="eventDate"
                                                    name="eventDate"
                                                    value={formData.eventDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-hi-platinum focus:border-transparent text-hi-graphite text-sm sm:text-base"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="guests" className="block text-xs sm:text-sm font-medium text-hi-graphite mb-1">
                                                    Количество гостей
                                                </label>
                                                <select
                                                    id="guests"
                                                    name="guests"
                                                    value={formData.guests}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-hi-platinum focus:border-transparent text-hi-graphite text-sm sm:text-base"
                                                >
                                                    <option value="">Выберите количество</option>
                                                    <option value="10-20">10-20 человек</option>
                                                    <option value="20-50">20-50 человек</option>
                                                    <option value="50-100">50-100 человек</option>
                                                    <option value="100+">100+ человек</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-hi-graphite mb-1">
                                                Дополнительная информация
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-hi-platinum focus:border-transparent text-hi-graphite resize-none text-sm sm:text-base"
                                                placeholder="Расскажите о вашем мероприятии..."
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            fullWidth
                                            loading={isSubmitting}
                                            className="mt-4 sm:mt-6 bg-hi-platinum text-hi-white hover:bg-hi-platinum/90"
                                        >
                                            {ctaText}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>

                                        <p className="text-xs text-hi-graphite opacity-60 text-center">
                                            Нажимая кнопку, вы соглашаетесь с{' '}
                                            <a href="#" className="text-hi-platinum hover:underline">
                                                политикой конфиденциальности
                                            </a>
                                        </p>
                                    </form>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
