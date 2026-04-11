'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getEmployeeByEmpId } from '@/lib/firebase-service';

export default function EmployeeLogin() {
  const router = useRouter();
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const employee = await getEmployeeByEmpId(empId);
      
      if (!employee) {
        setError('Invalid Employee ID or password');
        setLoading(false);
        return;
      }

      if (employee.isBlocked) {
        setError('Your account has been blocked. Contact admin.');
        setLoading(false);
        return;
      }

      if (employee.password !== password) {
        setError('Invalid Employee ID or password');
        setLoading(false);
        return;
      }

      sessionStorage.setItem('employeeLoggedIn', 'true');
      sessionStorage.setItem('employeeData', JSON.stringify(employee));
      router.push('/mgadmin');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/90">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Image
              src="/mgsolarlogo.png"
              alt="MG Solar Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-primary">Employee Login</h1>
          <p className="text-sm text-muted-foreground">MG Solar Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee ID</label>
            <input
              type="text"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter employee ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <a href="/" className="block text-sm text-primary hover:underline">
            Back to Website
          </a>
          <a href="/admin-login" className="block text-sm text-muted-foreground hover:underline">
            Admin Login
          </a>
        </div>
      </div>
    </div>
  );
}