'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useFormSubmit } from '@/hooks/use-form-submit';

interface Customer {
  id: string;
  customerName: string;
  address: string;
  mobileNumber: string;
  electricityBillNumber: string;
  kilowatt: string;
  panelCompanyName: string;
  inverterCompanyName: string;
  referredBy: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  bankName: string;
  bankAddress: string;
  quotationPrice: string;
  dealPrice: string;
  wireType: string;
  acWireBrand?: string;
  dcWireBrand?: string;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [isEmployee, setIsEmployee] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const { isLoading, submitForm } = useFormSubmit();
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    mobileNumber: '',
    electricityBillNumber: '',
    kilowatt: '',
    panelCompanyName: '',
    inverterCompanyName: '',
    referredBy: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: '',
    bankAddress: '',
    quotationPrice: '',
    dealPrice: '',
    wireType: '',
    acWireBrand: '',
    dcWireBrand: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const employeeData = sessionStorage.getItem('employeeData');
    if (employeeData) {
      setIsEmployee(true);
    }
    // Load customers from localStorage or API
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      'customerName', 'address', 'mobileNumber', 'electricityBillNumber',
      'kilowatt', 'panelCompanyName', 'inverterCompanyName', 'referredBy'
    ];

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      customerName: customer.customerName,
      address: customer.address,
      mobileNumber: customer.mobileNumber,
      electricityBillNumber: customer.electricityBillNumber,
      kilowatt: customer.kilowatt,
      panelCompanyName: customer.panelCompanyName,
      inverterCompanyName: customer.inverterCompanyName,
      referredBy: customer.referredBy,
      bankAccountNumber: customer.bankAccountNumber || '',
      bankIfscCode: customer.bankIfscCode || '',
      bankName: customer.bankName || '',
      bankAddress: customer.bankAddress || '',
      quotationPrice: customer.quotationPrice || '',
      dealPrice: customer.dealPrice || '',
      wireType: customer.wireType || '',
      acWireBrand: customer.acWireBrand || '',
      dcWireBrand: customer.dcWireBrand || '',
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const updatedCustomers = customers.filter(c => c.id !== id);
      setCustomers(updatedCustomers);
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    }
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitCustomer = async () => {
      if (isEditing && selectedCustomer) {
        const updatedCustomers = customers.map(c => c.id === selectedCustomer.id ? { ...formData, id: selectedCustomer.id } : c);
        setCustomers(updatedCustomers);
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      } else {
        const newCustomer: Customer = {
          id: Date.now().toString(),
          ...formData,
        };
        const updatedCustomers = [newCustomer, ...customers];
        setCustomers(updatedCustomers);
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      }

      setFormData({
        customerName: '',
        address: '',
        mobileNumber: '',
        electricityBillNumber: '',
        kilowatt: '',
        panelCompanyName: '',
        inverterCompanyName: '',
        referredBy: '',
        bankAccountNumber: '',
        bankIfscCode: '',
        bankName: '',
        bankAddress: '',
        quotationPrice: '',
        dealPrice: '',
        wireType: '',
        acWireBrand: '',
        dcWireBrand: '',
      });
      setShowForm(false);
      setIsEditing(false);
      setSelectedCustomer(null);
      setErrors({});
    };

    if (validateForm()) {
      submitForm(
        submitCustomer,
        isEditing ? 'Customer updated successfully!' : 'Customer added successfully!'
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Customers</h1>
          <p className="text-foreground/70">Manage customer information</p>
        </div>
        {!isEmployee && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-muted">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Customer' : 'New Customer'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className={errors.customerName ? 'border-red-500' : ''}
                  />
                  {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName}</p>}
                </div>
                <div>
                  <Label htmlFor="mobileNumber">Mobile Number *</Label>
                  <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className={errors.mobileNumber ? 'border-red-500' : ''}
                  />
                  {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>
                <div>
                  <Label htmlFor="electricityBillNumber">Electricity Bill Number *</Label>
                  <Input
                    id="electricityBillNumber"
                    name="electricityBillNumber"
                    value={formData.electricityBillNumber}
                    onChange={handleChange}
                    className={errors.electricityBillNumber ? 'border-red-500' : ''}
                  />
                  {errors.electricityBillNumber && <p className="text-red-500 text-sm">{errors.electricityBillNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="kilowatt">Kilowatt (kW) *</Label>
                  <Input
                    id="kilowatt"
                    name="kilowatt"
                    value={formData.kilowatt}
                    onChange={handleChange}
                    className={errors.kilowatt ? 'border-red-500' : ''}
                  />
                  {errors.kilowatt && <p className="text-red-500 text-sm">{errors.kilowatt}</p>}
                </div>
                <div>
                  <Label htmlFor="panelCompanyName">Panel Company Name *</Label>
                  <Input
                    id="panelCompanyName"
                    name="panelCompanyName"
                    value={formData.panelCompanyName}
                    onChange={handleChange}
                    className={errors.panelCompanyName ? 'border-red-500' : ''}
                  />
                  {errors.panelCompanyName && <p className="text-red-500 text-sm">{errors.panelCompanyName}</p>}
                </div>
                <div>
                  <Label htmlFor="inverterCompanyName">Inverter Company Name *</Label>
                  <Input
                    id="inverterCompanyName"
                    name="inverterCompanyName"
                    value={formData.inverterCompanyName}
                    onChange={handleChange}
                    className={errors.inverterCompanyName ? 'border-red-500' : ''}
                  />
                  {errors.inverterCompanyName && <p className="text-red-500 text-sm">{errors.inverterCompanyName}</p>}
                </div>
                <div>
                  <Label htmlFor="referredBy">Referred By *</Label>
                  <Input
                    id="referredBy"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleChange}
                    className={errors.referredBy ? 'border-red-500' : ''}
                  />
                  {errors.referredBy && <p className="text-red-500 text-sm">{errors.referredBy}</p>}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankAccountNumber">Account Number</Label>
                    <Input
                      id="bankAccountNumber"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankIfscCode">IFSC Code</Label>
                    <Input
                      id="bankIfscCode"
                      name="bankIfscCode"
                      value={formData.bankIfscCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankAddress">Bank Address</Label>
                    <Input
                      id="bankAddress"
                      name="bankAddress"
                      value={formData.bankAddress}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Solar Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quotationPrice">Quotation Price</Label>
                    <Input
                      id="quotationPrice"
                      name="quotationPrice"
                      type="number"
                      value={formData.quotationPrice}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dealPrice">Deal Price</Label>
                    <Input
                      id="dealPrice"
                      name="dealPrice"
                      type="number"
                      value={formData.dealPrice}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Wire Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wireType">Wire Type</Label>
                    <Select value={formData.wireType} onValueChange={(value) => handleSelectChange('wireType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select wire type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ac">AC Wire</SelectItem>
                        <SelectItem value="dc">DC Wire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.wireType === 'ac' && (
                    <div>
                      <Label htmlFor="acWireBrand">AC Wire Brand</Label>
                      <Select value={formData.acWireBrand} onValueChange={(value) => handleSelectChange('acWireBrand', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="havels">Havels</SelectItem>
                          <SelectItem value="polycab">Polycab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {formData.wireType === 'dc' && (
                    <div>
                      <Label htmlFor="dcWireBrand">DC Wire Brand</Label>
                      <Select value={formData.dcWireBrand} onValueChange={(value) => handleSelectChange('dcWireBrand', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="havels">Havels</SelectItem>
                          <SelectItem value="polycab">Polycab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isEditing ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    isEditing ? 'Update Customer' : 'Save Customer'
                  )}
                </Button>
                <Button
                  type="button"
                   onClick={() => {
                     setShowForm(false);
                     setIsEditing(false);
                     setSelectedCustomer(null);
                     setErrors({});
                   }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-muted">
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Panel Company</TableHead>
                <TableHead>Inverter Company</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.customerName}</TableCell>
                  <TableCell>{customer.mobileNumber}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{customer.panelCompanyName}</TableCell>
                  <TableCell>{customer.inverterCompanyName}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(customer)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(customer)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {!isEmployee && (
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(customer.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div><strong>Name:</strong> {selectedCustomer.customerName}</div>
              <div><strong>Address:</strong> {selectedCustomer.address}</div>
              <div><strong>Mobile:</strong> {selectedCustomer.mobileNumber}</div>
              <div><strong>Electricity Bill Number:</strong> {selectedCustomer.electricityBillNumber}</div>
              <div><strong>Kilowatt:</strong> {selectedCustomer.kilowatt} kW</div>
              <div><strong>Panel Company:</strong> {selectedCustomer.panelCompanyName}</div>
              <div><strong>Inverter Company:</strong> {selectedCustomer.inverterCompanyName}</div>
              <div><strong>Referred By:</strong> {selectedCustomer.referredBy}</div>
              <div><strong>Bank Account:</strong> {selectedCustomer.bankAccountNumber}</div>
              <div><strong>IFSC:</strong> {selectedCustomer.bankIfscCode}</div>
              <div><strong>Bank Name:</strong> {selectedCustomer.bankName}</div>
              <div><strong>Bank Address:</strong> {selectedCustomer.bankAddress}</div>
              <div><strong>Quotation Price:</strong> {selectedCustomer.quotationPrice}</div>
              <div><strong>Deal Price:</strong> {selectedCustomer.dealPrice}</div>
              <div><strong>Wire Type:</strong> {selectedCustomer.wireType}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}