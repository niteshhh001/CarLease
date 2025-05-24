"use client";

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Lessee, Vehicle } from "@/lib/types";
import { AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';

interface PendingPaymentsTableProps {
  lessees: Lessee[];
  vehicles: Vehicle[];
}

export function PendingPaymentsTable({ lessees: initialLessees, vehicles: initialVehicles }: PendingPaymentsTableProps) {
  const [lessees, setLessees] = useState(initialLessees);
  const [vehicles, setVehicles] = useState(initialVehicles);

  useEffect(() => {
    setLessees(initialLessees);
  }, [initialLessees]);
  
  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  const pendingLessees = lessees.filter(
    lessee => lessee.currentPaymentStatus === 'Pending' || lessee.currentPaymentStatus === 'Overdue'
  ).sort((a,b) => (a.currentPaymentStatus === 'Overdue' ? -1 : 1)); // Show Overdue first

  const getVehicleInfo = (vehicleId: string | null) => {
    if (!vehicleId) return "N/A";
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : "N/A";
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          Lessees with Payment Issues
        </CardTitle>
        <CardDescription>
          Lessees with pending or overdue payments requiring attention.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingLessees.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No pending or overdue payments. Well done!</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lessee Name</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingLessees.map((lessee) => (
                <TableRow key={lessee.id}>
                  <TableCell className="font-medium">{lessee.name}</TableCell>
                  <TableCell>{getVehicleInfo(lessee.vehicleId)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={lessee.currentPaymentStatus === 'Overdue' ? 'destructive' : 'secondary'}
                      className="capitalize"
                    >
                      {lessee.currentPaymentStatus === 'Overdue' && <AlertCircle className="mr-1 h-3 w-3" />}
                      {lessee.currentPaymentStatus === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                      {lessee.currentPaymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/lessees?lesseeId=${lessee.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
