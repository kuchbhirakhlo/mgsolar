'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getEmployeeByFirebaseUid, getEmployeeByEmpId } from '@/lib/firebase-service';
import { PWAInstall } from '@/app/components/pwa-install';

export default function EmployeeLogin() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let emailToUse = loginId;

      // If loginId doesn't contain @, treat as employee ID
      if (!loginId.includes('@')) {
        const employeeData = await getEmployeeByEmpId(loginId);
        if (!employeeData || !employeeData.email) {
          setError('Invalid Employee ID or email');
          setLoading(false);
          return;
        }
        emailToUse = employeeData.email;
      }

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
      const firebaseUid = userCredential.user.uid;

      // Get employee data from Firestore
      const employeeData = await getEmployeeByFirebaseUid(firebaseUid);

      if (!employeeData) {
        setError('Employee account not found.');
        setLoading(false);
        return;
      }

      if (employeeData.isBlocked) {
        setError('Your account has been blocked. Contact admin.');
        setLoading(false);
        return;
      }

      if (employeeData.role !== 'employee') {
        setError('Access denied. This login is for engineers only.');
        setLoading(false);
        return;
      }

      // Store auth data in session storage
      const sessionData = {
        empId: employeeData.empId,
        name: employeeData.name,
        role: employeeData.role,
        isBlocked: employeeData.isBlocked,
        firebaseUid: firebaseUid
      };

      sessionStorage.setItem('employeeLoggedIn', 'true');
      sessionStorage.setItem('employeeData', JSON.stringify(sessionData));

      // Navigate to employee dashboard
      router.push('/mgadmin/customers');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-email') {
        setError('Invalid Employee ID, email or password');
      } else {
        setError('Login failed. Please try again.');
      }
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
            <label className="block text-sm font-medium mb-1">Employee ID or Email</label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter employee ID or email"
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

        <div className="mt-4 flex justify-center">
          <PWAInstall />
        </div>

        {/* Login Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            Use your Employee ID or email address and password provided by the admin to log in. Contact admin if you need assistance.
          </p>
        </div>

        <div className="mt-4 text-center">
          <a href="/" className="text-sm text-muted-foreground hover:underline">
            Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}