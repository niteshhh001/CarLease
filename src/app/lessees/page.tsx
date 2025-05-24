"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LesseesTable } from "@/components/lessees/LesseesTable";
import { AddLesseeDialog } from "@/components/lessees/AddLesseeDialog";
import { mockLessees, mockVehicles, addLessee as dbAddLessee, addPayment as dbAddPayment } from "@/lib/mockData";
import type { Lessee, Vehicle, Payment } from "@/lib/types";
import { useSearchParams } from "next/navigation";

export default function LesseesPage() {
  const [lessees, setLessees] = useState<Lessee[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const searchParams = useSearchParams();
  const initialSelectedLesseeId = searchParams.get("lesseeId");


  useEffect(() => {
    // Simulate fetching data
    setLessees(mockLessees);
    setVehicles(mockVehicles);
  }, []);

  const handleLesseeAdded = (lesseeData: Omit<Lessee, 'id' | 'paymentHistory' | 'currentPaymentStatus' | 'registrationDate'> & { vehicleId?: string }) => {
    const newLessee = dbAddLessee(lesseeData);
    setLessees(prevLessees => [...prevLessees, newLessee]);
    // If a vehicle was assigned, update its status in the vehicles list
    if (newLessee.vehicleId) {
      setVehicles(prevVehicles => 
        prevVehicles.map(v => 
          v.id === newLessee.vehicleId ? { ...v, status: 'leased' } : v
        )
      );
    }
  };

  const handlePaymentSimulated = (lesseeId: string, paymentData: Omit<Payment, 'id' | 'lesseeId'>) => {
    const updatedLessee = dbAddPayment(lesseeId, paymentData);
    if (updatedLessee) {
      setLessees(prevLessees => 
        prevLessees.map(l => l.id === lesseeId ? updatedLessee : l)
      );
    }
  };

  const availableVehicles = vehicles.filter(v => v.status === 'available');

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Manage Lessees</h1>
          <AddLesseeDialog 
            availableVehicles={availableVehicles} 
            onLesseeAdded={handleLesseeAdded} 
          />
        </div>
        
        <LesseesTable 
          lessees={lessees} 
          vehicles={vehicles} 
          onPaymentSimulated={handlePaymentSimulated}
          initialSelectedLesseeId={initialSelectedLesseeId}
        />
      </div>
    </AppShell>
  );
}
