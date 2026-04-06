import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card } from '@/components/ui/card';

const allProjects = [
  {
    id: '1',
    title: 'Residential Complex - Mumbai',
    location: 'Mumbai, Maharashtra',
    capacity: '250 kW',
    date: '2024',
    image: '🏘️',
    description: 'Complete solar installation for a 200+ unit residential complex',
  },
  {
    id: '2',
    title: 'Factory Solar Installation',
    location: 'Pune, Maharashtra',
    capacity: '500 kW',
    date: '2024',
    image: '🏭',
    description: 'Large scale industrial solar system with grid integration',
  },
  {
    id: '3',
    title: 'School Campus Project',
    location: 'Bangalore, Karnataka',
    capacity: '150 kW',
    date: '2023',
    image: '🏫',
    description: 'Educational institution solar array with monitoring system',
  },
  {
    id: '4',
    title: 'Hotel Solar Setup',
    location: 'Goa, Goa',
    capacity: '200 kW',
    date: '2023',
    image: '🏨',
    description: 'Hospitality sector solar installation for sustainable operations',
  },
  {
    id: '5',
    title: 'Shopping Mall Installation',
    location: 'Hyderabad, Telangana',
    capacity: '400 kW',
    date: '2023',
    image: '🏬',
    description: 'Rooftop solar system for commercial retail space',
  },
  {
    id: '6',
    title: 'Hospital Solar System',
    location: 'Chennai, Tamil Nadu',
    capacity: '300 kW',
    date: '2022',
    image: '🏥',
    description: 'Critical infrastructure backup power solar solution',
  },
];

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Projects</h1>
            <p className="text-lg text-blue-100">
              Explore our successful solar installations across the country
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:shadow-lg hover:border-accent transition-all duration-300 group"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
                    <span className="text-6xl">{project.image}</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-primary">{project.title}</h3>
                    <p className="text-foreground/80">{project.description}</p>

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Location</span>
                        <span className="font-medium text-primary">{project.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Capacity</span>
                        <span className="font-medium text-accent">{project.capacity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Year</span>
                        <span className="font-medium">{project.date}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
