import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/users";
import { Table } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { useState } from "react";

export default function UsersTable() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["users", search],
    queryFn: () => getUsers({ search, limit: 20 }),
  });

  const users = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage traveler and agency accounts</p>
        </div>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium">{user.displayName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={user.isActive ? "active" : "inactive"} />
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
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
