'use client';

import React from 'react';
import { Star, User, Calendar } from 'lucide-react';

interface Review {
    id: number;
    author: string;
    rating: number;
    comment: string;
    date: string;
    avatar?: string;
}

interface ReviewsSectionProps {
    reviews: Review[];
    className?: string;
}

export function ReviewsSection({ reviews, className = '' }: ReviewsSectionProps) {
    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                className={`${i < rating ? 'text-hi-yellow fill-current' : 'text-gray-300'
                    }`}
            />
        ));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    return (
        <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Отзывы о меню
                </h2>

                {reviews.length > 0 ? (
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            {renderStars(Math.round(averageRating))}
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-gray-600">
                            ({reviews.length} {reviews.length === 1 ? 'отзыв' : 'отзывов'})
                        </span>
                    </div>
                ) : (
                    <p className="text-gray-600">Пока нет отзывов</p>
                )}
            </div>

            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                            <div className="flex items-start space-x-4">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    {review.avatar ? (
                                        <img
                                            src={review.avatar}
                                            alt={review.author}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-hi-green flex items-center justify-center">
                                            <User size={20} className="text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Review Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <h4 className="text-sm font-semibold text-gray-900">
                                                {review.author}
                                            </h4>
                                            <div className="flex items-center space-x-1">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Calendar size={12} className="mr-1" />
                                            {formatDate(review.date)}
                                        </div>
                                    </div>

                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Star size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-2">Пока нет отзывов</p>
                    <p className="text-sm text-gray-500">
                        Станьте первым, кто оставит отзыв об этом меню
                    </p>
                </div>
            )}
        </div>
    );
}
