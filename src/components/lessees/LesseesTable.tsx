"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Lessee, Vehicle, Payment, PaymentStatus } from "@/lib/types";
import { MoreHorizontal, Eye, DollarSign, MessageSquareWarning, ArrowUpDown, Filter } from "lucide-react";

import { LesseeDetailModal } from "./LesseeDetailModal";
import { SimulatePaymentDialog } from "./SimulatePaymentDialog";
import { AIReminderDialog } from "./AIReminderDialog";

interface LesseesTableProps {
  lessees: Lessee[];
  vehicles: Vehicle[];
  onPaymentSimulated: (lesseeId: string, payment: Omit<Payment, 'id' | 'lesseeId'>) => void;
  initialSelectedLesseeId?: string | null;
}

type SortKey = keyof Pick<Lessee, 'name' | 'email'> | 'vehicleInfo' | 'currentPaymentStatus';

export function LesseesTable({ lessees: initialLessees, vehicles: initialVehicles, onPaymentSimulated, initialSelectedLesseeId }: LesseesTableProps) {
  const [lessees, setLessees] = useState(initialLessees);
  const [vehicles, setVehicles] = useState(initialVehicles);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus[]>([]);

  const [selectedLesseeForModal, setSelectedLesseeForModal] = useState<Lessee | null>(null);
  const [selectedLesseeForPayment, setSelectedLesseeForPayment] = useState<Lessee | null>(null);
  const [selectedLesseeForAI, setSelectedLesseeForAI] = useState<Lessee | null>(null);
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    setLessees(initialLessees);
  }, [initialLessees]);

  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);
  
  useEffect(() => {
    if (initialSelectedLesseeId) {
      const lessee = initialLessees.find(l => l.id === initialSelectedLesseeId);
      if (lessee) {
        setSelectedLesseeForModal(lessee);
        setIsDetailModalOpen(true);
      }
    }
  }, [initialSelectedLesseeId, initialLessees]);


  const getVehicleInfo = (vehicleId: string | null) => {
    if (!vehicleId) return "N/A";
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : "N/A";
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const toggleStatusFilter = (status: PaymentStatus) => {
    setStatusFilter(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const paymentStatuses: PaymentStatus[] = ['Paid', 'Pending', 'Overdue'];

  const filteredAndSortedLessees = useMemo(() => {
    let filtered = [...lessees];

    if (searchTerm) {
      filtered = filtered.filter(lessee =>
        lessee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lessee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lessee.vehicleId && getVehicleInfo(lessee.vehicleId).toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter(lessee => lessee.currentPaymentStatus && statusFilter.includes(lessee.currentPaymentStatus));
    }
    
    // Augment with vehicleInfo for sorting before actual sort
    const augmentedForSort = filtered.map(l => ({ ...l, vehicleInfo: getVehicleInfo(l.vehicleId) }));


    augmentedForSort.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      // Handle undefined or null for currentPaymentStatus explicitly
      if (sortKey === 'currentPaymentStatus') {
        valA = a.currentPaymentStatus ?? '';
        valB = b.currentPaymentStatus ?? '';
      }


      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      // Add more type checks if other data types are involved in sorting
      return 0;
    });
    return augmentedForSort;
  }, [lessees, searchTerm, sortKey, sortOrder, statusFilter, vehicles]);


  const selectedVehicleForModal = selectedLesseeForModal?.vehicleId ? vehicles.find(v => v.id === selectedLesseeForModal.vehicleId) : null;

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
        <Input
          placeholder="Search lessees (name, email, vehicle)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter by Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {paymentStatuses.map(status => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilter.includes(status)}
                onCheckedChange={() => toggleStatusFilter(status)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                { key: 'name', label: 'Name' },
                { key: 'vehicleInfo', label: 'Vehicle' },
                { key: 'email', label: 'Email' },
                { key: 'currentPaymentStatus', label: 'Status' },
              ].map(header => (
                 <TableHead key={header.key} onClick={() => handleSort(header.key as SortKey)} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center">
                    {header.label}
                    {sortKey === header.key && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedLessees.length > 0 ? (
              filteredAndSortedLessees.map((lessee) => (
              <TableRow key={lessee.id}>
                <TableCell className="font-medium">{lessee.name}</TableCell>
                <TableCell>{getVehicleInfo(lessee.vehicleId)}</TableCell>
                <TableCell>{lessee.email}</TableCell>
                <TableCell>
                  <Badge 
                     variant={
                        lessee.currentPaymentStatus === 'Paid' ? 'default' : 
                        lessee.currentPaymentStatus === 'Overdue' ? 'destructive' : 'secondary'
                      }
                      className="capitalize"
                      style={{
                        backgroundColor: lessee.currentPaymentStatus === 'Paid' ? 'hsl(var(--chart-2))' : lessee.currentPaymentStatus === 'Pending' ? 'hsl(var(--chart-4))' : lessee.currentPaymentStatus === 'Overdue' ? 'hsl(var(--destructive))' : 'hsl(var(--muted))',
                        color: lessee.currentPaymentStatus ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))'
                     }}
                  >
                    {lessee.currentPaymentStatus || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedLesseeForModal(lessee);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedLesseeForPayment(lessee);
                          setIsPaymentModalOpen(true);
                        }}
                      >
                        <DollarSign className="mr-2 h-4 w-4" /> Simulate Payment
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedLesseeForAI(lessee);
                          setIsAIModalOpen(true);
                        }}
                      >
                        <MessageSquareWarning className="mr-2 h-4 w-4" /> AI Reminder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))): (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No lessees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <LesseeDetailModal 
        lessee={selectedLesseeForModal} 
        vehicle={selectedVehicleForModal}
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
      />
      <SimulatePaymentDialog 
        lessee={selectedLesseeForPayment} 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        onPaymentSimulated={onPaymentSimulated}
      />
      <AIReminderDialog 
        lessee={selectedLesseeForAI} 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)}
      />
    </>
  );
}
