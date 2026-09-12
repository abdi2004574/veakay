import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWithdrawals, reviewWithdrawal } from '../api/payments';
import { Table } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import StatusBadge from '../../../components/shared/StatusBadge';
import { useState } from 'react';
import type { AdminWithdrawal } from '../types';
import { Check, X } from 'lucide-react';

export default function PaymentsTable() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['withdrawals', statusFilter],
    queryFn: () => getWithdrawals(statusFilter ? { status: statusFilter as 'requested' | 'approved' | 'rejected' | 'paid' } : undefined),
  });

  const review = useMutation({
    mutationFn: ({ id, decision, reason }: { id: string; decision: 'approved' | 'rejected'; reason?: string }) =>
      reviewWithdrawal(id, decision, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['withdrawals'] }),
  });

  const withdrawals = (data?.data.data ?? []) as AdminWithdrawal[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Withdrawals</h1>
          <p className="text-muted-foreground">Review and process withdrawal requests</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="requested">Requested</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Requested</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : withdrawals.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No withdrawals found</td></tr>
            ) : (
              withdrawals.map((w) => (
                <tr key={w.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium">{w.user.displayName}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: w.currency }).format(w.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={w.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(w.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {w.status === 'requested' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => review.mutate({ id: w.id, decision: 'approved' })}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            const reason = prompt('Rejection reason:') || undefined;
                            review.mutate({ id: w.id, decision: 'rejected', reason });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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
