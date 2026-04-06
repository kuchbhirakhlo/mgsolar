import { db, storage } from './firebase'
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
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import type { Project, Brand, ContactMessage, CareerApplication } from './types'

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
