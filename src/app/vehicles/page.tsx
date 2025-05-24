"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { VehiclesTable } from "@/components/vehicles/VehiclesTable";
import { mockVehicles } from "@/lib/mockData";
import type { Vehicle } from "@/lib/types";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // Simulate fetching data
    setVehicles(mockVehicles);
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight">Vehicle Fleet</h1>
        <VehiclesTable vehicles={vehicles} />
      </div>
    </AppShell>
  );
}
