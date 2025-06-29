export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
  birthDate: string;
  nationality: string;
}

export interface Dependent {
  id: string;
  guestId: string;
  name: string;
  document: string;
  birthDate: string;
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  specialNeeds?: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'standard' | 'deluxe' | 'suite';
  price: number;
  capacity: number;
  description: string;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface Booking {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalPrice: number;
  customAccommodation?: CustomAccommodation;
  dependentIds?: string[];
}

export interface AccommodationCategory {
  id: string;
  name: string;
  description: string;
  beds: number;
  suites: number;
  garage: boolean;
  basePrice: number;
  maxOccupancy: number;
  amenities: string[];
  totalUnits: number;
}

export interface AccommodationBuilder {
  category: AccommodationCategory;
  customizations: {
    extraBeds?: number;
    premiumAmenities?: string[];
    specialRequests?: string[];
  };
}

export interface CustomAccommodation {
  id: string;
  name: string;
  category: AccommodationCategory;
  customizations: {
    extraBeds?: number;
    premiumAmenities?: string[];
    specialRequests?: string[];
  };
  totalPrice: number;
  createdAt: string;
}

export interface DashboardStats {
  totalGuests: number;
  totalRooms: number;
  totalBookings: number;
  totalDependents: number;
  occupancyRate: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  revenue: number;
}