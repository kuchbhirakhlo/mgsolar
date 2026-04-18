import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: Request, { params }: { params: Promise<{ mobile: string }> }) {
  try {
    const { mobile } = await params;
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    const customersRef = collection(db, 'customers');
    let q = query(customersRef, where('mobileNumber', '==', mobile));

    // If employee ID is provided, filter by createdBy field as well
    if (employeeId) {
      q = query(customersRef, where('mobileNumber', '==', mobile), where('createdBy', '==', employeeId));
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({
        success: false,
        error: 'Customer not found'
      }, { status: 404 });
    }

    const customer = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };

    return NextResponse.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch customer',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}