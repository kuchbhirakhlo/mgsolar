import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    // Fetch total projects
    const projectsRef = collection(db, 'projects');
    const projectsSnapshot = await getDocs(projectsRef);
    const totalProjects = projectsSnapshot.size;

    // Fetch team members (employees + installers)
    const employeesRef = collection(db, 'employees');
    const employeesSnapshot = await getDocs(employeesRef);
    const totalTeamMembers = employeesSnapshot.size; // Assuming all employees are team members

    // Fetch new messages (unread contact messages)
    const messagesRef = collection(db, 'contact_messages');
    const unreadMessagesQuery = query(messagesRef, where('read', '==', false));
    const unreadMessagesSnapshot = await getDocs(unreadMessagesQuery);
    const newMessages = unreadMessagesSnapshot.size;

    // Fetch total capacity
    let totalCapacity = 0;
    projectsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.capacity) {
        const capacityStr = data.capacity.toString();
        // Extract number and unit
        const match = capacityStr.match(/(\d+(?:\.\d+)?)\s*(kW|MW)/i);
        if (match) {
          const value = parseFloat(match[1]);
          const unit = match[2].toLowerCase();
          if (unit === 'mw') {
            totalCapacity += value;
          } else if (unit === 'kw') {
            totalCapacity += value / 1000; // Convert kW to MW
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        totalTeamMembers,
        newMessages,
        totalCapacity: Math.round(totalCapacity * 10) / 10, // Round to 1 decimal place
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard data',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}