import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Премиум кейтеринг для событий в Москве | Hi-Catering – 500+ счастливых клиентов',
    description: 'Эксклюзивный кейтеринг премиум-класса для свадеб, корпоративов, юбилеев и дней рождения. 15+ лет опыта, 98% довольных клиентов. Бесплатная консультация и дегустация.',
    keywords: [
        'кейтеринг',
        'кейтеринг Москва',
        'свадебный кейтеринг',
        'корпоративный кейтеринг',
        'кейтеринг на дом',
        'праздничный стол',
        'кушанья на заказ',
        'банкетное меню',
        'премиум кейтеринг',
        'доставка еды',
        'организация мероприятий',
        'hi-catering',
        'элитный кейтеринг'
    ],
    openGraph: {
        title: 'Премиум кейтеринг для событий | Hi-Catering',
        description: 'Эксклюзивный кейтеринг премиум-класса для ваших особых событий. 500+ счастливых клиентов.',
        type: 'website',
        siteName: 'Hi-Catering',
        locale: 'ru_RU',
        images: [
            {
                url: '/Logo.png',
                width: 1200,
                height: 630,
                alt: 'Hi-Catering - премиум кейтеринг в Москве'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Премиум кейтеринг для событий | Hi-Catering',
        description: 'Эксклюзивный кейтеринг премиум-класса. 15+ лет опыта, 500+ клиентов.'
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: 'https://hi-catering.ru/events',
    },
};

export default function EventsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
