'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Eye, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useFormSubmit } from '@/hooks/use-form-submit';

interface Customer {
  id: string;
  customerName: string;
  address: string;
  mobileNumber: string;
  panelCompanyName: string;
  inverterCompanyName: string;
  // other fields
}

interface Installation {
  id: string;
  customerId: string;
  installerName: string;
  panelSerialNumbers: string[];
  photo?: File;
  latitude?: number;
  longitude?: number;
  specialNotes: string;
  createdAt: string;
}

export default function AdminInstallationsPage() {
  const router = useRouter();
  const [isEmployee, setIsEmployee] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    installerName: '',
    panelSerialNumbers: [''],
    specialNotes: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isLoading, submitForm } = useFormSubmit();

  useEffect(() => {
    const employeeData = sessionStorage.getItem('employeeData');
    if (employeeData) {
      setIsEmployee(true);
    }
    // Load customers and installations
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
    const savedInstallations = localStorage.getItem('installations');
    if (savedInstallations) {
      setInstallations(JSON.parse(savedInstallations));
    }
  }, []);

  const fetchCustomer = () => {
    if (!mobileNumber.trim()) {
      setErrors({ mobile: 'Mobile number is required' });
      return;
    }
    const found = customers.find(c => c.mobileNumber === mobileNumber);
    if (found) {
      setCustomer(found);
      setErrors({});
    } else {
      setErrors({ mobile: 'Customer not found' });
      setCustomer(null);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      // Get geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          },
          (err) => console.log('Geolocation error:', err)
        );
      }
    }
  };

  const addSerialNumber = () => {
    if (formData.panelSerialNumbers.length < 10) {
      setFormData({
        ...formData,
        panelSerialNumbers: [...formData.panelSerialNumbers, ''],
      });
    }
  };

  const removeSerialNumber = (index: number) => {
    if (formData.panelSerialNumbers.length > 1) {
      setFormData({
        ...formData,
        panelSerialNumbers: formData.panelSerialNumbers.filter((_, i) => i !== index),
      });
    }
  };

  const updateSerialNumber = (index: number, value: string) => {
    const newSerials = [...formData.panelSerialNumbers];
    newSerials[index] = value;
    setFormData({ ...formData, panelSerialNumbers: newSerials });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.installerName.trim()) newErrors.installerName = 'Installer name is required';
    if (formData.panelSerialNumbers.some(s => !s.trim())) newErrors.serials = 'All serial numbers must be filled';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (installation: Installation) => {
    const cust = customers.find(c => c.id === installation.customerId);
    setCustomer(cust || null);
    setSelectedInstallation(installation);
    setFormData({
      installerName: installation.installerName,
      panelSerialNumbers: installation.panelSerialNumbers,
      specialNotes: installation.specialNotes,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this installation?')) {
      const updatedInstallations = installations.filter(i => i.id !== id);
      setInstallations(updatedInstallations);
      localStorage.setItem('installations', JSON.stringify(updatedInstallations));
    }
  };

  const handleView = (installation: Installation) => {
    setSelectedInstallation(installation);
    setViewDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitInstallation = async () => {
      if (isEditing && selectedInstallation) {
        const updatedInstallation: Installation = {
          ...selectedInstallation,
          installerName: formData.installerName,
          panelSerialNumbers: formData.panelSerialNumbers.filter(s => s.trim()),
          photo: photo || selectedInstallation.photo,
          latitude: location?.latitude || selectedInstallation.latitude,
          longitude: location?.longitude || selectedInstallation.longitude,
          specialNotes: formData.specialNotes,
        };
        const updatedInstallations = installations.map(i => i.id === selectedInstallation.id ? updatedInstallation : i);
        setInstallations(updatedInstallations);
        localStorage.setItem('installations', JSON.stringify(updatedInstallations));
      } else {
        const newInstallation: Installation = {
          id: Date.now().toString(),
          customerId: customer!.id,
          installerName: formData.installerName,
          panelSerialNumbers: formData.panelSerialNumbers.filter(s => s.trim()),
          photo: photo || undefined,
          latitude: location?.latitude,
          longitude: location?.longitude,
          specialNotes: formData.specialNotes,
          createdAt: new Date().toISOString(),
        };
        const updatedInstallations = [newInstallation, ...installations];
        setInstallations(updatedInstallations);
        localStorage.setItem('installations', JSON.stringify(updatedInstallations));
      }

      setFormData({
        installerName: '',
        panelSerialNumbers: [''],
        specialNotes: '',
      });
      setPhoto(null);
      setLocation(null);
      setCustomer(null);
      setMobileNumber('');
      setShowForm(false);
      setIsEditing(false);
      setSelectedInstallation(null);
    };

    if (!customer) {
      setErrors({ general: 'Customer must be fetched first' });
      return;
    }

    if (validateForm()) {
      submitForm(
        submitInstallation,
        isEditing ? 'Installation updated successfully!' : 'Installation added successfully!'
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Installations</h1>
          <p className="text-foreground/70">Manage installation records</p>
        </div>
        {!isEmployee && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Installation
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-muted">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Installation' : 'New Installation'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="mobileNumber">Customer Mobile Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className={errors.mobile ? 'border-red-500' : ''}
                  />
                  <Button type="button" onClick={fetchCustomer} variant="outline">
                    Fetch Customer
                  </Button>
                </div>
                {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
              </div>

              {customer && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input value={customer.customerName} readOnly />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Input value={customer.address} readOnly />
                    </div>
                    <div>
                      <Label>Mobile</Label>
                      <Input value={customer.mobileNumber} readOnly />
                    </div>
                    <div>
                      <Label>Panel Company</Label>
                      <Input value={customer.panelCompanyName} readOnly />
                    </div>
                    <div>
                      <Label>Inverter Company</Label>
                      <Input value={customer.inverterCompanyName} readOnly />
                    </div>
                  </div>
                </div>
              )}

              {customer && (
                <>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Installation Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="installerName">Installer Name *</Label>
                        <Input
                          id="installerName"
                          value={formData.installerName}
                          onChange={(e) => setFormData({ ...formData, installerName: e.target.value })}
                          className={errors.installerName ? 'border-red-500' : ''}
                        />
                        {errors.installerName && <p className="text-red-500 text-sm">{errors.installerName}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Panel Serial Numbers *</h3>
                    {formData.panelSerialNumbers.map((serial, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={serial}
                          onChange={(e) => updateSerialNumber(index, e.target.value)}
                          placeholder={`Serial ${index + 1}`}
                        />
                        {formData.panelSerialNumbers.length > 1 && (
                          <Button type="button" onClick={() => removeSerialNumber(index)} variant="outline" size="sm">
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {formData.panelSerialNumbers.length < 10 && (
                      <Button type="button" onClick={addSerialNumber} variant="outline" size="sm">
                        <Plus className="w-4 h-4" /> Add Serial Number
                      </Button>
                    )}
                    {errors.serials && <p className="text-red-500 text-sm">{errors.serials}</p>}
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Geotagged Photo</h3>
                    <Input type="file" accept="image/*" onChange={handlePhotoChange} />
                    {location && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Location: {location.latitude}, {location.longitude}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="specialNotes">Special Notes</Label>
                    <Textarea
                      id="specialNotes"
                      value={formData.specialNotes}
                      onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {isEditing ? 'Updating...' : 'Submitting...'}
                        </>
                      ) : (
                        isEditing ? 'Update Installation' : 'Submit Installation'
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setIsEditing(false);
                        setSelectedInstallation(null);
                        setCustomer(null);
                        setMobileNumber('');
                        setFormData({
                          installerName: '',
                          panelSerialNumbers: [''],
                          specialNotes: '',
                        });
                        setPhoto(null);
                        setLocation(null);
                        setErrors({});
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-muted">
        <CardHeader>
          <CardTitle>Installation List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Installer Name</TableHead>
                <TableHead>Panel Serials</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {installations.map((inst) => {
                const cust = customers.find(c => c.id === inst.customerId);
                return (
                  <TableRow key={inst.id}>
                    <TableCell>{cust?.customerName || 'Unknown'}</TableCell>
                    <TableCell>{inst.installerName}</TableCell>
                    <TableCell>{inst.panelSerialNumbers.length}</TableCell>
                    <TableCell>{new Date(inst.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleView(inst)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(inst)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {!isEmployee && (
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(inst.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Installation Details</DialogTitle>
          </DialogHeader>
          {selectedInstallation && (
            <div className="space-y-4">
              <div><strong>Customer:</strong> {customers.find(c => c.id === selectedInstallation.customerId)?.customerName}</div>
              <div><strong>Installer:</strong> {selectedInstallation.installerName}</div>
              <div><strong>Panel Serials:</strong> {selectedInstallation.panelSerialNumbers.join(', ')}</div>
              <div><strong>Special Notes:</strong> {selectedInstallation.specialNotes}</div>
              <div><strong>Date:</strong> {new Date(selectedInstallation.createdAt).toLocaleDateString()}</div>
              {selectedInstallation.latitude && <div><strong>Location:</strong> {selectedInstallation.latitude}, {selectedInstallation.longitude}</div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}