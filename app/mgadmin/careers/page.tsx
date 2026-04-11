'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCareerApplications } from '@/lib/firebase-service'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { CareerApplication } from '@/lib/types'

export default function AdminCareersPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<(CareerApplication & { id: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const employeeData = sessionStorage.getItem('employeeData');
    if (employeeData) {
      router.push('/mgadmin');
      return;
    }
    
    const loadApplications = async () => {
      try {
        const data = await getCareerApplications()
        setApplications(data)
      } catch (error) {
        console.error('Error loading applications:', error)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
          Career Applications
        </h1>
        <p className="text-muted-foreground">Manage job applications</p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {applications.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No applications yet</p>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">{app.email}</p>
                      <p className="text-sm text-muted-foreground">{app.phone}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded">
                      {app.position}
                    </span>
                  </div>
                  <p className="text-sm">{app.message}</p>
                  {app.resume && (
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(app.resume, '_blank')}
                      >
                        View Resume
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Applied: {new Date(app.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
