import { useState } from "react";
import { PageShell } from "@/components/shared/PageShell";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import BadgesTable from "./BadgesTable";
import { useAssignBadge } from "../hooks/use-badges-mutations";
import type { AssignBadgeRequest, VerifiedBadgeSubjectType } from "../types";

const defaultSubjectType: VerifiedBadgeSubjectType = "user";

export default function BadgesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subjectType, setSubjectType] =
    useState<VerifiedBadgeSubjectType>(defaultSubjectType);
  const [subjectId, setSubjectId] = useState("");
  const assignMutation = useAssignBadge();

  const resetDialog = () => {
    setSubjectType(defaultSubjectType);
    setSubjectId("");
    assignMutation.reset();
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) resetDialog();
  };

  const submitAssign = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedSubjectId = subjectId.trim();
    if (!trimmedSubjectId) return;

    const payload: AssignBadgeRequest = {
      subjectType,
      subjectId: trimmedSubjectId,
    };
    assignMutation.mutate(payload, {
      onSuccess: () => {
        setDialogOpen(false);
        resetDialog();
      },
    });
  };

  return (
    <PageShell
      title="Verified Badges"
      description="Assign and manage verified status for trusted users and agencies"
      action={
        <Button type="button" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Assign badge
        </Button>
      }
    >
      <BadgesTable />

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign a verified badge</DialogTitle>
            <DialogDescription>
              Grant verified status to an existing user or agency. The recipient
              ID must match the selected subject type.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitAssign} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="badge-subject-type">Subject type</Label>
              <Select
                value={subjectType}
                onValueChange={(value) =>
                  setSubjectType(value as VerifiedBadgeSubjectType)
                }
              >
                <SelectTrigger id="badge-subject-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge-subject-id">Subject ID</Label>
              <Input
                id="badge-subject-id"
                value={subjectId}
                onChange={(event) => setSubjectId(event.target.value)}
                placeholder="Enter the user or agency ID"
                disabled={assignMutation.isPending}
                aria-invalid={Boolean(subjectId && !subjectId.trim())}
              />
              {subjectId && !subjectId.trim() && (
                <p
                  className="text-sm font-medium text-destructive"
                  role="alert"
                >
                  Subject ID is required.
                </p>
              )}
            </div>

            {assignMutation.error && (
              <p className="text-sm font-medium text-destructive" role="alert">
                {assignMutation.error.message}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={assignMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={assignMutation.isPending || !subjectId.trim()}
              >
                {assignMutation.isPending ? "Assigning..." : "Assign badge"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
