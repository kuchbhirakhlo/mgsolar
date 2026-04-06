'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderOpen, Briefcase, MessageSquare, LogOut } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/brands', label: 'Brands', icon: Briefcase },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-primary text-white p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <span className="text-primary font-bold">☀</span>
        </div>
        <span className="font-bold text-lg">Admin</span>
      </div>

      <nav className="space-y-2 mb-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition"
      >
        <LogOut className="w-5 h-5" />
        <span>Exit Admin</span>
      </Link>
    </aside>
  );
}
