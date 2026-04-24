'use client';

import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu, ChevronDown, User } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-muted shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center w-32 h-10 gap-2">
            <Image
              src="/mgsolarlogo.jpeg"
              alt="MG Solar Logo"
              width={20}
              height={15}
              className="h-15 w-20 object-contain"
              suppressHydrationWarning
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#services" className="text-foreground hover:text-primary transition">
              {t.nav.services}
            </Link>
            <Link href="#projects" className="text-foreground hover:text-primary transition">
              {t.nav.projects}
            </Link>
            <Link href="#brands" className="text-foreground hover:text-primary transition">
              {t.nav.brands}
            </Link>
            <Link href="#careers" className="text-foreground hover:text-primary transition">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden sm:flex">
                  <User className="w-4 h-4 mr-2" />
                  Login
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/admin-login">Admin</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/employee-login">Employee</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/installer-login">Engineer</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              href="#brands"
              className="block text-foreground hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.brands}
            </Link>
            <Link
              href="#careers"
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
            <div className="mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Login
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem asChild>
                    <Link href="/admin-login">Admin</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/employee-login">Employee</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/installer-login">Engineer</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              asChild
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="#contact">{t.hero.cta}</Link>
            </Button>
            <div className="mt-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="w-full px-3 py-2 rounded-lg bg-muted text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
              >
                {language === 'en' ? 'हिन्दी' : 'EN'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
