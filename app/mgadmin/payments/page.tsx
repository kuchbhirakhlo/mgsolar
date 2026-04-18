'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { getCustomerByMobile, getAllCustomers, addPayment, getPayments, updatePayment, deletePayment } from '@/lib/firebase-service';
import type { Customer, Payment } from '@/lib/types';



export default function AdminPaymentsPage() {
  const router = useRouter();
  const [isEmployee, setIsEmployee] = useState(false);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const { isLoading, submitForm } = useFormSubmit();
  const [mobileNumber, setMobileNumber] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    firstPayment: '',
    secondPayment: '',
    thirdPayment: '',
    modeOfPayment: '',
    transactionId: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const employeeDataStr = sessionStorage.getItem('employeeData');
    if (employeeDataStr) {
      const empData = JSON.parse(employeeDataStr);
      setIsEmployee(true);
      setEmployeeData(empData);
    }

    // Load customers and payments from Firebase
    const loadData = async () => {
      try {
        // Load all customers first
        const allCustomers = await getAllCustomers();
        let filteredCustomers = allCustomers;

        if (employeeDataStr) {
          const empData = JSON.parse(employeeDataStr);
          // Filter customers created by this employee
          filteredCustomers = allCustomers.filter((c: Customer) => c.createdBy === empData.empId);
        }

        setCustomers(filteredCustomers);

        // Load payments
        const allPayments = await getPayments();
        let filteredPayments = allPayments;

        if (employeeDataStr) {
          // Filter payments for customers created by this employee
          const employeeCustomerIds = filteredCustomers.map(c => c.id);
          filteredPayments = allPayments.filter((p: Payment) => employeeCustomerIds.includes(p.customerId));
        }

        setPayments(filteredPayments);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data');
      }
    };

    loadData();
  }, []);

  const fetchCustomer = async () => {
    if (!mobileNumber.trim()) {
      setErrors({ mobile: 'Mobile number is required' });
      return;
    }
    try {
      // Pass employee ID if user is an employee
      const employeeId = employeeData ? employeeData.empId : undefined;
      const found = await getCustomerByMobile(mobileNumber, employeeId);
      if (found) {
        setCustomer(found);
        setErrors({});
      } else {
        setErrors({ mobile: 'Customer not found' });
        setCustomer(null);
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      if (!(error instanceof Error) || error.name !== 'AbortError') {
        setErrors({ mobile: 'Error fetching customer' });
        setCustomer(null);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstPayment.trim()) newErrors.firstPayment = 'First payment is required';
    if (!formData.modeOfPayment.trim()) newErrors.modeOfPayment = 'Mode of payment is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (payment: Payment) => {
    const cust = customers.find(c => c.id === payment.customerId);
    setCustomer(cust || null);
    setSelectedPayment(payment);
    setFormData({
      firstPayment: payment.firstPayment,
      secondPayment: payment.secondPayment,
      thirdPayment: payment.thirdPayment,
      modeOfPayment: payment.modeOfPayment,
      transactionId: payment.transactionId,
      notes: payment.notes,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePayment(id);
        // Firebase onSnapshot or reload would be better, but for now just filter locally
        const updatedPayments = payments.filter(p => p.id !== id);
        setPayments(updatedPayments);
      } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Error deleting payment');
      }
    }
  };

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setViewDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitPayment = async () => {
      try {
        if (isEditing && selectedPayment) {
          await updatePayment(selectedPayment.id, { ...selectedPayment, ...formData });
          // Update local state
          const updatedPayments = payments.map(p => p.id === selectedPayment.id ? { ...selectedPayment, ...formData } : p);
          setPayments(updatedPayments);
        } else {
          const newPaymentData = {
            customerId: customer!.id,
            customerName: customer!.customerName,
            projectCost: customer!.dealPrice,
            ...formData,
            createdAt: new Date().toISOString(),
          };
          const paymentId = await addPayment(newPaymentData);
          // Add to local state with the generated ID
          const newPayment: Payment = {
            id: paymentId,
            ...newPaymentData,
          };
          const updatedPayments = [newPayment, ...payments];
          setPayments(updatedPayments);
        }

        setFormData({
          firstPayment: '',
          secondPayment: '',
          thirdPayment: '',
          modeOfPayment: '',
          transactionId: '',
          notes: '',
        });
        setCustomer(null);
        setMobileNumber('');
        setShowForm(false);
        setIsEditing(false);
        setSelectedPayment(null);
        setErrors({});
      } catch (error) {
        console.error('Error saving payment:', error);
        throw error; // Re-throw to be caught by useFormSubmit
      }
    };

    if (!customer) {
      setErrors({ general: 'Customer must be fetched first' });
      return;
    }

    if (validateForm()) {
      submitForm(
        submitPayment,
        isEditing ? 'Payment updated successfully!' : 'Payment added successfully!'
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Payments</h1>
          <p className="text-foreground/70">Manage payment records</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Payment
        </Button>
      </div>

      {showForm && (
        <Card className="border-muted">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Payment' : 'New Payment'}</CardTitle>
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
                      <Label>Project Cost (Deal Price)</Label>
                      <Input value={customer.dealPrice} readOnly />
                    </div>
                  </div>
                </div>
              )}

              {customer && (
                <>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstPayment">First Payment *</Label>
                        <Input
                          id="firstPayment"
                          value={formData.firstPayment}
                          onChange={(e) => setFormData({ ...formData, firstPayment: e.target.value })}
                          className={errors.firstPayment ? 'border-red-500' : ''}
                        />
                        {errors.firstPayment && <p className="text-red-500 text-sm">{errors.firstPayment}</p>}
                      </div>
                      <div>
                        <Label htmlFor="secondPayment">Second Payment</Label>
                        <Input
                          id="secondPayment"
                          value={formData.secondPayment}
                          onChange={(e) => setFormData({ ...formData, secondPayment: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="thirdPayment">Third Payment</Label>
                        <Input
                          id="thirdPayment"
                          value={formData.thirdPayment}
                          onChange={(e) => setFormData({ ...formData, thirdPayment: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="modeOfPayment">Mode of Payment *</Label>
                        <Select value={formData.modeOfPayment} onValueChange={(value) => setFormData({ ...formData, modeOfPayment: value })}>
                          <SelectTrigger className={errors.modeOfPayment ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.modeOfPayment && <p className="text-red-500 text-sm">{errors.modeOfPayment}</p>}
                      </div>
                      <div>
                        <Label htmlFor="transactionId">Transaction ID</Label>
                        <Input
                          id="transactionId"
                          value={formData.transactionId}
                          onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                        isEditing ? 'Update Payment' : 'Submit Payment'
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setIsEditing(false);
                        setSelectedPayment(null);
                        setCustomer(null);
                        setMobileNumber('');
                        setFormData({
                          firstPayment: '',
                          secondPayment: '',
                          thirdPayment: '',
                          modeOfPayment: '',
                          transactionId: '',
                          notes: '',
                        });
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
          <CardTitle>Payment List</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4">
            {payments.map((payment) => {
              const cust = customers.find(c => c.id === payment.customerId);
              // Calculate due balance: Project Cost - First Payment - Second Payment - Third Payment
              const projectCost = parseFloat(payment.projectCost) || 0;
              const firstPayment = parseFloat(payment.firstPayment) || 0;
              const secondPayment = parseFloat(payment.secondPayment) || 0;
              const thirdPayment = parseFloat(payment.thirdPayment) || 0;
              const dueBalance = projectCost - firstPayment - secondPayment - thirdPayment;

              return (
                <Card key={payment.id} className="border">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{payment.customerName || cust?.customerName || `Customer ${payment.customerId.slice(-6)}`}</h3>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleView(payment)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(payment)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(payment.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><span className="font-medium">Project Cost:</span> ₹{payment.projectCost}</p>
                        <p><span className="font-medium">First Payment:</span> ₹{payment.firstPayment}</p>
                        <p><span className="font-medium">Due Balance:</span> ₹{dueBalance.toLocaleString()}</p>
                        <p><span className="font-medium">Mode:</span> {payment.modeOfPayment}</p>
                         <p><span className="font-medium">Date:</span> {new Date(payment.createdAt).toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Project Cost</TableHead>
                  <TableHead>First Payment</TableHead>
                  <TableHead>Due Balance</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => {
                  const cust = customers.find(c => c.id === payment.customerId);
                  // Calculate due balance: Project Cost - First Payment - Second Payment - Third Payment
                  const projectCost = parseFloat(payment.projectCost) || 0;
                  const firstPayment = parseFloat(payment.firstPayment) || 0;
                  const secondPayment = parseFloat(payment.secondPayment) || 0;
                  const thirdPayment = parseFloat(payment.thirdPayment) || 0;
                  const dueBalance = projectCost - firstPayment - secondPayment - thirdPayment;

                  return (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.customerName || cust?.customerName || `Customer ${payment.customerId.slice(-6)}`}</TableCell>
                      <TableCell>₹{payment.projectCost}</TableCell>
                      <TableCell>₹{payment.firstPayment}</TableCell>
                      <TableCell>₹{dueBalance.toLocaleString()}</TableCell>
                      <TableCell>{payment.modeOfPayment}</TableCell>
                       <TableCell>{new Date(payment.createdAt).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleView(payment)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(payment)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(payment.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div><strong>Customer:</strong> {selectedPayment.customerName || customers.find(c => c.id === selectedPayment.customerId)?.customerName || `Customer ${selectedPayment.customerId.slice(-6)}`}</div>
              <div><strong>Project Cost:</strong> ₹{selectedPayment.projectCost}</div>
              <div><strong>First Payment:</strong> ₹{selectedPayment.firstPayment}</div>
              <div><strong>Second Payment:</strong> ₹{selectedPayment.secondPayment || '0'}</div>
              <div><strong>Third Payment:</strong> ₹{selectedPayment.thirdPayment || '0'}</div>
              <div><strong>Due Balance:</strong> ₹{(parseFloat(selectedPayment.projectCost) - parseFloat(selectedPayment.firstPayment) - (parseFloat(selectedPayment.secondPayment) || 0) - (parseFloat(selectedPayment.thirdPayment) || 0)).toLocaleString()}</div>
              <div><strong>Mode of Payment:</strong> {selectedPayment.modeOfPayment}</div>
              <div><strong>Transaction ID:</strong> {selectedPayment.transactionId}</div>
              <div><strong>Notes:</strong> {selectedPayment.notes}</div>
              <div><strong>Date:</strong> {new Date(selectedPayment.createdAt).toLocaleDateString('en-GB')}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}