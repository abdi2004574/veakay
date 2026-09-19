import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageShell } from "@/components/shared/PageShell";
import { Plus } from "lucide-react";
import InvitesTable from "./InvitesTable";
import type { CreateAdminInviteInput } from "../types";
import { useCreateInviteMutation } from "../hooks/use-invites-mutations";

const inviteSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  acceptUrl: z
    .string()
    .trim()
    .url("Enter a valid invite link")
    .or(z.literal(""))
    .optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

function getDefaultAcceptUrl() {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/admin/invites/accept`;
}

export default function InvitesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdAcceptUrl, setCreatedAcceptUrl] = useState<string | null>(null);
  const defaultAcceptUrl = getDefaultAcceptUrl();
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      acceptUrl: defaultAcceptUrl,
    },
  });
  const createMutation = useCreateInviteMutation();

  const resetInviteForm = () => {
    setCreatedAcceptUrl(null);
    form.reset({
      email: "",
      acceptUrl: defaultAcceptUrl,
    });
  };

  const submitInvite = (values: InviteFormValues) => {
    const payload: CreateAdminInviteInput = {
      email: values.email,
      platformRole: "super_admin",
    };
    const acceptUrl = values.acceptUrl?.trim();

    if (acceptUrl && acceptUrl !== defaultAcceptUrl) {
      payload.acceptUrl = acceptUrl;
    }

    setCreatedAcceptUrl(null);
    createMutation.mutate(payload, {
      onSuccess: ({ acceptUrl: returnedAcceptUrl }) => {
        setCreatedAcceptUrl(returnedAcceptUrl);
      },
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetInviteForm();
    }
  };

  return (
    <PageShell
      title="Admin Invites"
      description="Invite and manage super admin access"
      action={
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite admin
        </Button>
      }
    >
      <InvitesTable />

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Invite a super admin</DialogTitle>
            <DialogDescription>
              Send an invitation to a verified recipient. The invite expires
              seven days after it is created.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(submitInvite)}
            className="space-y-5"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                disabled={createMutation.isPending}
                aria-invalid={Boolean(form.formState.errors.email)}
                aria-describedby={
                  form.formState.errors.email ? "invite-email-error" : undefined
                }
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p
                  id="invite-email-error"
                  className="text-sm font-medium text-destructive"
                  role="alert"
                >
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-url">Invite link (optional)</Label>
              <Input
                id="invite-url"
                type="url"
                placeholder="https://your-panel.example.com/admin/invites/accept"
                disabled={createMutation.isPending}
                aria-invalid={Boolean(form.formState.errors.acceptUrl)}
                aria-describedby={
                  form.formState.errors.acceptUrl
                    ? "invite-url-error"
                    : "invite-url-help"
                }
                {...form.register("acceptUrl")}
              />
              <p id="invite-url-help" className="text-sm text-muted-foreground">
                The panel's default acceptance URL is prefilled. Clear it to let
                the server use its default, or enter another URL when the panel
                is served from a different origin.
              </p>
              {form.formState.errors.acceptUrl && (
                <p
                  id="invite-url-error"
                  className="text-sm font-medium text-destructive"
                  role="alert"
                >
                  {form.formState.errors.acceptUrl.message}
                </p>
              )}
            </div>

            <div className="rounded-lg border bg-muted/40 p-3 text-sm">
              <span className="font-medium">Invited role:</span>{" "}
              <span className="text-muted-foreground">Super admin</span>
            </div>

            {createMutation.error && (
              <p className="text-sm font-medium text-destructive" role="alert">
                {createMutation.error.message}
              </p>
            )}

            {createdAcceptUrl && (
              <div
                className="space-y-3 rounded-lg border border-success/50 bg-success/10 p-4 text-success-foreground"
                role="status"
                aria-live="polite"
              >
                <div>
                  <p className="font-medium">Invite created</p>
                  <p className="text-sm opacity-90">
                    The invitation email has been sent. Use this one-time
                    acceptance link before it expires.
                  </p>
                </div>
                <div className="rounded-md border bg-background p-3">
                  <code className="block break-all text-sm">
                    {createdAcceptUrl}
                  </code>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Sending invite..." : "Send invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
