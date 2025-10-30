'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Popup } from '@/components/ui/Popup';

export default function PopupTestPage() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <div className="min-h-screen bg-hi-ash flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-hi-graphite mb-8">
                    Тест компонента Popup
                </h1>

                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setIsPopupOpen(true)}
                >
                    Открыть форму обратной связи
                </Button>

                <Popup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    title="Заказать услуги кейтеринга"
                />
            </div>
        </div>
    );
}
