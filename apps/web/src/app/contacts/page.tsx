import { Metadata } from 'next';
import { ContactsContent } from './ContactsContent';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
    title: 'Контакты | Hi-Catering',
    description: 'Свяжитесь с нами для заказа кейтеринга. Телефон, email, адрес и время работы.',
    openGraph: {
        title: 'Контакты | Hi-Catering',
        description: 'Свяжитесь с нами для заказа кейтеринга. Телефон, email, адрес и время работы.',
        type: 'website',
    },
};

export default function ContactsPage() {
    return (
        <section className="bg-hi-ash">
            <Breadcrumbs
                items={[
                    { label: 'Главная', href: '/' },
                    { label: 'Контакты' }
                ]}
            />

            <div className="pb-16 pt-8 bg-hi-ash">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                    {/* Hero секция */}
                    <section className="bg-gradient-to-br from-hi-luxe to-hi-platinum py-20 rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 border border-hi-silver/30"
                        style={{
                            background: '#fff url(/bg-cont.png) no-repeat',
                            backgroundSize: 'contain',
                            backgroundPosition: 'right',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-left">
                                <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                                    Контакты
                                </h1>
                                <p className="text-lg md:text-xl text-black/90 max-w-2xl">
                                    Свяжитесь с нами для заказа кейтеринга или получения консультации
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>



            <ContactsContent />
        </section >
    );
}