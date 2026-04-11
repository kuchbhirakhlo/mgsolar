'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderOpen, MessageSquare, LogOut, Users, UserPlus, Wrench } from 'lucide-react';

const adminNavItems = [
  { href: '/mgadmin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mgadmin/customers', label: 'Customers', icon: UserPlus },
  { href: '/mgadmin/installations', label: 'Installations', icon: Wrench },
  { href: '/mgadmin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/mgadmin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/mgadmin/employees', label: 'Employees', icon: Users },
];

const employeeNavItems = [
  { href: '/mgadmin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mgadmin/customers', label: 'Customers', icon: UserPlus },
  { href: '/mgadmin/installations', label: 'Installations', icon: Wrench },
  { href: '/mgadmin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/mgadmin/messages', label: 'Messages', icon: MessageSquare },
];

interface AdminSidebarProps {
  isEmployee?: boolean;
}

export function AdminSidebar({ isEmployee = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = isEmployee ? employeeNavItems : adminNavItems;

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('employeeLoggedIn');
    sessionStorage.removeItem('employeeData');
    router.push(isEmployee ? '/employee-login' : '/admin-login');
  };

  return (
    <aside className="w-64 bg-primary text-white p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          </div>
          <span className="font-bold text-lg">Admin</span>
        </Link>
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

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition w-full"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </aside>
  );
}
