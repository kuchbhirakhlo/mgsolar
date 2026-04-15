'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Mail, FolderOpen, Users, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DashboardStats {
  totalProjects: number;
  totalTeamMembers: number;
  newMessages: number;
  totalCapacity: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/dashboard');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: FolderOpen,
      label: 'Total Projects',
      value: stats?.totalProjects?.toString() || '0',
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      icon: Users,
      label: 'Team Members',
      value: stats?.totalTeamMembers?.toString() || '0',
      color: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      icon: Mail,
      label: 'New Messages',
      value: stats?.newMessages?.toString() || '0',
      color: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      icon: BarChart3,
      label: 'Total Capacity (MW)',
      value: stats?.totalCapacity?.toString() || '0',
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-foreground/70">Welcome back! Here&apos;s your business overview.</p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-muted">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  {loading ? (
                    <Loader2 className={`w-4 h-4 ${stat.textColor} animate-spin`} />
                  ) : (
                    <Icon className={`w-4 h-4 ${stat.textColor}`} />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {loading ? '...' : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-muted">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-medium">New project application from Mumbai</p>
                <p className="text-sm text-foreground/70">2 hours ago</p>
              </div>
              <span className="text-accent font-medium">Pending</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-medium">Career application received</p>
                <p className="text-sm text-foreground/70">5 hours ago</p>
              </div>
              <span className="text-blue-600 font-medium">New</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System maintenance completed</p>
                <p className="text-sm text-foreground/70">1 day ago</p>
              </div>
              <span className="text-green-600 font-medium">Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
