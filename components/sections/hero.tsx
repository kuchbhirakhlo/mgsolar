'use client';

import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const { t } = useLanguage();
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    city: '',
    kw: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/quick-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'quick-lead',
          createdAt: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setShowPopup(false), 2000);
      } else {
        setError('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen bg-gradient-to-br from-primary via-primary to-primary/90 text-white overflow-hidden flex items-center"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                {t.hero.title}
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 text-balance">
                {t.hero.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Link href="#contact">{t.hero.cta}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <p className="text-sm text-blue-100">Installations</p>
              </div>
              <div>
                <div className="text-3xl font-bold">50MW</div>
                <p className="text-sm text-blue-100">Capacity</p>
              </div>
              <div>
                <div className="text-3xl font-bold">10k+</div>
                <p className="text-sm text-blue-100">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="relative h-96 md:h-full min-h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-white/10 rounded-2xl overflow-hidden">
          <Image           
           src="/homeheroimage.jpg"
             alt="Hero Video"
             fill
             className="object-cover rounded-2xl"
             suppressHydrationWarning
           />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* Quick Contact Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Thank You!</h3>
                <p className="text-foreground/70">We will contact you soon.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-primary mb-2">Get Free Quote</h3>
                <p className="text-foreground/70 mb-4">Fill details and we will call you</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <div>
                    <input
                      type="text"
                      placeholder="Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full text-gray-800 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Mobile Number *"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      required
                      className="w-full text-gray-800 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="City *"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="w-full text-gray-800 px-4 py-3  rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="How Much KW Solar (Optional)"
                      value={formData.kw}
                      onChange={(e) => setFormData({ ...formData, kw: e.target.value })}
                      className="w-full text-gray-800 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-white hover:bg-primary/90 py-3"
                  >
                    Submit
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
