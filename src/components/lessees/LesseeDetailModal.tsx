"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Lessee, Vehicle } from "@/lib/types";
import { PaymentHistoryTable } from "./PaymentHistoryTable";
import { User, Mail, Phone, Car, CalendarDays, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface LesseeDetailModalProps {
  lessee: Lessee | null;
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LesseeDetailModal({ lessee, vehicle, isOpen, onClose }: LesseeDetailModalProps) {
  if (!lessee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            {lessee.name}
          </DialogTitle>
          <DialogDescription>
            Detailed information for {lessee.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 overflow-y-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-primary">Lessee Details</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center"><Mail className="h-4 w-4 mr-2 text-muted-foreground" /> Email: {lessee.email}</p>
                <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-muted-foreground" /> Phone: {lessee.phone}</p>
                <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" /> Registered: {format(new Date(lessee.registrationDate), 'PP')}</p>
              </div>
            </div>
            {vehicle && (
               <div>
                <h3 className="font-semibold mb-2 text-primary">Vehicle Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center"><Car className="h-4 w-4 mr-2 text-muted-foreground" /> Vehicle: {vehicle.make} {vehicle.model} ({vehicle.year})</p>
                  <p className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-muted-foreground" /> License: {vehicle.licensePlate}</p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold mb-2 text-primary">Payment History</h3>
            <PaymentHistoryTable payments={lessee.paymentHistory} />
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
