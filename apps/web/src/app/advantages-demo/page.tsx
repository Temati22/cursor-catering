import { Metadata } from 'next';
import AdvantagesGrid from '@/components/sections/AdvantagesGrid';

export const metadata: Metadata = {
    title: 'Наши преимущества | Hi-Catering',
    description: 'Узнайте о наших преимуществах и почему стоит выбрать наш кейтеринг для вашего мероприятия',
};

export default function AdvantagesDemoPage() {
    return (
        <>
            <div style={{ padding: '40px 0', textAlign: 'center', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        marginBottom: '1rem'
                    }}>
                        Наши преимущества
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#6c757d',
                        marginBottom: '0',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Узнайте, почему более 500 клиентов выбирают наш кейтеринг для своих мероприятий
                    </p>
                </div>
            </div>

            <AdvantagesGrid />

            <div style={{ padding: '60px 0', textAlign: 'center', background: '#fff' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        marginBottom: '1.5rem'
                    }}>
                        Готовы начать?
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#6c757d',
                        marginBottom: '2rem',
                        lineHeight: '1.6'
                    }}>
                        Свяжитесь с нами сегодня, чтобы обсудить ваше мероприятие и получить персональное предложение.
                        Наша команда профессионалов готова воплотить ваши идеи в жизнь.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                            href="/contacts"
                            style={{
                                display: 'inline-block',
                                padding: '15px 30px',
                                background: '#007bff',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            Связаться с нами
                        </a>
                        <a
                            href="/menus"
                            style={{
                                display: 'inline-block',
                                padding: '15px 30px',
                                background: 'transparent',
                                color: '#007bff',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                border: '2px solid #007bff',
                                transition: 'all 0.3s'
                            }}
                        >
                            Посмотреть меню
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
