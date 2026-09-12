import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAgencies, approveAgency, rejectAgency } from "../api/agencies";
import { Table } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import StatusBadge from "../../../components/shared/StatusBadge";
import { useState } from "react";
import { Check, X, Eye } from "lucide-react";
import type { AdminAgency } from "../types";

export default function AgenciesTable() {
  const [search, setSearch] = useState("");
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["agencies", search],
    queryFn: () => getAgencies({ search, limit: 20 }),
  });

  const approve = useMutation({
    mutationFn: approveAgency,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["agencies"] }),
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectAgency(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["agencies"] }),
  });

  const agencies = (data?.data.data ?? []) as AdminAgency[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agencies</h1>
          <p className="text-muted-foreground">Manage travel agency registrations</p>
        </div>
        <Input
          placeholder="Search agencies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Agency</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Tier</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : agencies.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No agencies found</td></tr>
            ) : (
              agencies.map((agency) => (
                <tr key={agency.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium">{agency.agencyName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{agency.businessContact}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="outline" className="capitalize">{agency.subscriptionTier}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={agency.status} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {agency.status === "pending_verification" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => approve.mutate(agency.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              const reason = prompt("Rejection reason:");
                              if (reason) reject.mutate({ id: agency.id, reason });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="h-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}