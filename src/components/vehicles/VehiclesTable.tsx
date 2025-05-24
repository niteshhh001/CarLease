"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Vehicle } from "@/lib/types";
import { ArrowUpDown } from "lucide-react";

interface VehiclesTableProps {
  vehicles: Vehicle[];
}

type SortKey = keyof Pick<Vehicle, 'make' | 'model' | 'year' | 'licensePlate' | 'status'>;

export function VehiclesTable({ vehicles: initialVehicles }: VehiclesTableProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("make");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "leased">("all");
  
  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = [...vehicles];

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter);
    }

    filtered.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });

    return filtered;
  }, [vehicles, searchTerm, sortKey, sortOrder, statusFilter]);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
        <Input
          placeholder="Search vehicles (make, model, license)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={(value: "all" | "available" | "leased") => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="leased">Leased</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              {[
                { key: 'make', label: 'Make' },
                { key: 'model', label: 'Model' },
                { key: 'year', label: 'Year' },
                { key: 'licensePlate', label: 'License Plate' },
                { key: 'status', label: 'Status' },
              ].map(header => (
                 <TableHead key={header.key} onClick={() => handleSort(header.key as SortKey)} className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center">
                    {header.label}
                    {sortKey === header.key && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedVehicles.length > 0 ? (
              filteredAndSortedVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <Image
                    src={vehicle.imageUrl || "https://placehold.co/100x60.png?text=No+Image"}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    width={60}
                    height={40}
                    className="rounded-md object-cover"
                    data-ai-hint={`${vehicle.make} ${vehicle.model}`}
                  />
                </TableCell>
                <TableCell>{vehicle.make}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>{vehicle.licensePlate}</TableCell>
                <TableCell>
                  <Badge variant={vehicle.status === 'leased' ? 'secondary' : 'default'}
                   className="capitalize"
                   style={{
                    backgroundColor: vehicle.status === 'leased' ? 'hsl(var(--chart-4))' : 'hsl(var(--chart-2))',
                    color: 'hsl(var(--primary-foreground))'
                   }}
                  >
                    {vehicle.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))): (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No vehicles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
