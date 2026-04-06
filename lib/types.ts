export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  capacity: string;
  image: string;
  date: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp?: any;
}

export interface CareerApplication {
  id?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  resume: string;
  message: string;
  timestamp?: any;
}
