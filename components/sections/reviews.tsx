'use client';

import { useLanguage } from '@/lib/language-context';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: '1',
    author: 'Rajesh Patel',
    rating: 5,
    text: 'Excellent service! The team was professional and installed solar panels perfectly. Our electricity bill has reduced significantly.',
  },
  {
    id: '2',
    author: 'Priya Sharma',
    rating: 5,
    text: 'Best investment for our business. The ROI is impressive and the support team is always helpful.',
  },
  {
    id: '3',
    author: 'Amit Kumar',
    rating: 4,
    text: 'Very satisfied with the installation. The monitoring system works great for tracking energy production.',
  },
  {
    id: '4',
    author: 'Nisha Verma',
    rating: 5,
    text: 'Professional and reliable. They handled everything from consultation to installation seamlessly.',
  },
];

export function ReviewsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-primary">{t.reviews.title}</h2>
          <p className="text-xl text-foreground/70">{t.reviews.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="border-muted hover:border-accent transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-primary">{review.author}</h3>
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
                <p className="text-foreground/80 leading-relaxed">{review.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
