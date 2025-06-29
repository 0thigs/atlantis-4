import React, { useState, createContext, useContext, ReactNode } from 'react';
import { Guest, Room, Booking, CustomAccommodation, Dependent, AccommodationCategory } from '../types';
import { ACCOMMODATION_CATEGORIES } from '../builders/AccommodationBuilder';

interface HotelData {
  guests: Guest[];
  rooms: Room[];
  bookings: Booking[];
  customAccommodations: CustomAccommodation[];
  dependents: Dependent[];
  setGuests: (guests: Guest[]) => void;
  setRooms: (rooms: Room[]) => void;
  setBookings: (bookings: Booking[]) => void;
  setCustomAccommodations: (accommodations: CustomAccommodation[]) => void;
  setDependents: (dependents: Dependent[]) => void;
  addGuest: (guest: Guest) => void;
  addRoom: (room: Room) => void;
  addBooking: (booking: Booking) => void;
  addCustomAccommodation: (accommodation: CustomAccommodation) => void;
  addDependent: (dependent: Dependent) => void;
  updateGuest: (id: string, guest: Partial<Guest>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  updateCustomAccommodation: (id: string, accommodation: Partial<CustomAccommodation>) => void;
  updateDependent: (id: string, dependent: Partial<Dependent>) => void;
  deleteGuest: (id: string) => void;
  deleteRoom: (id: string) => void;
  deleteBooking: (id: string) => void;
  deleteCustomAccommodation: (id: string) => void;
  deleteDependent: (id: string) => void;
  getDependentsByGuestId: (guestId: string) => Dependent[];
  getAccommodationOccupancy: (categoryId: string) => { occupied: number; total: number; available: number };
  isAccommodationAvailable: (categoryId: string) => boolean;
  getAccommodationAvailability: () => { categoryId: string; category: AccommodationCategory; occupied: number; total: number; available: number }[];
}

const HotelDataContext = createContext<HotelData | undefined>(undefined);

export const HotelDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customAccommodations, setCustomAccommodations] = useState<CustomAccommodation[]>([]);
  const [dependents, setDependents] = useState<Dependent[]>([]);

  const addGuest = (guest: Guest) => {
    setGuests(prev => [...prev, guest]);
  };

  const addRoom = (room: Room) => {
    setRooms(prev => [...prev, room]);
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const addCustomAccommodation = (accommodation: CustomAccommodation) => {
    setCustomAccommodations(prev => [...prev, accommodation]);
  };

  const addDependent = (dependent: Dependent) => {
    setDependents(prev => [...prev, dependent]);
  };

  const updateGuest = (id: string, updatedGuest: Partial<Guest>) => {
    setGuests(prev => prev.map(guest =>
      guest.id === id ? { ...guest, ...updatedGuest } : guest
    ));
  };

  const updateRoom = (id: string, updatedRoom: Partial<Room>) => {
    setRooms(prev => prev.map(room =>
      room.id === id ? { ...room, ...updatedRoom } : room
    ));
  };

  const updateBooking = (id: string, updatedBooking: Partial<Booking>) => {
    setBookings(prev => prev.map(booking =>
      booking.id === id ? { ...booking, ...updatedBooking } : booking
    ));
  };

  const updateCustomAccommodation = (id: string, updatedAccommodation: Partial<CustomAccommodation>) => {
    setCustomAccommodations(prev => prev.map(accommodation =>
      accommodation.id === id ? { ...accommodation, ...updatedAccommodation } : accommodation
    ));
  };

  const updateDependent = (id: string, updatedDependent: Partial<Dependent>) => {
    setDependents(prev => prev.map(dependent =>
      dependent.id === id ? { ...dependent, ...updatedDependent } : dependent
    ));
  };

  const deleteGuest = (id: string) => {
    setGuests(prev => prev.filter(guest => guest.id !== id));
    setBookings(prev => prev.filter(booking => booking.guestId !== id));
    setDependents(prev => prev.filter(dependent => dependent.guestId !== id));
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id));
    setBookings(prev => prev.filter(booking => booking.roomId !== id));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  const deleteCustomAccommodation = (id: string) => {
    setCustomAccommodations(prev => prev.filter(accommodation => accommodation.id !== id));
  };

  const deleteDependent = (id: string) => {
    setDependents(prev => prev.filter(dependent => dependent.id !== id));
  };

  const getDependentsByGuestId = (guestId: string) => {
    return dependents.filter(dependent => dependent.guestId === guestId);
  };

  const getAccommodationOccupancy = (categoryId: string) => {
    const category = ACCOMMODATION_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) {
      return { occupied: 0, total: 0, available: 0 };
    }

    const today = new Date().toISOString().split('T')[0];
    const occupied = bookings.filter(booking => {
      const isActive = booking.status === 'confirmed' || booking.status === 'checked-in';

      const isInPeriod = booking.checkIn <= today && booking.checkOut > today;

      const usesCategory = booking.customAccommodation?.category.id === categoryId;

      return isActive && isInPeriod && usesCategory;
    }).length;

    const total = category.totalUnits;
    const available = total - occupied;

    return { occupied, total, available };
  };

  const isAccommodationAvailable = (categoryId: string) => {
    const { available } = getAccommodationOccupancy(categoryId);
    return available > 0;
  };

  const getAccommodationAvailability = () => {
    return ACCOMMODATION_CATEGORIES.map(category => {
      const { occupied, total, available } = getAccommodationOccupancy(category.id);
      return {
        categoryId: category.id,
        category,
        occupied,
        total,
        available
      };
    });
  };

  const value: HotelData = {
    guests,
    rooms,
    bookings,
    customAccommodations,
    dependents,
    setGuests,
    setRooms,
    setBookings,
    setCustomAccommodations,
    setDependents,
    addGuest,
    addRoom,
    addBooking,
    addCustomAccommodation,
    addDependent,
    updateGuest,
    updateRoom,
    updateBooking,
    updateCustomAccommodation,
    updateDependent,
    deleteGuest,
    deleteRoom,
    deleteBooking,
    deleteCustomAccommodation,
    deleteDependent,
    getDependentsByGuestId,
    getAccommodationOccupancy,
    isAccommodationAvailable,
    getAccommodationAvailability
  };

  return (
    <HotelDataContext.Provider value={value}>
      {children}
    </HotelDataContext.Provider>
  );
};

export const useHotelData = () => {
  const context = useContext(HotelDataContext);
  if (context === undefined) {
    throw new Error('useHotelData must be used within a HotelDataProvider');
  }
  return context;
}; 