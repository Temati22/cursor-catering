'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CartIcon } from './ui/CartIcon';
import { FavoritesIcon } from './ui/FavoritesIcon';
import { useContactsData } from '@/hooks/useContactsData';
import { useGlobalData } from '@/hooks/useGlobalData';
import { StrapiImage } from './ui/StrapiImage';

// Константы для навигации
const NAVIGATION_ITEMS = [
    { href: '/about', label: 'О нас' },
    { href: '/menus', label: 'Меню и услуги' },
    { href: '/gallery', label: 'Галерея' },
    { href: '/contacts', label: 'Контакты' }
];

const EVENT_ITEMS = [
    { href: '/events', label: 'Все праздники', isMain: true },
    { href: '/events/new-year', label: 'Новый год' },
    { href: '/events/womens-day', label: '8 Марта' },
    { href: '/events/february-23', label: '23 Февраля' },
    { href: '/events/company-day', label: 'День компании' },
    { href: '/events/birthday', label: 'День рождения' },
    { href: '/events/professional-day', label: 'Профессиональный праздник' },
    { href: '/events/wedding', label: 'Свадьба' },
    { href: '/events/anniversary', label: 'Юбилей' },
    { href: '/events/christening', label: 'Крестины / Крещение' },
    { href: '/events/bachelorette', label: 'Девичник' },
    { href: '/events/picnic', label: 'Пикники и барбекю' },
    { href: '/events/graduation', label: 'Выпускной' },
    { href: '/events/knowledge-day', label: 'День знаний' },
    { href: '/events/holiday', label: 'День святых' },
    { href: '/events/easter', label: 'Пасха' },
    { href: '/events/presentation', label: 'Презентация' },
    { href: '/events/conference', label: 'Конференция' },
    { href: '/events/photoshoot', label: 'Фотосессия' },
    { href: '/events/business-breakfast', label: 'Бизнес-завтрак' }
];

const CONTACT_LINKS = [
    { href: 'tel:', label: 'Позвонить', icon: 'phone' },
    { href: 'https://t.me/hi_catering', label: 'Telegram', icon: 'telegram', external: true },
    { href: 'https://wa.me/79999999999', label: 'WhatsApp', icon: 'whatsapp', external: true },
    { href: 'mailto:info@hi-catering.ru', label: 'Email', icon: 'email' }
];

// Компонент иконки
const Icon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => {
    const icons = {
        phone: (
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        ),
        telegram: (
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        ),
        whatsapp: (
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        ),
        email: (
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        ),
        menu: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        ),
        close: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ),
        chevron: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        )
    };

    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            {icons[name as keyof typeof icons]}
        </svg>
    );
};

// Компонент логотипа
const Logo = ({ logo, siteName, loading }: { logo: any; siteName: string; loading: boolean }) => (
    <Link href="/" className="flex items-center">
        {!loading && logo?.url ? (
            <StrapiImage
                src={logo.url.startsWith('http') ? logo.url : `http://localhost:1337${logo.url}`}
                alt={logo.alternativeText || siteName || 'Logo'}
                width={logo.width}
                height={logo.height}
                className="h-12 w-auto object-contain"
                priority
            />
        ) : (
            // Используем локальный логотип как fallback
            <img
                src="/Logo-white.png"
                alt={siteName || 'Hi-Catering Logo'}
                className="h-12 w-auto object-contain"
            />
        )}
    </Link>
);

// Компонент навигационного элемента
const NavItem = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link
        href={href}
        className={`text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200 ${className}`}
    >
        {children}
    </Link>
);

// Компонент выпадающего меню событий
const EventsDropdown = () => (
    <div className="group relative">
        <button className="text-white hover:text-gray-300 text-sm font-medium transition-colors duration-200 flex items-center px-3 py-2">
            Праздники
            <Icon name="chevron" className="ml-1 h-4 w-4" />
        </button>
        <div className="absolute left-0 mt-1 w-56 bg-hi-white rounded-lg shadow-lg border border-hi-silver py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 max-h-[400px] overflow-y-auto">
            {EVENT_ITEMS.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-2 text-sm transition-colors duration-200 ${item.isMain
                        ? 'font-semibold text-hi-platinum hover:bg-hi-silver border-b border-hi-silver mb-1'
                        : 'text-hi-graphite hover:bg-hi-silver hover:text-hi-platinum'
                        }`}
                >
                    {item.label}
                </Link>
            ))}
        </div>
    </div>
);

// Компонент контактных ссылок
const ContactLinks = ({ primaryPhone }: { primaryPhone: string }) => (
    <div className="flex items-center space-x-3 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
        {CONTACT_LINKS.map((contact) => (
            <a
                key={contact.href}
                href={contact.href === 'tel:' ? `tel:${primaryPhone}` : contact.href}
                className="text-white hover:text-gray-300 transition-colors duration-200"
                title={contact.label}
                {...(contact.external && { target: "_blank", rel: "noopener noreferrer" })}
            >
                <Icon name={contact.icon} />
            </a>
        ))}
    </div>
);

// Компонент мобильного меню
const MobileMenu = ({
    isOpen,
    onClose,
    eventsOpen,
    onEventsToggle
}: {
    isOpen: boolean;
    onClose: () => void;
    eventsOpen: boolean;
    onEventsToggle: () => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="md:hidden border-t border-gray-600" style={{ backgroundColor: '#1E1F26' }}>
            <div className="px-4 pt-2 pb-3 space-y-1">
                {NAVIGATION_ITEMS.map((item) => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        className="block px-3 py-2 text-base font-medium hover:bg-gray-700 rounded-md"
                    >
                        {item.label}
                    </NavItem>
                ))}

                <NavItem
                    href="/favorites"
                    className="block px-3 py-2 text-base font-medium hover:bg-gray-700 rounded-md"
                >
                    Избранное
                </NavItem>

                <div>
                    <button
                        onClick={onEventsToggle}
                        className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-white hover:text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                    >
                        Праздники
                        <Icon
                            name="chevron"
                            className={`h-4 w-4 transition-transform ${eventsOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {eventsOpen && (
                        <div className="pl-4 mt-1 space-y-1">
                            {EVENT_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`block px-3 py-2 text-sm transition-colors rounded-md ${item.isMain
                                        ? 'font-semibold text-gray-300 hover:bg-gray-700 border-b border-gray-600 mb-1'
                                        : 'font-medium text-white hover:text-gray-300 hover:bg-gray-700'
                                        }`}
                                    onClick={onClose}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Header() {
    const { title: siteName, primaryPhone } = useContactsData();
    const { logo, loading } = useGlobalData();
    console.log('Header - logo:', logo);
    console.log('Header - loading:', loading);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [eventsMobileOpen, setEventsMobileOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const toggleEventsMobile = () => setEventsMobileOpen(!eventsMobileOpen);
    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <header className="shadow-hi shadow-to-block  sticky top-0 z-50" style={{ backgroundColor: '#1E1F26' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Логотип */}
                    <Logo logo={logo} siteName={siteName} loading={loading} />

                    {/* Десктопная навигация */}
                    <nav className="hidden md:flex space-x-8">
                        {NAVIGATION_ITEMS.slice(0, 3).map((item) => (
                            <NavItem key={item.href} href={item.href}>
                                {item.label}
                            </NavItem>
                        ))}
                        <EventsDropdown />
                        <NavItem href="/contacts">Контакты</NavItem>
                    </nav>

                    {/* Контакты, избранное и корзина */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <ContactLinks primaryPhone={primaryPhone} />
                        <div className="bg-hi-white/10 hover:bg-hi-white/20 rounded-lg p-2 transition-colors duration-200">
                            <FavoritesIcon />
                        </div>
                        <div className="bg-hi-yellow hover:bg-hi-yellow/90 rounded-lg p-2 transition-colors duration-200">
                            <CartIcon />
                        </div>
                    </div>

                    {/* Мобильная кнопка меню */}
                    <button
                        type="button"
                        className="md:hidden text-white hover:text-gray-300 p-1"
                        aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                        onClick={toggleMobileMenu}
                    >
                        <Icon
                            name={mobileMenuOpen ? 'close' : 'menu'}
                            className="h-6 w-6 text-hi-yellow"
                        />
                    </button>
                </div>

                {/* Мобильное меню */}
                <MobileMenu
                    isOpen={mobileMenuOpen}
                    onClose={closeMobileMenu}
                    eventsOpen={eventsMobileOpen}
                    onEventsToggle={toggleEventsMobile}
                />
            </div>
        </header>
    );
}