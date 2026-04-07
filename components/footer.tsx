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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
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
