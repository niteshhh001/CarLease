"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Lessee } from "@/lib/types";
import { MONTHLY_LEASE_AMOUNT } from "@/lib/constants";
import { DollarSign, TrendingUp } from 'lucide-react';

interface PaymentSummaryProps {
  lessees: Lessee[];
}

export function PaymentSummary({ lessees: initialLessees }: PaymentSummaryProps) {
  const [lessees, setLessees] = useState(initialLessees);

  useEffect(() => {
    setLessees(initialLessees);
  }, [initialLessees]);

  const totalCollected = lessees.reduce((acc, lessee) => {
    return acc + lessee.paymentHistory
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
  }, 0);

  // Calculate expected payments:
  // For each lessee, count months since registration * MONTHLY_LEASE_AMOUNT
  const today = new Date();
  const totalExpected = lessees.reduce((acc, lessee) => {
    const registrationDate = new Date(lessee.registrationDate);
    let monthsLeased = (today.getFullYear() - registrationDate.getFullYear()) * 12;
    monthsLeased -= registrationDate.getMonth();
    monthsLeased += today.getMonth();
    // If registered this month, count as 1 month if past registration day, or 0 if not yet.
    // For simplicity, let's count it as 1 if registered this month, up to current month.
    // A more precise calculation would consider days.
    // If same month and year, count as 1 month due.
    if (today.getFullYear() === registrationDate.getFullYear() && today.getMonth() === registrationDate.getMonth()){
        monthsLeased = 1;
    } else if (monthsLeased <= 0) {
        monthsLeased = 1; // At least one month expected if registered.
    } else {
        monthsLeased +=1; // Count current month as well
    }

    return acc + (monthsLeased * MONTHLY_LEASE_AMOUNT);
  }, 0);
  
  const collectedPercentage = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Lease Payment Overview</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          ${totalCollected.toLocaleString()} / ${totalExpected.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          Total collected vs. total expected
        </p>
        <Progress value={collectedPercentage} aria-label={`${collectedPercentage.toFixed(0)}% collected`} className="h-3 transition-all duration-500 ease-out" />
         <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                <span>Collected: ${totalCollected.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-red-500" />
                <span>Expected: ${totalExpected.toLocaleString()}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
