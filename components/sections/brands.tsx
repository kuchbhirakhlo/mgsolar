'use client';

import { useLanguage } from '@/lib/language-context';

const brands = [
  { name: 'SunPower', logo: '🟨' },
  { name: 'Canadian Solar', logo: '🔵' },
  { name: 'JinkoSolar', logo: '⭐' },
  { name: 'Luminous', logo: '💡' },
  { name: 'Tesla', logo: '⚡' },
  { name: 'ABB', logo: '🔷' },
];

export function BrandsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">{t.brands.title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col items-center justify-center p-6 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              <span className="text-4xl mb-2">{brand.logo}</span>
              <p className="text-sm font-medium text-center">{brand.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
