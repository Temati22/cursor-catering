'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CartIcon } from './ui/CartIcon';
import { FavoritesIcon } from './ui/FavoritesIcon';
import { useContactsData } from '@/hooks/useContactsData';
import { useGlobalData } from '@/hooks/useGlobalData';
import { StrapiImage } from './ui/StrapiImage';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { getImageUrl } from '@/lib/imageUtils';
import { apiClient, Service, EventPage } from '@/lib/api';

// Константы для навигации
const NAVIGATION_ITEMS = [
    { href: '/about', label: 'О нас' },
    { href: '/galery', label: 'Галерея' },
    { href: '/contacts', label: 'Контакты' }
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
        <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
            {icons[name as keyof typeof icons]}
        </svg>
    );
};

// Компонент логотипа
const Logo = ({ logo, siteName, loading }: { logo: any; siteName: string; loading: boolean }) => (
    <Link href="/" className="flex items-center">
        {!loading && logo?.url ? (
            <StrapiImage
                src={getImageUrl(logo.url)}
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
const NavItem = ({ href, children, className = "", onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) => (
    <Link
        href={href}
        className={`text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200 ${className}`}
        onClick={onClick}
    >
        {children}
    </Link>
);

// Компонент выпадающего меню "Меню и услуги"
const MenuServicesDropdown = ({ services }: { services: Service[] }) => {
    const menuServicesItems = [
        { href: '/services', label: 'Все услуги', isMain: true },
        ...services.map((service) => ({
            href: `/services/${service.slug}`,
            label: service.TitleInmenu || service.Title,
            isMain: false
        }))
    ];

    return (
        <div className="group relative">
            <button className="text-white hover:text-gray-300 text-sm font-medium transition-colors duration-200 flex items-center px-3 py-2">
                Меню и услуги
                <Icon name="chevron" className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-1 w-56 bg-hi-white rounded-lg shadow-lg border border-hi-silver py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 max-h-[400px] overflow-y-auto">
                {menuServicesItems.map((item) => (
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
};

// Компонент выпадающего меню событий
const EventsDropdown = ({ events }: { events: EventPage[] }) => {
    const eventItems = [
        { href: '/events', label: 'Все праздники', isMain: true },
        ...events.map((event) => ({
            href: `/events/${event.Slug}`,
            label: event.TitleInmenu || event.title,
            isMain: false
        }))
    ];

    return (
        <div className="group relative">
            <button className="text-white hover:text-gray-300 text-sm font-medium transition-colors duration-200 flex items-center px-3 py-2">
                События
                <Icon name="chevron" className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-1 w-56 bg-hi-white rounded-lg shadow-lg border border-hi-silver py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 max-h-[400px] overflow-y-auto">
                {eventItems.map((item) => (
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
};

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

// Компонент мобильного меню (оверлей)
const MobileMenu = ({
    isOpen,
    onClose,
    eventsOpen,
    onEventsToggle,
    menuServicesOpen,
    onMenuServicesToggle,
    services,
    events
}: {
    isOpen: boolean;
    onClose: () => void;
    eventsOpen: boolean;
    onEventsToggle: () => void;
    menuServicesOpen: boolean;
    onMenuServicesToggle: () => void;
    services: Service[];
    events: EventPage[];
}) => {
    if (!isOpen) return null;

    const menuServicesItems = [
        { href: '/services', label: 'Все услуги', isMain: true },
        ...services.map((service) => ({
            href: `/services/${service.slug}`,
            label: service.TitleInmenu || service.Title,
            isMain: false
        }))
    ];

    const eventItems = [
        { href: '/events', label: 'Все праздники', isMain: true },
        ...events.map((event) => ({
            href: `/events/${event.Slug}`,
            label: event.TitleInmenu || event.title,
            isMain: false
        }))
    ];

    return (
        <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <button
                aria-label="Закрыть меню"
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="absolute inset-y-0 right-0 w-full max-w-sm" style={{ backgroundColor: '#1E1F26' }}>
                <div className="h-full flex flex-col border-l border-gray-700">
                    {/* Header of panel */}
                    <div className="flex items-center justify-between px-4 h-14 border-b border-gray-700">
                        <span className="text-white font-medium">Меню</span>
                        <button
                            onClick={onClose}
                            aria-label="Закрыть меню"
                            className="text-white hover:text-gray-300 p-2"
                        >
                            <Icon name="close" className="h-6 w-6 text-hi-yellow" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-3 space-y-1 overflow-y-auto">
                        {NAVIGATION_ITEMS.map((item) => (
                            <NavItem
                                key={item.href}
                                href={item.href}
                                className="block px-3 py-2 text-base font-medium hover:bg-gray-700 rounded-lg"
                                onClick={onClose}
                            >
                                {item.label}
                            </NavItem>
                        ))}

                        <div className="pt-1">
                            <button
                                onClick={onMenuServicesToggle}
                                className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-white hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                                aria-expanded={menuServicesOpen}
                                aria-controls="mobile-menu-services"
                            >
                                Меню и услуги
                                <Icon
                                    name="chevron"
                                    className={`h-4 w-4 transition-transform ${menuServicesOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {menuServicesOpen && (
                                <div id="mobile-menu-services" className="pl-2 mt-1 space-y-1">
                                    {menuServicesItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`block px-3 py-2 text-sm transition-colors rounded-lg ${item.isMain
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

                        <NavItem
                            href="/favorites"
                            className="block px-3 py-2 text-base font-medium hover:bg-gray-700 rounded-lg"
                            onClick={onClose}
                        >
                            Избранное
                        </NavItem>

                        <div className="pt-1">
                            <button
                                onClick={onEventsToggle}
                                className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-white hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                                aria-expanded={eventsOpen}
                                aria-controls="mobile-events"
                            >
                                События
                                <Icon
                                    name="chevron"
                                    className={`h-4 w-4 transition-transform ${eventsOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {eventsOpen && (
                                <div id="mobile-events" className="pl-2 mt-1 space-y-1">
                                    {eventItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`block px-3 py-2 text-sm transition-colors rounded-lg ${item.isMain
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

                        {/* Quick contacts */}
                        <div className="pt-3">
                            <a
                                href="#contacts"
                                className="w-full inline-flex items-center justify-center bg-[#BFA76F] hover:bg-[#BFA76F]/90 text-white px-4 py-3 rounded-lg font-medium text-sm transition-all shadow-hi hover:shadow-hi-hover"
                                aria-label="Связаться"
                                onClick={onClose}
                            >
                                Связаться
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Header() {
    const { title: siteName, primaryPhone } = useContactsData();
    const { logo, loading } = useGlobalData();
    const { state: cartState } = useCart();
    const { state: favState } = useFavorites();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [eventsMobileOpen, setEventsMobileOpen] = useState(false);
    const [menuServicesMobileOpen, setMenuServicesMobileOpen] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [events, setEvents] = useState<EventPage[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const toggleEventsMobile = () => setEventsMobileOpen(!eventsMobileOpen);
    const toggleMenuServicesMobile = () => setMenuServicesMobileOpen(!menuServicesMobileOpen);
    const closeMobileMenu = () => setMobileMenuOpen(false);

    // Загружаем услуги из API
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setServicesLoading(true);
                const response = await apiClient.getServices({
                    populate: '*'
                });
                setServices(response.data || []);
            } catch (err) {
                console.error('Error fetching services for header:', err);
                // В случае ошибки используем пустой массив
                setServices([]);
            } finally {
                setServicesLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Загружаем события из API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setEventsLoading(true);
                const response = await apiClient.getEventPages({
                    populate: '*'
                });
                setEvents(response.data || []);
            } catch (err) {
                console.error('Error fetching events for header:', err);
                // В случае ошибки используем пустой массив
                setEvents([]);
            } finally {
                setEventsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <header className="shadow-hi shadow-to-block  sticky top-0 z-50" style={{ backgroundColor: '#1E1F26' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Логотип */}
                    <Logo logo={logo} siteName={siteName} loading={loading} />

                    {/* Десктопная навигация */}
                    <nav className="hidden md:flex space-x-8">
                        {NAVIGATION_ITEMS.slice(0, 1).map((item) => (
                            <NavItem key={item.href} href={item.href}>
                                {item.label}
                            </NavItem>
                        ))}
                        <MenuServicesDropdown services={services} />
                        {NAVIGATION_ITEMS.slice(1, 2).map((item) => (
                            <NavItem key={item.href} href={item.href}>
                                {item.label}
                            </NavItem>
                        ))}
                        <EventsDropdown events={events} />
                        <NavItem href="/contacts">Контакты</NavItem>
                    </nav>

                    {/* Контакты, избранное и корзина */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <ContactLinks primaryPhone={primaryPhone} />
                        <div className=" hover:bg-hi-white/20 rounded-lg p-2 transition-colors duration-200">
                            <FavoritesIcon />
                        </div>
                        <div className="bg-hi-yellow hover:bg-hi-yellow/90 rounded-lg transition-colors duration-200">
                            <CartIcon />
                        </div>
                    </div>

                    {/* Быстрые действия + бургер на мобильных */}
                    <div className="flex items-center space-x-2 md:hidden">
                        <Link
                            href="/favorites"
                            aria-label="Избранное"
                            className="mw-9 h-9 p-2 rounded-xl bg-hi-white/10 hover:bg-hi-white/20 flex items-center justify-center transition-colors max-[360px]:hidden"
                        >
                            <FavoritesIcon asLink={false} size={20} showBadge={false} />
                            {favState.totalItems > 0 && (
                                <span className="ml-2 text-[11px] text-white">{(favState.totalItems > 99 ? '99+' : favState.totalItems) + ' шт '}</span>
                            )}
                        </Link>


                        <div className="mw-9 h-9 p-2 rounded-xl bg-[#BFA76F] hover:bg-[#BFA76F]/90 flex items-center justify-center transition-colors">
                            <CartIcon compact size={20} color="#FFFFFF" showBadge={false} />
                            {cartState.totalItems > 0 && (
                                <span className="ml-2 text-[11px] text-white">{(cartState.totalItems > 99 ? '99+' : cartState.totalItems) + ' шт'}</span>
                            )}
                        </div>


                        <button
                            type="button"
                            className="w-9 h-9 rounded-xl bg-hi-white/10 hover:bg-hi-white/20 flex items-center justify-center transition-colors"
                            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                            onClick={toggleMobileMenu}
                        >
                            <Icon name={mobileMenuOpen ? 'close' : 'menu'} className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Мобильное меню */}
                <MobileMenu
                    isOpen={mobileMenuOpen}
                    onClose={closeMobileMenu}
                    eventsOpen={eventsMobileOpen}
                    onEventsToggle={toggleEventsMobile}
                    menuServicesOpen={menuServicesMobileOpen}
                    onMenuServicesToggle={toggleMenuServicesMobile}
                    services={services}
                    events={events}
                />
            </div>
        </header>
    );
}