'use client';

import { useLanguage } from '@/lib/language-context';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Review {
  id: string;
  author_name: string;
  rating: number;
  text: string;
  relative_time_description?: string;
}

export function ReviewsSection() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewsPerPage = 3;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
    setLoading(false);
  };

  const totalSlides = Math.max(1, Math.ceil(reviews.length / reviewsPerPage));
  const showNavigation = reviews.length > reviewsPerPage;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + reviewsPerPage) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - reviewsPerPage + reviews.length) % reviews.length);
  };

  const getVisibleReviews = () => {
    if (reviews.length === 0) return [];
    
    // If we have fewer reviews than reviewsPerPage, duplicate to fill
    if (reviews.length < reviewsPerPage) {
      const repeated = [];
      while (repeated.length < reviewsPerPage) {
        repeated.push(...reviews);
      }
      return repeated.slice(0, reviewsPerPage);
    }
    
    const start = currentIndex;
    const end = start + reviewsPerPage;
    if (end <= reviews.length) {
      return reviews.slice(start, end);
    }
    return [
      ...reviews.slice(start),
      ...reviews.slice(0, end - reviews.length)
    ];
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-primary">{t.reviews.title}</h2>
          <p className="text-xl text-foreground/70">{t.reviews.subtitle}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-foreground/60">
            No reviews available yet.
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Arrows */}
            {showNavigation && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Reviews Slider */}
            <div className={showNavigation ? 'mx-16' : ''}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {getVisibleReviews().map((review, idx) => (
                  <Card key={`${review.id}-${idx}`} className="border-muted hover:border-accent transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-primary">{review.author_name}</h3>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Quote className="w-8 h-8 text-primary/30 mb-2" />
                      <p className="text-foreground/80 leading-relaxed line-clamp-4">{review.text}</p>
                      {review.relative_time_description && (
                        <p className="text-sm text-muted-foreground mt-4">{review.relative_time_description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Dots Indicator */}
              {showNavigation && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx * reviewsPerPage)}
                      className={`w-3 h-3 rounded-full transition ${
                        Math.floor(currentIndex / reviewsPerPage) === idx ? 'bg-primary' : 'bg-primary/30'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Write Review Button */}
              <div className="text-center mt-10">
                <a
                  href="https://www.google.com/maps/place/MG+Solar+Panel+Installation+Services+(A+Unit+of+MG+Enterprise's)+Lucknow/@26.8625959,80.9926691,16.35z/data=!4m6!3m5!1s0x399be32c8953726b:0x964537d9419ffe65!8m2!3d26.862596!4d80.9978407!16s%2Fg%2F11yqcd8ylw?entry=ttu&g_ep=EgoyMDI2MDQwNS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
                >
                  <Star className="w-5 h-5" />
                  Write a Review
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
