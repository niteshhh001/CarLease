"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Lessee, Payment, PaymentStatus } from "@/lib/types";
import { MONTHLY_LEASE_AMOUNT } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface SimulatePaymentDialogProps {
  lessee: Lessee | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSimulated: (lesseeId: string, payment: Omit<Payment, 'id' | 'lesseeId'>) => void;
}

export function SimulatePaymentDialog({ lessee, isOpen, onClose, onPaymentSimulated }: SimulatePaymentDialogProps) {
  const [amount, setAmount] = useState(MONTHLY_LEASE_AMOUNT);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const { toast } = useToast();

  if (!lessee) return null;

  const handleSubmit = () => {
    const paymentData = {
      date: new Date().toISOString(),
      amount: Number(amount),
      status: paymentStatus,
    };
    onPaymentSimulated(lessee.id, paymentData);
    toast({
      title: "Payment Simulated",
      description: `Payment of $${amount} with status ${paymentStatus} recorded for ${lessee.name}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Simulate Payment for {lessee.name}</DialogTitle>
          <DialogDescription>
            Record a new payment for this lessee.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              defaultValue={MONTHLY_LEASE_AMOUNT}
            />
          </div>
          <div className="grid gap-2">
            <Label>Payment Status</Label>
            <RadioGroup
              defaultValue="Paid"
              value={paymentStatus}
              onValueChange={(value: PaymentStatus) => setPaymentStatus(value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Paid" id="status-paid" />
                <Label htmlFor="status-paid">Paid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Pending" id="status-pending" />
                <Label htmlFor="status-pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Overdue" id="status-overdue" />
                <Label htmlFor="status-overdue">Overdue</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
