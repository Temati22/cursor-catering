'use client';

import { motion } from 'framer-motion';
import {
    Layout,
    Palette,
    Image,
    Menu,
    Utensils,
    Star,
    ArrowRight,
    Code,
    Eye,
    Copy,
    Check,
    Phone,
    Mail
} from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/Header';
import { FirstMainBlock } from '@/components/sections/FirstMainBlock';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { DishesSection } from '@/components/sections/DishesSection';
import { MenusSection } from '@/components/sections/MenusSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Button } from '@/components/ui/Button';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { FormShowcase } from '@/components/ui/FormShowcase';

// Компонент для отображения кода
function CodeBlock({ children, language = 'tsx' }: { children: string; language?: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="relative bg-hi-deep rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-hi-graphite">
                <span className="text-sm text-hi-silver">{language}</span>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 text-sm text-hi-silver hover:text-hi-white transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Скопировано</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            <span>Копировать</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-hi-white">{children}</code>
            </pre>
        </div>
    );
}

// Компонент для демонстрации UI компонента
function ComponentDemo({
    title,
    description,
    children,
    code,
    category
}: {
    title: string;
    description: string;
    children: React.ReactNode;
    code: string;
    category: string;
}) {
    const [showCode, setShowCode] = useState(false);

    return (
        <motion.div
            className="bg-hi-white rounded-xl shadow-lg border border-hi-silver overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
        >
            <div className="p-4 sm:p-6 border-b border-hi-silver">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-hi-graphite">{title}</h3>
                    <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-hi-platinum to-hi-red text-white text-xs sm:text-sm rounded-full mt-2 sm:mt-0 self-start sm:self-auto">
                        {category}
                    </span>
                </div>
                <p className="text-sm sm:text-base text-hi-graphite mb-3 sm:mb-4">{description}</p>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowCode(!showCode)}
                        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-hi-ash hover:bg-hi-silver rounded-lg text-xs sm:text-sm transition-colors"
                    >
                        {showCode ? <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> : <Code className="w-3 h-3 sm:w-4 sm:h-4" />}
                        <span className="hidden sm:inline">{showCode ? 'Показать демо' : 'Показать код'}</span>
                        <span className="sm:hidden">{showCode ? 'Демо' : 'Код'}</span>
                    </button>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                {showCode ? (
                    <CodeBlock>{code}</CodeBlock>
                ) : (
                    <div className="border border-hi-silver rounded-lg overflow-hidden">
                        {children}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Компонент для демонстрации секций
function SectionDemo({
    title,
    description,
    children,
    code,
    category
}: {
    title: string;
    description: string;
    children: React.ReactNode;
    code: string;
    category: string;
}) {
    const [showCode, setShowCode] = useState(false);

    return (
        <motion.div
            className="bg-hi-white rounded-xl shadow-lg border border-hi-silver overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
        >
            <div className="p-4 sm:p-6 border-b border-hi-silver">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-hi-graphite">{title}</h3>
                    <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-hi-platinum to-hi-red text-white text-xs sm:text-sm rounded-full mt-2 sm:mt-0 self-start sm:self-auto">
                        {category}
                    </span>
                </div>
                <p className="text-sm sm:text-base text-hi-graphite mb-3 sm:mb-4">{description}</p>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowCode(!showCode)}
                        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-hi-ash hover:bg-hi-silver rounded-lg text-xs sm:text-sm transition-colors"
                    >
                        {showCode ? <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> : <Code className="w-3 h-3 sm:w-4 sm:h-4" />}
                        <span className="hidden sm:inline">{showCode ? 'Показать демо' : 'Показать код'}</span>
                        <span className="sm:hidden">{showCode ? 'Демо' : 'Код'}</span>
                    </button>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                {showCode ? (
                    <CodeBlock>{code}</CodeBlock>
                ) : (
                    <div className="border border-hi-silver rounded-lg overflow-hidden">
                        {children}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default function ComponentsShowcase() {
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'Все компоненты', icon: Layout },
        { id: 'sections', name: 'Секции', icon: Menu },
        { id: 'ui', name: 'UI компоненты', icon: Palette },
        { id: 'buttons', name: 'Кнопки', icon: Star },
        { id: 'forms', name: 'Формы', icon: Mail },
        { id: 'colors', name: 'Цветовая схема', icon: Palette },
        { id: 'images', name: 'Изображения', icon: Image },
    ];

    const sections = [
        {
            title: 'Hero Section',
            description: 'Главная секция с анимированным заголовком и кнопками действий',
            component: <FirstMainBlock />,
            code: `import { FirstMainBlock } from '@/components/sections/FirstMainBlock';

export function MyPage() {
    return (
        <div>
            <FirstMainBlock />
        </div>
    );
}`,
            category: 'sections'
        },
        {
            title: 'Features Section',
            description: 'Секция с преимуществами и особенностями сервиса',
            component: <FeaturesSection />,
            code: `import { FeaturesSection } from '@/components/sections/FeaturesSection';

export function MyPage() {
    return (
        <div>
            <FeaturesSection />
        </div>
    );
}`,
            category: 'sections'
        },
        {
            title: 'Dishes Section',
            description: 'Секция отображения блюд с изображениями и описаниями',
            component: (
                <div className="p-3 sm:p-4">
                    <div className="text-center mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-hi-graphite mb-2">Наши блюда</h2>
                        <p className="text-xs sm:text-sm text-hi-graphite max-w-md mx-auto">
                            Откройте для себя наше разнообразное меню
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {/* Демо карточки блюд */}
                        <div className="bg-hi-white rounded-lg shadow-sm border border-hi-silver overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-hi-ash to-hi-silver flex items-center justify-center">
                                <Utensils className="w-8 h-8 text-hi-platinum" />
                            </div>
                            <div className="p-3">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-semibold text-hi-graphite line-clamp-1">Стейк из говядины</h3>
                                    <span className="text-xs font-bold text-hi-green ml-2">1200 ₽</span>
                                </div>
                                <p className="text-xs text-hi-graphite line-clamp-2 mb-2">
                                    Нежный стейк с овощами гриль
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    <span className="px-1.5 py-0.5 bg-hi-red text-hi-white text-xs rounded">Острое</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-hi-white rounded-lg shadow-sm border border-hi-silver overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-hi-ash to-hi-silver flex items-center justify-center">
                                <Utensils className="w-8 h-8 text-hi-green" />
                            </div>
                            <div className="p-3">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-semibold text-hi-graphite line-clamp-1">Салат Цезарь</h3>
                                    <span className="text-xs font-bold text-hi-green ml-2">450 ₽</span>
                                </div>
                                <p className="text-xs text-hi-graphite line-clamp-2 mb-2">
                                    Классический салат с курицей
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    <span className="px-1.5 py-0.5 bg-hi-green text-hi-white text-xs rounded">Вегетарианское</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-hi-white rounded-lg shadow-sm border border-hi-silver overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-hi-ash to-hi-silver flex items-center justify-center">
                                <Utensils className="w-8 h-8 text-purple-500" />
                            </div>
                            <div className="p-3">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-semibold text-hi-graphite line-clamp-1">Паста Карбонара</h3>
                                    <span className="text-xs font-bold text-hi-green ml-2">680 ₽</span>
                                </div>
                                <p className="text-xs text-hi-graphite line-clamp-2 mb-2">
                                    Итальянская паста с беконом
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    <span className="px-1.5 py-0.5 bg-hi-platinum text-hi-white text-xs rounded">Без глютена</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            code: `import { DishesSection } from '@/components/sections/DishesSection';

export function MyPage() {
    return (
        <div>
            <DishesSection 
                limit={6}
                showPrice={true}
                showDescription={true}
            />
        </div>
    );
}`,
            category: 'sections'
        },
        {
            title: 'Menus Section',
            description: 'Секция отображения меню с категориями и ценами',
            component: (
                <div className="p-3 sm:p-4">
                    <div className="text-center mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-hi-graphite mb-2">Наши меню</h2>
                        <p className="text-xs sm:text-sm text-hi-graphite max-w-md mx-auto">
                            Выберите идеальное меню для любого случая
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {/* Демо карточки меню */}
                        <div className="bg-hi-ash rounded-lg shadow-sm border border-hi-silver overflow-hidden">
                            <div className="h-40 bg-gradient-to-br from-hi-ash to-hi-silver flex items-center justify-center">
                                <Menu className="w-10 h-10 text-hi-platinum" />
                            </div>
                            <div className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-sm font-semibold text-hi-graphite line-clamp-1">Бизнес-ланч</h3>
                                    <span className="text-xs font-bold text-hi-green ml-2">800 ₽/чел</span>
                                </div>
                                <p className="text-xs text-hi-graphite line-clamp-2 mb-2">
                                    Полноценный обед для деловых встреч
                                </p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    <span className="px-2 py-1 bg-hi-platinum text-hi-white text-xs rounded-full">Обед</span>
                                    <span className="px-2 py-1 bg-hi-platinum text-hi-white text-xs rounded-full">Корпоратив</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="px-2 py-1 bg-hi-green text-hi-white text-xs rounded-full">Активно</span>
                                    <span className="text-xs text-hi-graphite">До 50 чел</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-hi-ash rounded-lg shadow-sm border border-hi-silver overflow-hidden">
                            <div className="h-40 bg-gradient-to-br from-hi-ash to-hi-silver flex items-center justify-center">
                                <Menu className="w-10 h-10 text-hi-green" />
                            </div>
                            <div className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-sm font-semibold text-hi-graphite line-clamp-1">Свадебное меню</h3>
                                    <span className="text-xs font-bold text-hi-green ml-2">2500 ₽/чел</span>
                                </div>
                                <p className="text-xs text-hi-graphite line-clamp-2 mb-2">
                                    Роскошное меню для особого дня
                                </p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    <span className="px-2 py-1 bg-hi-platinum text-hi-white text-xs rounded-full">Ужин</span>
                                    <span className="px-2 py-1 bg-hi-platinum text-hi-white text-xs rounded-full">Свадьба</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="px-2 py-1 bg-hi-green text-hi-white text-xs rounded-full">Активно</span>
                                    <span className="text-xs text-hi-graphite">До 200 чел</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            code: `import { MenusSection } from '@/components/sections/MenusSection';

export function MyPage() {
    return (
        <div>
            <MenusSection 
                limit={4}
                showPrice={true}
                showDescription={true}
            />
        </div>
    );
}`,
            category: 'sections'
        },
        {
            title: 'CTA Section',
            description: 'Секция призыва к действию с контактной информацией',
            component: (
                <div className="relative py-6 sm:py-8 bg-gradient-to-r from-hi-platinum to-hi-red text-white rounded-lg overflow-hidden">
                    <div className="relative z-10 px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto">
                            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                                Готовы начать проект?
                            </h2>
                            <p className="text-xs sm:text-sm mb-3 sm:mb-4 opacity-90">
                                Свяжитесь с нами для обсуждения вашего проекта.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-2 justify-center mb-3 sm:mb-4">
                                <button className="inline-flex items-center justify-center rounded-lg border border-white bg-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-white transition-all hover:bg-hi-white hover:text-hi-platinum">
                                    Начать проект
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </button>

                                <button className="inline-flex items-center justify-center rounded-lg border border-white bg-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-white transition-all hover:bg-hi-white hover:text-hi-platinum">
                                    <Phone className="mr-1 h-3 w-3" />
                                    Позвонить
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs opacity-75">
                                <div className="flex items-center space-x-1">
                                    <Mail className="h-3 w-3" />
                                    <span>info@example.com</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Phone className="h-3 w-3" />
                                    <span>+7 (999) 123-45-67</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            code: `import { CtaSection } from '@/components/sections/CtaSection';

export function MyPage() {
    return (
        <div>
            <CtaSection />
        </div>
    );
}`,
            category: 'sections'
        }
    ];

    const uiComponents = [
        {
            title: 'Header',
            description: 'Шапка сайта с логотипом, навигацией и контактной информацией',
            component: <Header />,
            code: `import Header from '@/components/Header';

export function MyPage() {
    return (
        <div>
            <Header />
        </div>
    );
}`,
            category: 'ui'
        },
        {
            title: 'StrapiImage',
            description: 'Компонент для отображения изображений из Strapi с fallback',
            component: (
                <div className="p-4">
                    <div className="relative h-48 w-full">
                        <StrapiImage
                            src="https://via.placeholder.com/400x200"
                            alt="Пример изображения"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                </div>
            ),
            code: `import { StrapiImage } from '@/components/ui/StrapiImage';

export function MyComponent() {
    return (
        <StrapiImage
            src="https://example.com/image.jpg"
            alt="Описание изображения"
            width={400}
            height={200}
            className="object-cover rounded-lg"
        />
    );
}`,
            category: 'ui'
        },
        {
            title: 'ImagePlaceholder',
            description: 'Заглушка для изображений с иконкой и текстом',
            component: (
                <div className="p-4">
                    <ImagePlaceholder
                        className="h-48"
                        text="Пример заглушки"
                    />
                </div>
            ),
            code: `import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

export function MyComponent() {
    return (
        <ImagePlaceholder 
            className="h-48" 
            text="Нет изображения" 
        />
    );
}`,
            category: 'ui'
        }
    ];

    const buttonComponents = [
        {
            title: 'Button Variants',
            description: 'Различные варианты кнопок с фирменным стилем Hi-Catering',
            component: (
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-base sm:text-lg font-semibold text-hi-graphite">Основные варианты</h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-base sm:text-lg font-semibold text-hi-graphite">Размеры</h4>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-base sm:text-lg font-semibold text-hi-graphite">Состояния</h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <Button>Обычная</Button>
                            <Button loading>Загрузка</Button>
                            <Button disabled>Отключена</Button>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-base sm:text-lg font-semibold text-hi-graphite">С иконками</h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <Button>
                                <ArrowRight className="mr-2 h-4 w-4" />
                                С иконкой
                            </Button>
                            <Button variant="outline">
                                <Star className="mr-2 h-4 w-4" />
                                Избранное
                            </Button>
                            <Button variant="secondary">
                                <Code className="mr-2 h-4 w-4" />
                                Код
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-base sm:text-lg font-semibold text-hi-graphite">Полная ширина</h4>
                        <Button fullWidth>Кнопка на всю ширину</Button>
                    </div>
                </div>
            ),
            code: `import { Button } from '@/components/ui/Button';
import { ArrowRight, Star, Code } from 'lucide-react';

export function ButtonExamples() {
    return (
        <div className="space-y-6">
            {/* Основные варианты */}
            <div className="flex gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
            </div>
            
            {/* Размеры */}
            <div className="flex gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
            </div>
            
            {/* Состояния */}
            <div className="flex gap-3">
                <Button>Обычная</Button>
                <Button loading>Загрузка</Button>
                <Button disabled>Отключена</Button>
            </div>
            
            {/* С иконками */}
            <div className="flex gap-3">
                <Button>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    С иконкой
                </Button>
                <Button variant="outline">
                    <Star className="mr-2 h-4 w-4" />
                    Избранное
                </Button>
            </div>
            
            {/* Полная ширина */}
            <Button fullWidth>Кнопка на всю ширину</Button>
        </div>
    );
}`,
            category: 'buttons'
        },
        {
            title: 'Button States',
            description: 'Все возможные состояния кнопок с анимациями и интерактивностью',
            component: (
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-base sm:text-lg font-semibold text-hi-graphite">Интерактивные состояния</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-2">
                                <h5 className="text-xs sm:text-sm font-medium text-hi-graphite">Hover эффекты</h5>
                                <Button className="hover:scale-105 transition-transform">
                                    Hover me
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <h5 className="text-xs sm:text-sm font-medium text-hi-graphite">Focus состояния</h5>
                                <Button className="focus:ring-4 focus:ring-hi-platinum">
                                    Focus me
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-base sm:text-lg font-semibold text-hi-graphite">Анимированные кнопки</h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <Button className="animate-pulse">
                                Пульсирующая
                            </Button>
                            <Button className="hover:animate-bounce">
                                Подпрыгивающая
                            </Button>
                            <Button className="hover:rotate-3 transition-transform">
                                Поворачивающаяся
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-base sm:text-lg font-semibold text-hi-graphite">Градиентные кнопки</h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <Button className="bg-gradient-to-r from-hi-platinum to-hi-red hover:from-hi-platinum hover:to-hi-red">
                                Синий-Фиолетовый
                            </Button>
                            <Button className="bg-gradient-to-r from-hi-green to-hi-platinum hover:from-hi-green hover:to-hi-platinum">
                                Зеленый-Бирюзовый
                            </Button>
                            <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                                Розовый-Розовый
                            </Button>
                        </div>
                    </div>
                </div>
            ),
            code: `import { Button } from '@/components/ui/Button';

export function ButtonStates() {
    return (
        <div className="space-y-6">
            {/* Интерактивные состояния */}
            <div className="grid grid-cols-2 gap-4">
                <Button className="hover:scale-105 transition-transform">
                    Hover me
                </Button>
                <Button className="focus:ring-4 focus:ring-hi-platinum">
                    Focus me
                </Button>
            </div>
            
            {/* Анимированные кнопки */}
            <div className="flex gap-3">
                <Button className="animate-pulse">Пульсирующая</Button>
                <Button className="hover:animate-bounce">Подпрыгивающая</Button>
                <Button className="hover:rotate-3 transition-transform">
                    Поворачивающаяся
                </Button>
            </div>
            
            {/* Градиентные кнопки */}
            <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-hi-platinum to-hi-red">
                    Синий-Фиолетовый
                </Button>
                <Button className="bg-gradient-to-r from-hi-green to-hi-platinum">
                    Зеленый-Бирюзовый
                </Button>
            </div>
        </div>
    );
}`,
            category: 'buttons'
        }
    ];

    const formComponents = [
        {
            title: 'FormShowcase',
            description: 'Полная форма с различными типами полей для кейтеринг-сервиса',
            component: <FormShowcase />,
            code: `import { FormShowcase } from '@/components/ui/FormShowcase';

export function MyPage() {
    return (
        <div>
            <FormShowcase />
        </div>
    );
}`,
            category: 'forms'
        }
    ];

    const colorComponents = [
        {
            title: 'Color Picker',
            description: 'Интерактивный инструмент для изменения цветовой схемы сайта в реальном времени',
            component: (
                <div className="w-full max-w-none">
                    <ColorPicker
                        onColorChange={(colors) => {
                            // Colors changed
                        }}
                        onGenerateInstructions={(instructions) => {
                            // Instructions generated
                        }}
                    />
                </div>
            ),
            code: `import { ColorPicker } from '@/components/ui/ColorPicker';

export function ColorCustomization() {
    const handleColorChange = (colors) => {
        // Здесь можно применить цвета к сайту
    };

    const handleGenerateInstructions = (instructions) => {
        // Здесь можно скопировать инструкции
    };

    return (
        <div>
            <ColorPicker 
                onColorChange={handleColorChange}
                onGenerateInstructions={handleGenerateInstructions}
            />
        </div>
    );
}`,
            category: 'colors'
        }
    ];

    const allComponents = [...sections, ...uiComponents, ...buttonComponents, ...formComponents, ...colorComponents];

    const filteredComponents = activeCategory === 'all'
        ? allComponents
        : allComponents.filter(comp => comp.category === activeCategory);

    return (
        <div className="min-h-screen bg-hi-ash w-full">
            {/* Hero Section */}
            <section className="relative py-12 sm:py-16 lg:py-20 bg-hi-soft">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-12 w-12 bg-hi-luxe rounded-xl flex items-center justify-center">
                                <Layout className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
                            Библиотека компонентов
                            <span className="block bg-gradient-to-r from-hi-platinum to-hi-red bg-clip-text text-transparent">
                                Hi-Catering
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl text-hi-graphite max-w-2xl mx-auto mb-6 sm:mb-8">
                            Полная коллекция компонентов с фирменным стилем для создания
                            современного кейтеринг-сайта
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <button className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-hi-platinum to-hi-red px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-white shadow-sm transition-all hover:from-hi-platinum hover:to-hi-red focus:outline-none focus:ring-2 focus:ring-hi-platinum focus:ring-offset-2">
                                Начать использовать
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-lg border border-hi-silver bg-hi-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-hi-graphite shadow-sm transition-all hover:bg-hi-ash focus:outline-none focus:ring-2 focus:ring-hi-platinum focus:ring-offset-2">
                                <Code className="mr-2 h-4 w-4" />
                                Посмотреть код
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Filter */}
            <section className="py-6 sm:py-8 bg-hi-white border-b border-hi-silver">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${activeCategory === category.id
                                        ? 'bg-gradient-to-r from-hi-platinum to-hi-red text-white shadow-md'
                                        : 'bg-hi-silver text-hi-graphite hover:bg-hi-silver'
                                        }`}
                                >
                                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">{category.name}</span>
                                    <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Components Grid */}
            <section className="py-8 sm:py-12 lg:py-16">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 sm:mb-12 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-hi-graphite mb-3 sm:mb-4">
                            {activeCategory === 'all'
                                ? 'Все компоненты'
                                : categories.find(c => c.id === activeCategory)?.name
                            }
                        </h2>
                        <p className="text-base sm:text-lg text-hi-graphite max-w-2xl mx-auto">
                            {activeCategory === 'all'
                                ? 'Полная коллекция компонентов для создания кейтеринг-сайта'
                                : `Компоненты категории "${categories.find(c => c.id === activeCategory)?.name}"`
                            }
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:gap-8">
                        {filteredComponents.map((component, index) => (
                            <div key={component.title}>
                                {component.category === 'sections' ? (
                                    <SectionDemo
                                        title={component.title}
                                        description={component.description}
                                        code={component.code}
                                        category={component.category}
                                    >
                                        {component.component}
                                    </SectionDemo>
                                ) : (
                                    <ComponentDemo
                                        title={component.title}
                                        description={component.description}
                                        code={component.code}
                                        category={component.category}
                                    >
                                        {component.component}
                                    </ComponentDemo>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 sm:py-16 bg-hi-white">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-2xl sm:text-3xl font-bold text-hi-platinum mb-1 sm:mb-2">
                                {allComponents.length}
                            </div>
                            <div className="text-sm text-hi-graphite">Компонентов</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-2xl sm:text-3xl font-bold text-hi-platinum mb-1 sm:mb-2">
                                {categories.length}
                            </div>
                            <div className="text-sm text-hi-graphite">Категорий</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-2xl sm:text-3xl font-bold text-hi-platinum mb-1 sm:mb-2">
                                100%
                            </div>
                            <div className="text-sm text-hi-graphite">Готовность</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <CtaSection />
        </div>
    );
}
