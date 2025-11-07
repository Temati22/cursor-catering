import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import { AboutSection } from '@/components/sections/AboutSection';
import AdvantagesGrid from '@/components/sections/AdvantagesGrid';
import { CompactCtaSection } from '@/components/sections/CompactCtaSection';

const CONTAINER_CLASSES = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

export default function AboutPage() {
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Главная', href: '/' },
        { label: 'О нас' }
    ];

    return (
        <div className="min-h-screen bg-hi-white">
            {/* Breadcrumb */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* Header card */}
            <section className={`${CONTAINER_CLASSES} py-12`}>
                <div className="bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 p-8 lg:p-12 border border-hi-silver/30">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-hi-graphite mb-4">
                            О компании Hi‑Catering
                        </h1>
                        <p className="text-hi-graphite/80 text-lg">
                            Профессиональный кейтеринг для ваших мероприятий: от камерных встреч до
                            масштабных событий.
                        </p>
                    </div>
                </div>
            </section>

            {/* About section with gallery and text */}
            <AboutSection />

            {/* Advantages / why us */}
            <AdvantagesGrid />

            {/* CTA */}
            <section className={`${CONTAINER_CLASSES} pb-16`}>
                <CompactCtaSection
                    variant="primary"
                    title="Готовы обсудить ваше мероприятие?"
                    subtitle="Отправьте заявку и получите предложение за 5 минут"
                    ctaText="Получить предложение"
                    showContactInfo={true}
                />
            </section>
        </div>
    );
}