'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';

const initialBrands = [
  { id: '1', name: 'SunPower' },
  { id: '2', name: 'Canadian Solar' },
  { id: '3', name: 'JinkoSolar' },
];

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState(initialBrands);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) {
      const newBrand = {
        id: Date.now().toString(),
        name: formData.name,
      };
      setBrands([newBrand, ...brands]);
      setFormData({ name: '' });
      setShowForm(false);
    }
  };

  const handleDelete = (id: string) => {
    setBrands(brands.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Partner Brands</h1>
          <p className="text-foreground/70">Manage partner and supplier brands</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </Button>
      </div>

      {showForm && (
        <Card className="border-muted">
          <CardHeader>
            <CardTitle>New Brand</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Brand Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-accent"
              />
              <div className="flex gap-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Save Brand
                </Button>
                <Button type="button" onClick={() => setShowForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Card key={brand.id} className="border-muted">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">{brand.name}</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive gap-2"
                    onClick={() => handleDelete(brand.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
