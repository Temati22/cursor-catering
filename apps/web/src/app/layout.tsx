import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { CartDrawer } from '@/components/ui/CartDrawer';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Hi-Catering - Кейтеринг и доставка еды',
    template: `%s | Hi-Catering`,
  },
  description: 'Профессиональный кейтеринг и доставка еды. Закажите готовые меню для любых мероприятий.',
  keywords: [
    'кейтеринг',
    'доставка еды',
    'готовые меню',
    'корпоративные мероприятия',
    'свадьбы',
    'банкеты',
  ],
  authors: [{ name: 'Hi-Catering' }],
  creator: 'Hi-Catering',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'http://localhost:3000',
    title: 'Hi-Catering - Кейтеринг и доставка еды',
    description: 'Профессиональный кейтеринг и доставка еды. Закажите готовые меню для любых мероприятий.',
    siteName: 'Hi-Catering',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hi-Catering - Кейтеринг и доставка еды',
    description: 'Профессиональный кейтеринг и доставка еды. Закажите готовые меню для любых мероприятий.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className={`min-h-screen bg-white font-sans antialiased ${inter.className}`}>
        <CartProvider>
          <FavoritesProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </div>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}