import { useDeferredValue } from "react";
import type { Ref } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBroadcastNotification } from "../hooks/use-notifications";
import { notificationTypeValues } from "../types";
import type {
  BroadcastPayload,
  NotificationRole,
  NotificationType,
  NotificationTarget,
} from "../types";
import SegmentPreview from "./SegmentPreview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Megaphone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const broadcastSchema = z
  .object({
    type: z.enum(notificationTypeValues),
    target: z.enum(["all", "role", "user"]),
    role: z.enum(["traveler", "agency"]).optional(),
    userId: z.string().optional(),
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title must be 200 characters or fewer"),
    body: z
      .string()
      .trim()
      .min(1, "Message is required")
      .max(2000, "Message must be 2000 characters or fewer"),
  })
  .superRefine((values, context) => {
    if (values.target === "role" && !values.role) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["role"],
        message: "Select a target role",
      });
    }

    if (values.target === "user" && !values.userId?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["userId"],
        message: "Enter a user ID",
      });
    }
  });

type BroadcastFormValues = z.infer<typeof broadcastSchema>;

const defaultValues: BroadcastFormValues = {
  type: "admin_broadcast",
  target: "all",
  role: undefined,
  userId: "",
  title: "",
  body: "",
};

const notificationTypeOptions = [
  { value: "admin_broadcast", label: "Admin broadcast" },
  { value: "system_alert", label: "System alert" },
  { value: "verification_status", label: "Verification status" },
  { value: "account_status", label: "Account status" },
  { value: "campaign_flagged", label: "Campaign flagged" },
] as const;

function targetLabel(target: NotificationTarget, role?: NotificationRole) {
  if (target === "role") {
    return role ? `Role: ${role}` : "Role: select";
  }

  if (target === "user") {
    return "Specific user";
  }

  return "All active users";
}

export default function BroadcastComposer() {
  const broadcast = useBroadcastNotification();
  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues,
  });
  const target = form.watch("target");
  const role = form.watch("role");
  const deferredTarget = useDeferredValue(target);
  const deferredRole = useDeferredValue(role);

  const handleTargetChange = (value: NotificationTarget) => {
    form.setValue("target", value);

    if (value !== "role") {
      form.setValue("role", undefined);
    }

    if (value !== "user") {
      form.setValue("userId", undefined);
    }
  };

  const handleRoleChange = (value: NotificationRole) => {
    form.setValue("role", value);
  };

  const onSubmit = (values: BroadcastFormValues) => {
    const payload: BroadcastPayload = {
      type: values.type,
      target: values.target,
      title: values.title.trim(),
      body: values.body.trim(),
    };

    if (values.role) {
      payload.role = values.role;
    }

    if (values.userId?.trim()) {
      payload.userId = values.userId.trim();
    }

    broadcast.mutate(payload);
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
      <Card className="rounded-xl border border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--vaykae-gradient-light)] text-[var(--vaykae-pink)]">
              <Megaphone className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <CardTitle>Broadcast composer</CardTitle>
              <CardDescription>
                Send a platform announcement to a selected audience
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification type</FormLabel>
                      <Select
                        value={
                          (field.value as NotificationType) ?? "admin_broadcast"
                        }
                        onValueChange={(value) =>
                          form.setValue("type", value as NotificationType)
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border border-border bg-[var(--input-background)]">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {notificationTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target audience</FormLabel>
                      <Select
                        value={(field.value as string) ?? ""}
                        onValueChange={handleTargetChange}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border border-border bg-[var(--input-background)]">
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All active users</SelectItem>
                          <SelectItem value="role">Role segment</SelectItem>
                          <SelectItem value="user">Specific user</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {target === "role" && (
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target role</FormLabel>
                        <Select
                          value={
                            (field.value as NotificationRole | undefined) ?? ""
                          }
                          onValueChange={handleRoleChange}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl border border-border bg-[var(--input-background)]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="traveler">Travelers</SelectItem>
                            <SelectItem value="agency">Agencies</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {target === "user" && (
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>User ID</FormLabel>
                        <FormControl>
                          <Input
                            name={field.name}
                            value={(field.value as string) ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref as Ref<HTMLInputElement>}
                            placeholder="Enter the user ID"
                            className="rounded-xl border border-border bg-[var(--input-background)] font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-4">
                      <FormLabel>Title</FormLabel>
                      <span className="text-xs text-muted-foreground">
                        {(field.value as string).length}/200
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        name={field.name}
                        value={(field.value as string) ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref as Ref<HTMLInputElement>}
                        placeholder="e.g. Scheduled platform maintenance"
                        className="rounded-xl border border-border bg-[var(--input-background)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-4">
                      <FormLabel>Message</FormLabel>
                      <span className="text-xs text-muted-foreground">
                        {(field.value as string).length}/2000
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        name={field.name}
                        value={(field.value as string) ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref as Ref<HTMLTextAreaElement>}
                        placeholder="Write the notification message..."
                        className="min-h-32 resize-none rounded-xl border border-border bg-[var(--input-background)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {broadcast.isPending && (
                <Alert variant="info">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertTitle>Sending broadcast</AlertTitle>
                  <AlertDescription>
                    Please keep this page open while the notification is
                    delivered.
                  </AlertDescription>
                </Alert>
              )}

              {broadcast.isError && (
                <Alert variant="destructive">
                  <AlertTitle>Broadcast failed</AlertTitle>
                  <AlertDescription>
                    {broadcast.error.message ||
                      "The notification could not be sent."}
                  </AlertDescription>
                </Alert>
              )}

              {broadcast.isSuccess && broadcast.data && (
                <Alert variant="success">
                  <AlertTitle>Broadcast sent</AlertTitle>
                  <AlertDescription>
                    {broadcast.data.data.sentCount} delivered
                    {broadcast.data.data.failedCount > 0
                      ? `, ${broadcast.data.data.failedCount} failed`
                      : ""}
                    .
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
                <p className="text-xs text-muted-foreground">
                  Target: {targetLabel(target, role)}
                </p>
                <Button
                  type="submit"
                  disabled={broadcast.isPending || form.formState.isSubmitting}
                  className="rounded-xl"
                >
                  {broadcast.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      <Megaphone className="mr-2 h-4 w-4" />
                      Send broadcast
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <SegmentPreview
        target={deferredTarget}
        role={deferredTarget === "role" ? deferredRole : undefined}
        userId={
          deferredTarget === "user"
            ? (form.watch("userId") ?? undefined)
            : undefined
        }
      />
    </div>
  );
}
