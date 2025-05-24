import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { LeaseStatusSummary } from "@/components/dashboard/LeaseStatusSummary";
import { PaymentSummary } from "@/components/dashboard/PaymentSummary";
import { PendingPaymentsTable } from "@/components/dashboard/PendingPaymentsTable";
import { mockVehicles, mockLessees } from "@/lib/mockData";
import type { Vehicle, Lessee } from "@/lib/types";
import { UsersRound, CarFront, DollarSign } from "lucide-react";
import { MONTHLY_LEASE_AMOUNT } from "@/lib/constants";

// Simulate fetching data for a server component
async function getDashboardData() {
  // In a real app, this would be an API call or database query
  return {
    vehicles: mockVehicles as Vehicle[],
    lessees: mockLessees as Lessee[],
  };
}

export default async function DashboardPage() {
  const { vehicles, lessees } = await getDashboardData();

  const totalLessees = lessees.length;
  const totalVehicles = vehicles.length;
  const leasedVehiclesCount = vehicles.filter(v => v.status === 'leased').length;
  
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title="Total Vehicles" 
            value={totalVehicles} 
            icon={CarFront} 
            description={`${leasedVehiclesCount} leased, ${totalVehicles - leasedVehiclesCount} available`}
          />
          <MetricCard 
            title="Active Lessees" 
            value={totalLessees} 
            icon={UsersRound} 
            description="Currently active lease agreements"
          />
          <MetricCard 
            title="Monthly Lease Rate" 
            value={`$${MONTHLY_LEASE_AMOUNT}`} 
            icon={DollarSign}
            description="Per vehicle per month"
          />
           <MetricCard 
            title="Expected Monthly Revenue" 
            value={`$${(leasedVehiclesCount * MONTHLY_LEASE_AMOUNT).toLocaleString()}`} 
            icon={DollarSign}
            description="Based on currently leased vehicles"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <LeaseStatusSummary vehicles={vehicles} />
          <PaymentSummary lessees={lessees} />
        </div>

        <div>
          <PendingPaymentsTable lessees={lessees} vehicles={vehicles} />
        </div>
      </div>
    </AppShell>
  );
}
