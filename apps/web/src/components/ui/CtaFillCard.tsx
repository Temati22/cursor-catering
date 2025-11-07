'use client';

import React from 'react';
import { Button } from './Button';
import { ArrowRight } from 'lucide-react';

interface CtaFillCardProps {
    title: string;
    description: string;
    buttonText?: string;
    onButtonClick?: () => void;
    className?: string;
    /**
     * Максимальное количество колонок, которые может занять компонент
     * По умолчанию: 4 (1 на мобильных, до 4 на больших экранах)
     */
    maxColumns?: 1 | 2 | 3 | 4;
    /**
     * Вариант дизайна карточки
     */
    variant?: 'default' | 'gradient' | 'luxury';
}

export function CtaFillCard({
    title,
    description,
    buttonText = 'Оставить заявку',
    onButtonClick,
    className = '',
    maxColumns = 4,
    variant = 'gradient'
}: CtaFillCardProps) {
    // Определяем классы для col-span в зависимости от maxColumns
    const getColSpanClasses = () => {
        const colSpanMap = {
            1: 'col-span-1',
            2: 'col-span-1 sm:col-span-2',
            3: 'col-span-1 sm:col-span-2 md:col-span-3',
            4: 'col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-4'
        };
        return colSpanMap[maxColumns];
    };

    // Определяем варианты фона
    const getVariantClasses = () => {
        switch (variant) {
            case 'gradient':
                return 'bg-hi-platinum text-white';
            case 'luxury':
                return 'bg-hi-graphite text-white';
            default:
                return 'bg-hi-platinum text-white';
        }
    };

    return (
        <div
            className={`
                ${getColSpanClasses()}
                flex flex-col
                bg-white rounded-2xl shadow-hi hover:shadow-hi-hover
                transition-all duration-300 overflow-hidden
                group cursor-pointer h-full
                ${className}
            `}
        >
            {/* Content Section with gradient background */}
            <div className={`
                flex flex-col flex-1 justify-between
                p-6 md:p-8
                ${getVariantClasses()}
                relative overflow-hidden
            `}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col flex-1 justify-between">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold leading-tight mb-3 group-hover:scale-105 transition-transform duration-300">
                            {title}
                        </h3>
                        <p className="text-sm md:text-base leading-relaxed opacity-90 line-clamp-3">
                            {description}
                        </p>
                    </div>

                    {/* Button */}
                    <div className="mt-auto">
                        <Button
                            onClick={onButtonClick}
                            variant="outline"
                            size="md"
                            fullWidth
                            className="
                                !bg-white !text-black
                                hover:!bg-hi-ash hover:!text-black
                                shadow-lg hover:shadow-xl
                                transition-all duration-300
                                group/btn
                                border-0
                            "
                        >
                            <span className="flex items-center justify-center gap-2">
                                {buttonText}
                                <ArrowRight
                                    size={18}
                                    className="group-hover/btn:translate-x-1 transition-transform duration-300"
                                />
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
