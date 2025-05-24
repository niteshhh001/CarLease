import type { Vehicle, Lessee, Payment, PaymentStatus } from './types';
import { TOTAL_VEHICLES, MONTHLY_LEASE_AMOUNT } from './constants';

const vehicleMakes = ["Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Audi", "Nissan", "Volkswagen", "Hyundai", "Kia"];
const vehicleModels = ["Camry", "Civic", "F-150", "3 Series", "C-Class", "A4", "Altima", "Jetta", "Elantra", "Sportage"];

export const mockVehicles: Vehicle[] = Array.from({ length: TOTAL_VEHICLES }, (_, i) => {
  const make = vehicleMakes[i % vehicleMakes.length];
  const model = vehicleModels[i % vehicleModels.length];
  return {
    id: `V${1001 + i}`,
    make,
    model,
    year: 2020 + (i % 4),
    licensePlate: `XYZ${700 + i}`,
    status: i < 15 ? 'leased' : 'available', // 15 leased, 5 available
    imageUrl: `https://placehold.co/600x400.png?text=${make}+${model}`,
  };
});

const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah", "Ian", "Julia", "Kevin", "Laura", "Michael", "Nora", "Oscar"];
const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson"];

function getRandomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function generatePaymentHistory(lesseeId: string, registrationDate: string): {history: Payment[], status: PaymentStatus} {
  const payments: Payment[] = [];
  const regDate = new Date(registrationDate);
  const today = new Date();
  let paymentStatus: PaymentStatus = 'Paid';

  // Simulate monthly payments from registration up to potential current month
  for (let d = new Date(regDate); d <= today; d.setMonth(d.getMonth() + 1)) {
    if (d > today && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) break; // Don't generate for future full months

    const paymentDate = new Date(d);
    paymentDate.setDate(Math.min(regDate.getDate(), 28)); // Ensure payment date is consistent, max 28th
    
    // If it's for a month already passed
    if (paymentDate < new Date(today.getFullYear(), today.getMonth(), 1)) {
       payments.push({
        id: `P${Math.random().toString(36).substr(2, 9)}`,
        lesseeId,
        date: paymentDate.toISOString(),
        amount: MONTHLY_LEASE_AMOUNT,
        status: 'Paid',
      });
    } else { // Current or very recent month
      const rand = Math.random();
      if (rand < 0.6) { // 60% paid for current/recent
         payments.push({
          id: `P${Math.random().toString(36).substr(2, 9)}`,
          lesseeId,
          date: paymentDate.toISOString(),
          amount: MONTHLY_LEASE_AMOUNT,
          status: 'Paid',
        });
      } else if (rand < 0.8) { // 20% pending
        payments.push({
          id: `P${Math.random().toString(36).substr(2, 9)}`,
          lesseeId,
          date: paymentDate.toISOString(),
          amount: MONTHLY_LEASE_AMOUNT,
          status: 'Pending',
        });
        paymentStatus = 'Pending';
      } else { // 20% overdue
         payments.push({
          id: `P${Math.random().toString(36).substr(2, 9)}`,
          lesseeId,
          date: paymentDate.toISOString(),
          amount: MONTHLY_LEASE_AMOUNT,
          status: 'Overdue',
        });
        paymentStatus = 'Overdue';
      }
      // Only determine overall status based on the most recent relevant payment
      break; 
    }
  }
  
  // If no payments generated yet (e.g., newly registered this month)
  if (payments.length === 0) {
    const rand = Math.random();
      if (rand < 0.3) paymentStatus = 'Paid'; // Some might pay upfront
      else if (rand < 0.7) paymentStatus = 'Pending';
      else paymentStatus = 'Overdue'; // If registration was start of month and no payment
  }


  return { history: payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), status: paymentStatus };
}


export const mockLessees: Lessee[] = mockVehicles
  .filter(v => v.status === 'leased')
  .map((vehicle, i) => {
    const registrationDate = getRandomDate(new Date(2023, 0, 1), new Date());
    const { history, status } = generatePaymentHistory(`L${2001 + i}`, registrationDate);
    return {
      id: `L${2001 + i}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      vehicleId: vehicle.id,
      email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@example.com`,
      phone: `555-01${String(i).padStart(2, '0')}`,
      registrationDate: registrationDate,
      paymentHistory: history,
      currentPaymentStatus: status,
    };
  });

// Function to get a specific lessee's payment history
export const getLesseePayments = (lesseeId: string): Payment[] => {
  const lessee = mockLessees.find(l => l.id === lesseeId);
  return lessee ? lessee.paymentHistory : [];
};

// Function to update payment history (for simulation)
export const addPayment = (lesseeId: string, payment: Omit<Payment, 'id' | 'lesseeId'>): Lessee | undefined => {
  const lesseeIndex = mockLessees.findIndex(l => l.id === lesseeId);
  if (lesseeIndex !== -1) {
    const newPayment: Payment = {
      ...payment,
      id: `P${Math.random().toString(36).substr(2, 9)}`,
      lesseeId,
    };
    mockLessees[lesseeIndex].paymentHistory.unshift(newPayment); // Add to beginning
    // Update currentPaymentStatus based on the new payment
    if (newPayment.status === 'Paid') {
        // Check if all due payments are made. For simplicity, if latest is paid, assume good.
        mockLessees[lesseeIndex].currentPaymentStatus = 'Paid';
    } else {
        mockLessees[lesseeIndex].currentPaymentStatus = newPayment.status;
    }
    return mockLessees[lesseeIndex];
  }
  return undefined;
};

export const addLessee = (lesseeData: Omit<Lessee, 'id' | 'paymentHistory' | 'currentPaymentStatus' | 'registrationDate'>): Lessee => {
  const newLessee: Lessee = {
    ...lesseeData,
    id: `L${2001 + mockLessees.length +1}`,
    registrationDate: new Date().toISOString(),
    paymentHistory: [],
    currentPaymentStatus: 'Pending', // Default for new lessee
  };
  mockLessees.push(newLessee);
  // If a vehicleId is provided, update that vehicle's status
  if (lesseeData.vehicleId) {
    const vehicleIndex = mockVehicles.findIndex(v => v.id === lesseeData.vehicleId);
    if (vehicleIndex !== -1) {
      mockVehicles[vehicleIndex].status = 'leased';
    }
  }
  return newLessee;
};
