'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';

const initialProjects = [
  {
    id: '1',
    title: 'Residential Complex - Mumbai',
    location: 'Mumbai, Maharashtra',
    capacity: '250 kW',
    date: '2024',
  },
  {
    id: '2',
    title: 'Factory Solar Installation',
    location: 'Pune, Maharashtra',
    capacity: '500 kW',
    date: '2024',
  },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    capacity: '',
    date: new Date().getFullYear().toString(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.location && formData.capacity) {
      const newProject = {
        id: Date.now().toString(),
        ...formData,
      };
      setProjects([newProject, ...projects]);
      setFormData({ title: '', location: '', capacity: '', date: new Date().getFullYear().toString() });
      setShowForm(false);
    }
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Projects</h1>
          <p className="text-foreground/70">Manage solar installation projects</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {showForm && (
        <Card className="border-muted">
          <CardHeader>
            <CardTitle>New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                name="capacity"
                placeholder="Capacity (e.g., 250 kW)"
                value={formData.capacity}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                name="date"
                placeholder="Year"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-accent"
              />
              <div className="flex gap-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Save Project
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="border-muted">
            <CardHeader>
              <CardTitle className="text-lg text-primary">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/70">Location</span>
                <span>{project.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/70">Capacity</span>
                <span className="font-medium">{project.capacity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/70">Year</span>
                <span>{project.date}</span>
              </div>
              <div className="flex gap-2 pt-4">
                <Button size="sm" variant="outline" className="gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive gap-2"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
