'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Mail, FolderOpen, Users } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      icon: FolderOpen,
      label: 'Total Projects',
      value: '6',
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      icon: Users,
      label: 'Team Members',
      value: '12',
      color: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      icon: Mail,
      label: 'New Messages',
      value: '5',
      color: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      icon: BarChart3,
      label: 'Total Capacity (MW)',
      value: '1.8',
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-muted">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${stat.textColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
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
