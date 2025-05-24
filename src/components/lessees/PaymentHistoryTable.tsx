"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Payment } from "@/lib/types";
import { format } from 'date-fns';

interface PaymentHistoryTableProps {
  payments: Payment[];
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  if (!payments || payments.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">No payment history available.</p>;
  }

  return (
    <Table>
      <TableCaption>A list of recent payments.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{format(new Date(payment.date), 'PP')}</TableCell>
            <TableCell>${payment.amount.toFixed(2)}</TableCell>
            <TableCell>
              <Badge 
                variant={
                  payment.status === 'Paid' ? 'default' : 
                  payment.status === 'Overdue' ? 'destructive' : 'secondary'
                }
                className="bg-green-500 data-[status=Paid]:bg-green-500 data-[status=Pending]:bg-yellow-500 data-[status=Overdue]:bg-red-500 text-white capitalize"
                // Custom styling for badges based on status
                style={{
                    backgroundColor: payment.status === 'Paid' ? 'hsl(var(--chart-2))' : payment.status === 'Pending' ? 'hsl(var(--chart-4))' : 'hsl(var(--destructive))',
                    color: payment.status === 'Paid' ? 'hsl(var(--primary-foreground))' : payment.status === 'Pending' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--destructive-foreground))'
                }}
              >
                {payment.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
