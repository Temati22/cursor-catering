import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import apiClient, { Gallery } from '@/lib/api';
import { GalleryGrid } from '@/components/GalleryGrid';

export const metadata: Metadata = {
    title: 'Галерея | Hi-Catering',
    description: 'Галерея фотографий наших мероприятий и блюд',
    openGraph: {
        title: 'Галерея | Hi-Catering',
        description: 'Галерея фотографий наших мероприятий и блюд',
        type: 'website',
    },
};

async function getGalleryData(): Promise<Gallery | null> {
    try {
        const response = await apiClient.getGallery();
        return response?.data || null;
    } catch (error) {
        console.error('[Gallery Page] Failed to fetch gallery data:', error);
        return null;
    }
}

export default async function GalleryPage() {
    const gallery = await getGalleryData();

    return (
        <div className="min-h-screen bg-hi-white">
            {/* Breadcrumb */}
            <Breadcrumbs
                items={[
                    { label: 'Главная', href: '/' },
                    { label: 'Галерея' }
                ]}
            />

            {/* Header card */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 p-8 lg:p-12 border border-hi-silver/30">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-hi-graphite mb-4">
                            {gallery?.title || 'Галерея'}
                        </h1>
                        <p className="text-hi-graphite/80 text-lg">
                            {gallery?.description || 'Фотографии наших мероприятий и блюд'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <GalleryGrid images={gallery?.images || []} />
            </section>
        </div>
    );
}

