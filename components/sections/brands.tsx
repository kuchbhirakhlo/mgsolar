'use client';

import { useLanguage } from '@/lib/language-context';
import { ReactNode } from 'react';

const BrandIcon = ({ name }: { name: string }): ReactNode => {
  const icons: Record<string, ReactNode> = {
    'SunPower': (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <rect x="4" y="4" width="18" height="18" fill="#FFD700" />
        <rect x="26" y="4" width="18" height="18" fill="#FFD700" />
        <rect x="4" y="26" width="18" height="18" fill="#FFD700" />
        <rect x="26" y="26" width="18" height="18" fill="#FFD700" />
      </svg>
    ),
    'Canadian Solar': (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <circle cx="24" cy="24" r="20" fill="#0066CC" />
        <path d="M24 8v32M8 24h32" stroke="white" strokeWidth="4" />
      </svg>
    ),
    'JinkoSolar': (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <polygon points="24,4 4,24 24,44 44,24" fill="#FFCC00" />
        <circle cx="24" cy="24" r="8" fill="white" />
      </svg>
    ),
    'Luminous': (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <path d="M24 4L28 20H44L30 28L34 44L24 34L14 44L18 28L4 20H20L24 4Z" fill="#FF6600" />
      </svg>
    ),
    'Tesla': (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <path d="M24 8L8 24l16 16 16-16L24 8z" fill="#CC0000" />
        <path d="M24 16l-8 8 8 8 8-8-8-8z" fill="white" />
      </svg>
    ),
    'ABB': (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <rect x="4" y="4" width="40" height="40" fill="#FF0000" />
        <rect x="12" y="12" width="24" height="24" fill="white" />
      </svg>
    ),
  };
  return icons[name] || <div className="w-12 h-12 bg-white/20 rounded" />;
};

const brands = [
  { name: 'SunPower' },
  { name: 'Canadian Solar' },
  { name: 'JinkoSolar' },
  { name: 'Luminous' },
  { name: 'Tesla' },
  { name: 'ABB' },
];

export function BrandsSection() {
  const { t } = useLanguage();

  return (
    <section id="brands" className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">{t.brands.title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col items-center justify-center p-6 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              <BrandIcon name={brand.name} />
              <p className="text-sm font-medium text-center mt-2">{brand.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
