'use client';

import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-muted shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center w-24 h-10 gap-2">
            <Image
              src="/mgsolarlogo.png"
              alt="MG Solar Logo"
              width={46}
              height={34}
              className="h-34 w-46 rounded-full"
            />
            </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#home" className="text-foreground hover:text-primary transition">
              {t.nav.home}
            </Link>
            <Link href="#services" className="text-foreground hover:text-primary transition">
              {t.nav.services}
            </Link>
            <Link href="/projects" className="text-foreground hover:text-primary transition">
              {t.nav.projects}
            </Link>
            <Link href="/careers" className="text-foreground hover:text-primary transition">
              {t.nav.careers}
            </Link>
            <Link href="#contact" className="text-foreground hover:text-primary transition">
              {t.nav.contact}
            </Link>
          </div>

          {/* Language Toggle & CTA */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-3 py-2 rounded-lg bg-muted text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <Button
              asChild
              className="hidden sm:flex bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="#contact">{t.hero.cta}</Link>
            </Button>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mt-4 pb-4 md:hidden space-y-3 border-t pt-4">
            <Link
              href="#home"
              className="block text-foreground hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.home}
            </Link>
            <Link
              href="#services"
              className="block text-foreground hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.services}
            </Link>
            <Link
              href="/projects"
              className="block text-foreground hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.projects}
            </Link>
            <Link
              href="/careers"
              className="block text-foreground hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.careers}
            </Link>
            <Link
              href="#contact"
              className="block text-foreground hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.contact}
            </Link>
            <Button
              asChild
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="#contact">{t.hero.cta}</Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
