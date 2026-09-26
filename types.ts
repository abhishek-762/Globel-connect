export interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
}

export enum PackageCategory {
  ADVENTURE = 'Adventure',
  FAMILY = 'Family',
  HONEYMOON = 'Honeymoon',
  CULTURAL = 'Cultural',
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface Package {
  id: number;
  name: string;
  destination: string;
  duration: string;
  price: number;
  highlights: string[];
  image: string;
  category: PackageCategory;
  description: string;
  itinerary: ItineraryItem[];
  featured?: boolean;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  location: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export interface Review {
  id: number | string;
  packageId: number; // 0 for general reviews
  author: string;
  userId?: string;
  rating: number; // Rating out of 5
  comment: string;
  packageName: string;
  createdAt?: string;
}

export interface AuditLogEntry {
  id: number | string;
  action: 'CREATE' | 'EDIT' | 'DELETE' | 'STATUS_CHANGE' | 'LOGIN';
  adminUser: string;
  details: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface BookingRecord {
  id: string;
  userId: string;
  userEmail: string;
  packageId: number;
  packageName: string;
  packageImage?: string;
  fullName: string;
  email: string;
  phone: string;
  travelers: number;
  travelDate: string;
  totalPrice: number;
  currency: string;
  activities: string[];
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  createdAt: string;
}
