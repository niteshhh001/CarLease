"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Vehicle } from "@/lib/types";
import { CarFront, CheckCircle, ListChecks } from 'lucide-react';

interface LeaseStatusSummaryProps {
  vehicles: Vehicle[];
}

export function LeaseStatusSummary({ vehicles: initialVehicles }: LeaseStatusSummaryProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);

  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  const leasedCount = vehicles.filter(v => v.status === 'leased').length;
  const availableCount = vehicles.filter(v => v.status === 'available').length;
  const totalVehicles = vehicles.length;
  const leasedPercentage = totalVehicles > 0 ? (leasedCount / totalVehicles) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Vehicle Lease Status</CardTitle>
        <ListChecks className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{leasedCount} / {totalVehicles} Leased</div>
        <p className="text-xs text-muted-foreground mb-2">
          {availableCount} vehicles available
        </p>
        <Progress value={leasedPercentage} aria-label={`${leasedPercentage.toFixed(0)}% leased`} className="h-3 transition-all duration-500 ease-out" />
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Leased: {leasedCount}</span>
            </div>
            <div className="flex items-center">
                <CarFront className="h-4 w-4 mr-2 text-blue-500" />
                <span>Available: {availableCount}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
