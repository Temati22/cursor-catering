'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useContactsData } from '@/hooks/useContactsData';

interface CompactCtaSectionProps {
    variant?: 'primary' | 'secondary' | 'accent' | 'gold';
    title?: string;
    subtitle?: string;
    ctaText?: string;
    showContactInfo?: boolean;
    showTimer?: boolean;
    className?: string;
    containerClassName?: string;
}

export function CompactCtaSection({
    variant = 'primary',
    title = 'Нужна консультация?',
    subtitle = 'Получите персональное предложение за 5 минут',
    ctaText = 'Получить предложение',
    showContactInfo = true,
    showTimer = true,
    className = 'w-full',
    containerClassName = '',
}: CompactCtaSectionProps) {
    const { primaryPhone, email } = useContactsData();
    const [isHovered, setIsHovered] = useState(false);

    const variants = {
        primary: {
            bg: 'bg-hi-platinum',
            text: 'text-hi-white',
            button: 'outline',
            buttonText: 'text-hi-white',
            hover: 'hover:bg-hi-white hover:text-hi-platinum',
        },
        secondary: {
            bg: 'bg-hi-ash',
            text: 'text-hi-white', // Изменен на белый для контраста с overlay
            button: 'primary',
            buttonText: 'text-hi-white',
            hover: 'hover:bg-hi-platinum hover:text-hi-white',
        },
        accent: {
            bg: 'bg-hi-deep',
            text: 'text-hi-white',
            button: 'outline',
            buttonText: 'text-hi-white',
            hover: 'hover:bg-hi-platinum hover:text-hi-white',
        },
        gold: {
            bg: 'bg-hi-platinum',
            text: 'text-hi-white',
            button: 'outline',
            buttonText: 'text-hi-white',
            hover: 'hover:bg-hi-white hover:text-hi-platinum',
        },
    };

    const currentVariant = variants[variant];

    return (
        <section className={` ${className}`}>
            <div className={`${containerClassName || 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
                <div className="grid grid-cols-12">
                    <motion.div
                        className={`col-span-12 md:col-span-10 md:col-start-2 lg:col-span-12 lg:col-start-1 relative w-full ${currentVariant.bg} rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 p-6 lg:p-8 overflow-hidden`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        {/* Background image with overlay */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: 'url(/bg-2.webp)'
                                }}
                            />
                            <div className="absolute inset-0 bg-hi-graphite/80" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                            {/* Left Content */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                                    {showTimer && (
                                        <div className="flex items-center gap-1 text-sm opacity-80">
                                            <Clock className="h-4 w-4" />
                                            <span>Быстрый ответ</span>
                                        </div>
                                    )}
                                </div>

                                <h3 className={`text-xl lg:text-2xl font-bold ${currentVariant.text} mb-2`}>
                                    {title}
                                </h3>
                                <p className={`text-base ${currentVariant.text} opacity-80`}>
                                    {subtitle}
                                </p>
                            </div>

                            {/* Right Actions */}
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Button
                                    variant={currentVariant.button as any}
                                    size="lg"
                                    className={`${currentVariant.hover} transition-all duration-300`}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    onClick={() => {
                                        // Добавляем обработчик клика для демонстрации
                                        // Здесь можно добавить логику для открытия формы или перенаправления
                                    }}
                                >
                                    {ctaText}
                                    <ArrowRight className={`ml-2 h-4 w-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                                </Button>

                                {showContactInfo && (
                                    <div className="flex items-center gap-4 text-sm">
                                        {primaryPhone && (
                                            <a
                                                href={`tel:${primaryPhone}`}
                                                className={`flex items-center gap-1 ${currentVariant.text} opacity-80 hover:opacity-100 transition-opacity`}
                                            >
                                                <Phone className="h-4 w-4" />
                                                <span className="hidden sm:inline">{primaryPhone}</span>
                                                <span className="sm:hidden">Позвонить</span>
                                            </a>
                                        )}
                                        {email && (
                                            <a
                                                href={`mailto:${email}`}
                                                className={`flex items-center gap-1 ${currentVariant.text} opacity-80 hover:opacity-100 transition-opacity`}
                                            >
                                                <Mail className="h-4 w-4" />
                                                <span className="hidden sm:inline">{email}</span>
                                                <span className="sm:hidden">Написать</span>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
