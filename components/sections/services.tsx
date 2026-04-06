'use client';

import { useLanguage } from '@/lib/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export function ServicesSection() {
  const { t } = useLanguage();

  const services = [
    {
      icon: '🏠',
      title: t.services.items.residential.name,
      description: t.services.items.residential.description,
      features: ['Panel Installation', 'Inverter Setup', 'Wiring & Safety', 'Monitoring System'],
    },
    {
      icon: '🏢',
      title: t.services.items.commercial.name,
      description: t.services.items.commercial.description,
      features: ['Large Scale Systems', 'Roof Assessment', 'Grid Integration', 'Maintenance Plans'],
    },
    {
      icon: '🔧',
      title: t.services.items.maintenance.name,
      description: t.services.items.maintenance.description,
      features: ['Regular Checks', 'Cleaning Service', 'Repairs', 'Performance Optimization'],
    },
  ];

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-primary">{t.services.title}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border-muted hover:border-accent hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <div className="text-5xl mb-4">{service.icon}</div>
                <CardTitle className="text-2xl text-primary">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
