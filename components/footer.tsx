'use client';

import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-primary font-bold">☀</span>
              </div>
              <span className="font-bold">{t.footer.company}</span>
            </div>
            <p className="text-blue-100 text-sm">Leading solar energy solutions provider</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>
                <Link href="#home" className="hover:text-secondary transition">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-secondary transition">
                  {t.about.title}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-secondary transition">
                  {t.nav.careers}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>
                <Link href="#services" className="hover:text-secondary transition">
                  {t.services.title}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-secondary transition">
                  {t.projects.title}
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-secondary transition">
                  {t.contact.title}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-blue-100">
          <p>
            &copy; 2024 {t.footer.company}. {t.footer.rights}.
          </p>
        </div>
      </div>
    </footer>
  );
}
