"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState, ErrorState, EmptyState } from "@/components/data-display";
import { useUsersList, useUpdateUserStatus } from "@/hooks/api/useUsersApi";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";
import type { AdminUser } from "@/types";
import { Search } from "lucide-react";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useUsersList({
    search: debouncedSearch,
    role: roleFilter,
    status: statusFilter,
  });

  const { mutate: updateUserStatus, isPending: isUpdating } = useUpdateUserStatus();

  const users = data?.pages.flatMap((page) => page.data) ?? [];

  const handleToggleStatus = (user: AdminUser) => {
    updateUserStatus({ id: user.id, dto: { isActive: !user.isActive } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage platform users, roles, and accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            {users.length} users found
          </CardDescription>
          <div className="flex items-center gap-3 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter ?? ""} onValueChange={(v) => setRoleFilter(v || undefined)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="traveler">Traveler</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter ?? ""} onValueChange={(v) => setStatusFilter(v || undefined)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="deactivated">Deactivated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isError && <ErrorState error={error} onRetry={() => refetch()} />}
          {isLoading && <LoadingState message="Loading users..." />}
          {!isLoading && !isError && users.length === 0 && (
            <EmptyState title="No users found" description="Try adjusting your search or filter criteria." />
          )}
          {!isLoading && !isError && users.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Platform Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.displayName || user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "success" : "destructive"}>
                          {user.isActive ? "Active" : "Deactivated"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.platformRole === "super_admin" ? "default" : "outline"}>
                          {user.platformRole}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={user.isActive ? "outline" : "default"}
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {hasNextPage && (
                <div className="border-t pt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
