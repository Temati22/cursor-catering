import { Metadata } from 'next';
import { AboutContent } from './AboutContent';

export const metadata: Metadata = {
    title: 'О нас | Hi-Catering',
    description: 'Узнайте больше о нашей команде и подходе к кейтерингу. Профессиональный сервис для ваших мероприятий.',
    openGraph: {
        title: 'О нас | Hi-Catering',
        description: 'Узнайте больше о нашей команде и подходе к кейтерингу. Профессиональный сервис для ваших мероприятий.',
        type: 'website',
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero секция */}
            <section className="bg-gradient-to-br from-hi-luxe to-hi-platinum py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            О нас
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Узнайте больше о нашей команде и подходе к кейтерингу
                        </p>
                    </div>
                </div>
            </section>

            <AboutContent />
        </div>
    );
}