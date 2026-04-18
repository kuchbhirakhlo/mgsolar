import { db, storage, auth } from './firebase'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import type { Project, Brand, ContactMessage, CareerApplication, Employee, Customer, Payment } from './types'

// Projects
export async function addProject(project: Omit<Project, 'id'>) {
  const docRef = await addDoc(collection(db, 'projects'), {
    ...project,
    createdAt: new Date(),
  })
  return docRef.id
}

export async function getProjects() {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Project & { id: string })[]
}

export async function updateProject(id: string, project: Partial<Project>) {
  await updateDoc(doc(db, 'projects', id), project)
}

export async function deleteProject(id: string) {
  await deleteDoc(doc(db, 'projects', id))
}

// Brands
export async function addBrand(brand: Omit<Brand, 'id'>) {
  const docRef = await addDoc(collection(db, 'brands'), {
    ...brand,
    createdAt: new Date(),
  })
  return docRef.id
}

export async function getBrands() {
  const q = query(collection(db, 'brands'), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Brand & { id: string })[]
}

export async function updateBrand(id: string, brand: Partial<Brand>) {
  await updateDoc(doc(db, 'brands', id), brand)
}

export async function deleteBrand(id: string) {
  await deleteDoc(doc(db, 'brands', id))
}

// Contact Messages
export async function addContactMessage(message: Omit<ContactMessage, 'id'>) {
  const docRef = await addDoc(collection(db, 'contactMessages'), {
    ...message,
    createdAt: new Date(),
    read: false,
  })
  return docRef.id
}

export async function getContactMessages() {
  const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (ContactMessage & { id: string })[]
}

export async function markMessageAsRead(id: string) {
  await updateDoc(doc(db, 'contactMessages', id), { read: true })
}

export async function deleteContactMessage(id: string) {
  await deleteDoc(doc(db, 'contactMessages', id))
}

// Career Applications
export async function addCareerApplication(application: Omit<CareerApplication, 'id'>) {
  const docRef = await addDoc(collection(db, 'careerApplications'), {
    ...application,
    createdAt: new Date(),
  })
  return docRef.id
}

export async function getCareerApplications() {
  const q = query(collection(db, 'careerApplications'), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (CareerApplication & { id: string })[]
}

// File uploads
export async function uploadFile(folder: string, file: File): Promise<string> {
  const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function deleteFile(fileUrl: string) {
  try {
    const storageRef = ref(storage, fileUrl)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}

// Employees
export async function addEmployee(employee: Omit<Employee, 'id'>) {
  const docRef = await addDoc(collection(db, 'employees'), {
    ...employee,
    createdAt: new Date(),
  })
  return docRef.id
}

export async function getEmployees() {
  try {
    console.log('Fetching employees from Firestore...')
    // Temporarily remove orderBy and limit to test
    const querySnapshot = await getDocs(collection(db, 'employees'))
    console.log('Query snapshot:', querySnapshot)
    console.log('Number of docs:', querySnapshot.size)
    const employees = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Employee & { id: string })[]
    console.log('Employees data:', employees)
    return employees
  } catch (error) {
    console.error('Firebase getEmployees error:', error)
    throw new Error('Failed to fetch employees from database')
  }
}

export async function getEmployeeByEmpId(empId: string): Promise<(Employee & { id: string }) | null> {
  const q = query(collection(db, 'employees'), where('empId', '==', empId))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty) return null
  const doc = querySnapshot.docs[0]
  return { id: doc.id, ...doc.data() } as Employee & { id: string }
}

export async function getEmployeeByFirebaseUid(firebaseUid: string): Promise<(Employee & { id: string }) | null> {
  const q = query(collection(db, 'employees'), where('firebaseUid', '==', firebaseUid))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty) return null
  const doc = querySnapshot.docs[0]
  return { id: doc.id, ...doc.data() } as Employee & { id: string }
}

export async function updateEmployee(id: string, employee: Partial<Employee>) {
  await updateDoc(doc(db, 'employees', id), employee)
}

export async function blockEmployee(id: string, isBlocked: boolean) {
  await updateDoc(doc(db, 'employees', id), { isBlocked })
}

export async function resetEmployeePassword(id: string, newPassword: string = 'password123') {
  await updateDoc(doc(db, 'employees', id), { password: newPassword })
}

// Payments
export async function addPayment(payment: Omit<Payment, 'id'>) {
  const docRef = await addDoc(collection(db, 'payments'), {
    ...payment,
    createdAt: new Date(),
  })
  return docRef.id
}

export async function getPayments() {
  const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Payment & { id: string })[]
}

export async function updatePayment(id: string, payment: Partial<Payment>) {
  await updateDoc(doc(db, 'payments', id), payment)
}

export async function deletePayment(id: string) {
  await deleteDoc(doc(db, 'payments', id))
}

// Customers (for payments page to fetch customer data)
export async function getCustomerByMobile(mobileNumber: string, employeeId?: string) {
  let q = query(collection(db, 'customers'), where('mobileNumber', '==', mobileNumber))

  // If employee ID is provided, filter by createdBy field as well
  if (employeeId) {
    q = query(collection(db, 'customers'), where('mobileNumber', '==', mobileNumber), where('createdBy', '==', employeeId))
  }

  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty) return null
  const doc = querySnapshot.docs[0]
  return { id: doc.id, ...doc.data() } as Customer & { id: string }
}

export async function getAllCustomers() {
  const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Customer & { id: string })[]
}
