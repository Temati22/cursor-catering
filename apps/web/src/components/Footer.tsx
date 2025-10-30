'use client';

import Link from 'next/link';
import { useContactsData } from '@/hooks/useContactsData';

export default function Footer() {
    const {
        title: siteName,
        description: siteDescription,
        primaryPhone,
        secondaryPhone,
        email,
        address,
        vkLink,
        instagramLink,
        telegramLink,
        whatsappLink
    } = useContactsData();

    return (
        <footer className="relative bg-hi-graphite text-white">
            {/* Background image with overlay */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(/bg_img.jpg)'
                    }}
                />
                <div className="absolute inset-0 bg-hi-graphite/80" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-4">
                            <div className="h-8 w-8 bg-hi-luxe rounded-lg flex items-center justify-center">
                                <span className="text-hi-white font-bold text-lg">H</span>
                            </div>
                            <span className="ml-2 text-xl font-bold text-white">{siteName}</span>
                        </div>
                        <p className="text-hi-silver mb-6 max-w-md">
                            {siteDescription}
                        </p>
                        <div className="flex space-x-4">
                            {vkLink && (
                                <a href={vkLink} target="_blank" rel="noopener noreferrer" className="text-hi-silver hover:text-white transition-colors">
                                    <span className="sr-only">VKontakte</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-.864-1.744-.864-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.593.593-.593h1.744c.593 0 .813.254 1.033.678 1.253 2.118 2.966 3.98 3.202 3.98.254 0 .356-.102.356-.678V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.407-.407h2.542c.339 0 .458.102.458.593v3.473c0 .373.17.508.271.678.186.297.186.297 1.033.297.254 0 .424-.102.424-.593v-3.473c0-.339.17-.593.593-.593h2.542c.339 0 .508.254.508.593v3.473c0 .678-.254.813-1.186.813-.593 0-.678.102-1.186.593-.508.508-.678.813-1.186 1.186-.339.254-.339.508 0 .678.339.17 1.186.593 1.186 1.186.17.339.17.593 0 .678-.17.17-.593.17-1.186.17z" />
                                    </svg>
                                </a>
                            )}
                            {instagramLink && (
                                <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="text-hi-silver hover:text-white transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.98-.49-.98-.98s.49-.98.98-.98.98.49.98.98-.49.98-.98.98zm-3.83 1.297c-1.297 0-2.448.49-3.323 1.297-.807.875-1.297 2.026-1.297 3.323s.49 2.448 1.297 3.323c.875.807 2.026 1.297 3.323 1.297s2.448-.49 3.323-1.297c.807-.875 1.297-2.026 1.297-3.323s-.49-2.448-1.297-3.323c-.875-.807-2.026-1.297-3.323-1.297z" />
                                    </svg>
                                </a>
                            )}
                            {telegramLink && (
                                <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="text-hi-silver hover:text-white transition-colors">
                                    <span className="sr-only">Telegram</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                    </svg>
                                </a>
                            )}
                            {whatsappLink && (
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-hi-silver hover:text-white transition-colors">
                                    <span className="sr-only">WhatsApp</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-hi-silver hover:text-white transition-colors">
                                    Главная
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-hi-silver hover:text-white transition-colors">
                                    О нас
                                </Link>
                            </li>
                            <li>
                                <Link href="/menus" className="text-hi-silver hover:text-white transition-colors">
                                    Меню и услуги
                                </Link>
                            </li>
                            <li>
                                <Link href="/gallery" className="text-hi-silver hover:text-white transition-colors">
                                    Галерея
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="text-hi-silver hover:text-white transition-colors">
                                    Праздники
                                </Link>
                            </li>
                            <li>
                                <Link href="/contacts" className="text-hi-silver hover:text-white transition-colors">
                                    Контакты
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Контакты</h3>
                        <div className="space-y-3">
                            {primaryPhone && (
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-hi-silver mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <a href={`tel:${primaryPhone}`} className="text-hi-silver hover:text-white transition-colors">
                                        {primaryPhone}
                                    </a>
                                </div>
                            )}
                            {secondaryPhone && (
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-hi-silver mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <a href={`tel:${secondaryPhone}`} className="text-hi-silver hover:text-white transition-colors">
                                        {secondaryPhone}
                                    </a>
                                </div>
                            )}
                            {email && (
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-hi-silver mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href={`mailto:${email}`} className="text-hi-silver hover:text-white transition-colors">
                                        {email}
                                    </a>
                                </div>
                            )}
                            {address && (
                                <div className="flex items-start">
                                    <svg className="h-5 w-5 text-hi-silver mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-hi-silver">
                                        {address}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-hi-silver mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-hi-silver text-sm">
                            © 2024 {siteName}. Все права защищены.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link href="/privacy" className="text-hi-silver hover:text-white text-sm transition-colors">
                                Политика конфиденциальности
                            </Link>
                            <Link href="/terms" className="text-hi-silver hover:text-white text-sm transition-colors">
                                Условия использования
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}