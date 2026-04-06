import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/sections/hero';
import { ServicesSection } from '@/components/sections/services';
import { ProjectsSection } from '@/components/sections/projects';
import { BrandsSection } from '@/components/sections/brands';
import { ReviewsSection } from '@/components/sections/reviews';
import { AboutSection } from '@/components/sections/about';
import { ContactSection } from '@/components/sections/contact';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <BrandsSection />
        <ReviewsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
