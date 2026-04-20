import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/sections/hero';
import { ServicesSection } from '@/components/sections/services';
import { ProjectsSection } from '@/components/sections/projects';
import { BrandsSection } from '@/components/sections/brands';
import { ReviewsSection } from '@/components/sections/reviews';
import { AboutSection } from '@/components/sections/about';
import { CareersSection } from '@/components/sections/careers';
import { ContactSection } from '@/components/sections/contact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'M.G. Enterprises - Best Solar Panel Dealer & Installer in Lucknow, Uttar Pradesh',
  description: 'Leading solar panel dealer and installer in Lucknow, UP. Get high-quality solar panels, installation services, and rooftop solar systems. Expert solar solutions for residential and commercial projects.',
  keywords: [
    'solar panels Lucknow',
    'solar installation Uttar Pradesh',
    'solar dealer Lucknow',
    'rooftop solar system',
    'solar energy solutions',
    'best solar panels UP',
    'solar installer Lucknow',
    'renewable energy Lucknow',
    'solar power installation',
    'solar panel vendor Uttar Pradesh',
    'grid-connected solar systems',
    'solar quotations Lucknow',
    'solar maintenance services',
    'green energy solutions UP'
  ],
  authors: [{ name: 'M.G. Enterprises' }],
  creator: 'M.G. Enterprises',
  publisher: 'M.G. Enterprises',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mgsolar.in'), // Assuming domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'M.G. Enterprises - Solar Panel Experts in Lucknow',
    description: 'Professional solar panel installation and dealer services in Lucknow, Uttar Pradesh. Quality solar solutions for your home and business.',
    url: 'https://mgsolar.in',
    siteName: 'M.G. Enterprises',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/homeheroimage.jpg',
        width: 1200,
        height: 630,
        alt: 'M.G. Enterprises Solar Panels',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M.G. Enterprises - Solar Panel Dealer Lucknow',
    description: 'Best solar panel installation services in Lucknow, UP. Expert solar solutions for residential and commercial projects.',
    images: ['/homeheroimage.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add actual code
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "M.G. Enterprises",
    "description": "Leading solar panel dealer and installer in Lucknow, Uttar Pradesh. Providing high-quality solar panels, installation services, and renewable energy solutions.",
    "url": "https://mgsolar.co.in",
    "telephone": "+91-XXXXXXXXXX", // Add actual phone
    "email": "info@mgsolar.in", // Add actual email
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Vibhuti Khand, Gomti Nagar",
      "addressLocality": "Lucknow",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "226010",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.8467, // Lucknow coordinates
      "longitude": 80.9462
    },
    "openingHours": "Mo-Sa 09:00-18:00",
    "priceRange": "$$",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 26.8467,
        "longitude": 80.9462
      },
      "geoRadius": 100000 // 100km radius
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Solar Panel Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Solar Panel Installation",
            "description": "Professional installation of rooftop solar panels"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Solar System Maintenance",
            "description": "Maintenance and repair services for solar systems"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <BrandsSection />
        <ReviewsSection />
        <AboutSection />
        <CareersSection />
        <ContactSection />
      </main>

      {/* Tags Section */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Solar Panels Lucknow',
              'Solar Installation UP',
              'Solar Dealer Lucknow',
              'Rooftop Solar System',
              'Solar Energy Solutions',
              'Best Solar Panels Uttar Pradesh',
              'Solar Installer Lucknow',
              'Renewable Energy Lucknow',
              'Solar Power Installation',
              'Solar Panel Vendor UP',
              'Grid-Connected Solar Systems',
              'Solar Quotations Lucknow',
              'Solar Maintenance Services',
              'Green Energy Solutions Uttar Pradesh',
              'Solar Battery Lucknow',
              'Solar Inverter Dealer UP',
              'Residential Solar Panels',
              'Commercial Solar Installation',
              'Solar Subsidies Lucknow',
              'Net Metering Assistance UP'
            ].map((tag, index) => (
              <span
                key={index}
                className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
