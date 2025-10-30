import { Metadata } from 'next';
import { HorizontalCtaSection } from '@/components/sections/HorizontalCtaSection';
import { CompactCtaSection } from '@/components/sections/CompactCtaSection';
import { UrgentCtaSection } from '@/components/sections/UrgentCtaSection';
import { SocialProofCtaSection } from '@/components/sections/SocialProofCtaSection';
import { Calendar, Users, Gift, Star } from 'lucide-react';

export const metadata: Metadata = {
    title: 'CTA Блоки | Hi-Catering',
    description: 'Горизонтальные маркетинговые блоки для сбора контактов и призыва к действию',
};

export default function CtaShowcasePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 lg:py-24 bg-hi-luxe text-hi-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            Горизонтальные CTA Блоки
                        </h1>
                        <p className="text-xl opacity-90">
                            Различные варианты маркетинговых блоков для сбора контактов и призыва к действию
                        </p>
                    </div>
                </div>
            </section>

            {/* Horizontal CTA Section - Primary */}
            <HorizontalCtaSection
                variant="primary"
                title="Готовы заказать кейтеринг?"
                subtitle="Получите персональное предложение"
                description="Оставьте заявку и наш менеджер свяжется с вами в течение 15 минут для обсуждения деталей вашего мероприятия."
                ctaText="Получить предложение"
                icon={<Calendar className="h-6 w-6" />}
            />

            {/* Compact CTA Section */}
            <CompactCtaSection
                variant="primary"
                title="Нужна консультация?"
                subtitle="Получите персональное предложение за 5 минут"
                ctaText="Получить предложение"
                showContactInfo={true}
                showTimer={true}
            />

            {/* Horizontal CTA Section - Secondary */}
            <HorizontalCtaSection
                variant="secondary"
                title="Организуем ваше мероприятие"
                subtitle="От корпоративов до свадеб"
                description="Профессиональный кейтеринг для любых мероприятий. Вкусная еда, качественный сервис, незабываемые впечатления."
                ctaText="Заказать услугу"
                icon={<Users className="h-6 w-6" />}
            />

            {/* Urgent CTA Section */}
            <UrgentCtaSection
                variant="urgent"
                title="Ограниченное предложение!"
                subtitle="Скидка 20% на первый заказ"
                description="До конца месяца действует специальная скидка для новых клиентов. Успейте забронировать дату!"
                ctaText="Забронировать со скидкой"
                offerText="Осталось мест:"
                deadline="2024-12-31"
                discount="20%"
            />

            {/* Social Proof CTA Section */}
            <SocialProofCtaSection
                variant="testimonials"
                title="Почему выбирают нас?"
                subtitle="Более 500 довольных клиентов"
                description="Присоединяйтесь к сотням клиентов, которые уже доверили нам свои мероприятия"
                ctaText="Стать клиентом"
                showTestimonials={true}
                showStats={true}
                showFeatures={true}
            />

            {/* Horizontal CTA Section - Luxury */}
            <HorizontalCtaSection
                variant="luxury"
                title="Премиум кейтеринг"
                subtitle="Эксклюзивное обслуживание"
                description="Для особых случаев предлагаем премиум-меню с авторскими блюдами от нашего шеф-повара."
                ctaText="Заказать премиум"
                icon={<Star className="h-6 w-6" />}
            />

            {/* Compact CTA Section - Secondary */}
            <CompactCtaSection
                variant="secondary"
                title="Есть вопросы?"
                subtitle="Наши эксперты готовы помочь"
                ctaText="Задать вопрос"
                showContactInfo={true}
                showTimer={false}
            />

            {/* Urgent CTA Section - Offer */}
            <UrgentCtaSection
                variant="offer"
                title="Специальное предложение!"
                subtitle="Бесплатная дегустация меню"
                description="При заказе от 50 человек предоставляем бесплатную дегустацию блюд для утверждения меню."
                ctaText="Заказать дегустацию"
                offerText="Акция до:"
                deadline="2024-12-25"
                discount="Бесплатно"
            />

            {/* Compact CTA Section - Accent */}
            <CompactCtaSection
                variant="accent"
                title="Готовы начать?"
                subtitle="Свяжитесь с нами прямо сейчас"
                ctaText="Связаться"
                showContactInfo={true}
                showTimer={true}
            />
        </div>
    );
}
