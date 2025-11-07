'use client';

import { useState } from 'react';
import { FirstMainBlock } from '@/components/sections/FirstMainBlock';
import { AboutSection } from '@/components/sections/AboutSection';
import { PopularFoodSection } from '@/components/sections/PopularFoodSection';
import { MenusSection } from '@/components/sections/MenusSection';
import { HorizontalCtaSection } from '@/components/sections/HorizontalCtaSection';
import { CompactCtaSection } from '@/components/sections/CompactCtaSection';
import { EventsListSection } from '@/components/sections/EventsListSection';
import AdvantagesGrid from '@/components/sections/AdvantagesGrid';
import { Popup, PopupType } from '@/components/ui/Popup';
import { Calendar, Users } from 'lucide-react';
import { SocialProofCtaSection } from '@/components/sections/SocialProofCtaSection';
import { ServicesCardsSection } from '@/components/sections/ServicesCardsSection';


export default function HomePage() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<PopupType>('order-catering');

  const handleOpenPopup = (type: PopupType) => {
    setPopupType(type);
    setPopupOpen(true);
  };
  return (
    <>
      <FirstMainBlock onOpenPopup={() => handleOpenPopup('order-catering')} />

      <AboutSection />


      <CompactCtaSection
        variant="primary"
        title="Нужна консультация?"
        subtitle="Получите персональное предложение за 5 минут"
        ctaText="Получить предложение"
        showContactInfo={true}
        showTimer={true}
        className="w-full"
      />

      <ServicesCardsSection
        showDescription={true}
        title="Наши услуги"
        description="Полный спектр услуг кейтеринга для любых мероприятий"
      />

      <AdvantagesGrid />

      <EventsListSection
        title="Специальные предложения для праздников"
        description="Откройте для себя наши эксклюзивные предложения для особых случаев. Мы создаём незабываемые моменты для каждого праздника и мероприятия."
      />

      {/* <FeaturesSection /> */}

      <CompactCtaSection
        variant="primary"
        title="Нужна консультация?"
        subtitle="Получите персональное предложение за 5 минут"
        ctaText="Получить предложение"
        showContactInfo={true}
        showTimer={true}
        className="w-full"
      />


      <MenusSection limit={8} showPrice={true} showDescription={true} />

      {/* Первый горизонтальный CTA блок */}

      {/* <HorizontalCtaSection
        variant="primary"
        title="Готовы заказать кейтеринг?"
        subtitle="Получите персональное предложение"
        description="Оставьте заявку и наш менеджер свяжется с вами в течение 15 минут для обсуждения деталей вашего мероприятия."
        ctaText="Получить предложение"
        icon={<Calendar className="h-6 w-6" />}
      /> */}

      {/* <PopularFoodSection limit={3} /> */}

      {/* Компактный CTA блок */}






      {/* CTA блок с социальными доказательствами */}
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

      {/* Второй горизонтальный CTA блок */}
      {/* <HorizontalCtaSection
        variant="secondary"
        title="Организуем ваше мероприятие"
        subtitle="От корпоративов до свадеб"
        description="Профессиональный кейтеринг для любых мероприятий. Вкусная еда, качественный сервис, незабываемые впечатления."
        ctaText="Заказать услугу"
        icon={<Users className="h-6 w-6" />}
      /> */}

      {/* <CtaSection /> */}

      {/* Popup для обратной связи */}
      <Popup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        type={popupType}
      />
    </>
  );
}