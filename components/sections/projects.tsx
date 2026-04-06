'use client';

import { useLanguage } from '@/lib/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const recentProjects = [
  {
    id: '1',
    title: 'Residential Complex - Mumbai',
    location: 'Mumbai, Maharashtra',
    capacity: '250 kW',
    date: '2024',
    image: '🏘️',
  },
  {
    id: '2',
    title: 'Factory Solar Installation',
    location: 'Pune, Maharashtra',
    capacity: '500 kW',
    date: '2024',
    image: '🏭',
  },
  {
    id: '3',
    title: 'School Campus Project',
    location: 'Bangalore, Karnataka',
    capacity: '150 kW',
    date: '2023',
    image: '🏫',
  },
  {
    id: '4',
    title: 'Hotel Solar Setup',
    location: 'Goa, Goa',
    capacity: '200 kW',
    date: '2023',
    image: '🏨',
  },
];

export function ProjectsSection() {
  const { t } = useLanguage();

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-primary">{t.projects.title}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            {t.projects.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden hover:shadow-lg hover:border-accent transition-all duration-300 group"
            >
              <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
                <span className="text-5xl">{project.image}</span>
              </div>
              <CardHeader>
                <CardTitle className="text-lg text-primary">{project.title}</CardTitle>
                <CardDescription className="text-sm">{project.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">Capacity</span>
                  <span className="font-semibold text-accent">{project.capacity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">Year</span>
                  <span className="font-semibold">{project.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition font-medium"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
