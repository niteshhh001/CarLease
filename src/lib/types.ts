export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'available' | 'leased';
  imageUrl?: string; // Optional image URL for the vehicle
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Payment {
  id: string;
  lesseeId: string;
  date: string; // ISO string date
  amount: number;
  status: PaymentStatus;
}

export interface Lessee {
  id: string;
  name: string;
  vehicleId: string | null; // Can be null if not yet assigned
  email: string;
  phone: string;
  registrationDate: string; // ISO string date
  paymentHistory: Payment[];
  // Calculated or dynamically determined status based on payment history
  currentPaymentStatus?: PaymentStatus; 
}
