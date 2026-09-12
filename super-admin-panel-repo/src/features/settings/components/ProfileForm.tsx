import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminProfile, updateAdminProfile } from "../api/settings";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { useToast } from "../../../hooks/use-toast";

export default function ProfileForm() {
  const { data, isLoading } = useQuery({ queryKey: ["admin", "profile"], queryFn: getAdminProfile });
  const qc = useQueryClient();
  const { toast } = useToast();
  const update = useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "profile"] });
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    },
  });

  const profile = data?.data?.data;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your admin profile and preferences</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-10 w-full rounded bg-muted" />
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const displayName = (form.elements.namedItem("displayName") as HTMLInputElement).value;
                update.mutate({ displayName });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile?.email ?? ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  defaultValue={profile?.displayName ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={profile?.platformRole ?? "super_admin"} disabled />
              </div>
              <Button type="submit" disabled={update.isPending}>
                {update.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
