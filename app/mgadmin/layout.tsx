'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/sidebar';
import { Toaster } from '@/components/ui/sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEmployee, setIsEmployee] = useState(false);

  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const employeeData = sessionStorage.getItem('employeeData');
    
    if (employeeData) {
      const employee = JSON.parse(employeeData);
      if (employee.isBlocked) {
        sessionStorage.removeItem('employeeData');
        sessionStorage.removeItem('employeeLoggedIn');
        router.push('/employee-login');
        return;
      }
      setIsEmployee(true);
      setIsLoading(false);
    } else if (adminLoggedIn) {
      setIsEmployee(false);
      setIsLoading(false);
    } else {
      router.push('/admin-login');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar isEmployee={isEmployee} />
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
