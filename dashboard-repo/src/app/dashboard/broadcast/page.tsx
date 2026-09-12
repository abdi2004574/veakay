"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LoadingState, ErrorState } from "@/components/data-display";
import { useBroadcastPreview, useSendBroadcast, type BroadcastNotificationDto, type BroadcastPreviewParams } from "@/hooks/api/useNotificationsApi";
import { toast } from "sonner";
import { Send, Eye, Loader2, AlertCircle, Users, Building2, User } from "lucide-react";

const NOTIFICATION_TYPES = [
  { value: "admin_broadcast", label: "Admin Broadcast" },
  { value: "system_alert", label: "System Alert" },
  { value: "verification_status", label: "Verification Status" },
  { value: "account_status", label: "Account Status" },
  { value: "campaign_flagged", label: "Campaign Flagged" },
] as const;

const TARGET_OPTIONS = [
  { value: "all", label: "All Users", icon: Users, description: "Travelers, Agencies, and Admins" },
  { value: "role", label: "By Role", icon: Building2, description: "Target specific role" },
  { value: "user", label: "Specific User", icon: User, description: "Target single user by ID" },
] as const;

const CHANNEL_OPTIONS = [
  { value: "in_app", label: "In-App", description: "Show in notification center" },
  { value: "push", label: "Push Notification", description: "Send push to mobile devices" },
  { value: "email", label: "Email", description: "Send email notification" },
] as const;

export default function BroadcastPage() {
  const [formData, setFormData] = useState<BroadcastNotificationDto>({
    type: "admin_broadcast",
    title: "",
    body: "",
    target: "all",
    role: undefined,
    userId: undefined,
    metadata: {
      channels: ["in_app"],
    },
  });
  const [channels, setChannels] = useState<string[]>(["in_app"]);
  const [deepLinkTarget, setDeepLinkTarget] = useState("");
  const [deepLinkEntityId, setDeepLinkEntityId] = useState("");
  const [previewParams, setPreviewParams] = useState<BroadcastPreviewParams | undefined>(undefined);
  const [showPreview, setShowPreview] = useState(false);

  const { data: preview, isLoading: isPreviewLoading, isError: isPreviewError, error: previewError, refetch: refetchPreview } = useBroadcastPreview(previewParams);
  const { mutate: sendBroadcast, isPending: isSending } = useSendBroadcast();

  const handleInputChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    setChannels((prev) => checked ? [...prev, channel] : prev.filter((c) => c !== channel));
    setFormData((prev) => {
      const currentChannels = Array.isArray(prev.metadata?.channels) ? prev.metadata.channels : [];
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          channels: checked ? [...currentChannels, channel] : currentChannels.filter((c: string) => c !== channel),
        },
      };
    });
  };

  const handleTargetChange = (target: "all" | "role" | "user") => {
    setFormData((prev) => ({ ...prev, target, role: target === "role" ? prev.role : undefined, userId: target === "user" ? prev.userId : undefined }));
    setPreviewParams({ target, role: target === "role" ? formData.role : undefined });
    setShowPreview(true);
  };

  const handleRoleChange = (role: "traveler" | "agency") => {
    setFormData((prev) => ({ ...prev, role }));
    setPreviewParams((prev) => (prev ? { ...prev, role } : { target: "role", role }));
    setShowPreview(true);
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.body.trim()) errors.push("Body is required");
    if (formData.title.length > 200) errors.push("Title must be 200 characters or less");
    if (formData.body.length > 2000) errors.push("Body must be 2000 characters or less");
    if (formData.target === "role" && !formData.role) errors.push("Role is required when targeting by role");
    if (formData.target === "user" && !formData.userId?.trim()) errors.push("User ID is required when targeting specific user");
    if (channels.length === 0) errors.push("At least one channel must be selected");
    if (deepLinkTarget && !deepLinkEntityId) errors.push("Entity ID is required when deep link target is set");
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    const payload: BroadcastNotificationDto = {
      ...formData,
      metadata: {
        ...formData.metadata,
        channels,
        deepLinkTarget: deepLinkTarget || undefined,
        deepLinkEntityId: deepLinkEntityId || undefined,
      },
    };

    sendBroadcast(payload, {
      onSuccess: (response) => {
        toast.success(`Broadcast sent successfully to ${response.sentCount} users${response.failedCount > 0 ? ` (${response.failedCount} failed)` : ""}`);
        setFormData({
          type: "admin_broadcast",
          title: "",
          body: "",
          target: "all",
          role: undefined,
          userId: undefined,
          metadata: { channels: ["in_app"] },
        });
        setChannels(["in_app"]);
        setDeepLinkTarget("");
        setDeepLinkEntityId("");
        setShowPreview(false);
        setPreviewParams(undefined);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send broadcast");
      },
    });
  };

  const handlePreviewClick = () => {
    const errors = validateForm().filter((e) => !e.includes("channels"));
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }
    setPreviewParams({ target: formData.target, role: formData.role });
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Broadcast Notifications</h1>
        <p className="text-muted-foreground">Send broadcast notifications to users and agencies</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose Broadcast</CardTitle>
          <CardDescription>Create and send a broadcast notification to your audience</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Notification Type</Label>
                <Select value={formData.type} onValueChange={(v) => handleInputChange("type", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTIFICATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter notification title"
                  maxLength={200}
                  className="max-w-md"
                />
                <p className="text-xs text-muted-foreground">{formData.title.length}/200</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Message Body *</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => handleInputChange("body", e.target.value)}
                placeholder="Enter notification message"
                maxLength={2000}
                rows={4}
                className="max-w-2xl"
              />
              <p className="text-xs text-muted-foreground text-right">{formData.body.length}/2000</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="font-medium">Target Audience</Label>
              <div className="grid gap-3 md:grid-cols-3">
                {TARGET_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.target === option.value;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className="h-auto p-4 text-left justify-start gap-3"
                      onClick={() => handleTargetChange(option.value as "all" | "role" | "user")}
                    >
                      <Icon className={`size-5 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {formData.target === "role" && (
                <div className="space-y-2">
                  <Label>Target Role</Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={formData.role === "traveler" ? "default" : "outline"}
                      onClick={() => handleRoleChange("traveler")}
                    >
                      <Users className="size-4 mr-2" />
                      Travelers
                    </Button>
                    <Button
                      type="button"
                      variant={formData.role === "agency" ? "default" : "outline"}
                      onClick={() => handleRoleChange("agency")}
                    >
                      <Building2 className="size-4 mr-2" />
                      Agencies
                    </Button>
                  </div>
                </div>
              )}

              {formData.target === "user" && (
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID *</Label>
                  <Input
                    id="userId"
                    value={formData.userId || ""}
                    onChange={(e) => handleInputChange("userId", e.target.value)}
                    placeholder="Enter user ID"
                    className="max-w-md"
                  />
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="font-medium">Delivery Channels</Label>
              <div className="grid gap-3 md:grid-cols-3">
                {CHANNEL_OPTIONS.map((channel) => (
                  <label key={channel.value} className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-accent transition-colors">
                    <Checkbox
                      checked={channels.includes(channel.value)}
                      onCheckedChange={(checked) => handleChannelChange(channel.value, checked as boolean)}
                    />
                    <div>
                      <p className="font-medium">{channel.label}</p>
                      <p className="text-xs text-muted-foreground">{channel.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="font-medium">Deep Link (Optional)</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deepLinkTarget">Deep Link Target</Label>
                  <Input
                    id="deepLinkTarget"
                    value={deepLinkTarget}
                    onChange={(e) => setDeepLinkTarget(e.target.value)}
                    placeholder="e.g., campaign, agency, profile"
                    className="max-w-md"
                  />
                  <p className="text-xs text-muted-foreground">Target screen/entity type</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deepLinkEntityId">Entity ID</Label>
                  <Input
                    id="deepLinkEntityId"
                    value={deepLinkEntityId}
                    onChange={(e) => setDeepLinkEntityId(e.target.value)}
                    placeholder="e.g., campaign-uuid-123"
                    className="max-w-md"
                  />
                  <p className="text-xs text-muted-foreground">Specific entity UUID</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handlePreviewClick} disabled={isPreviewLoading}>
                <Eye className="size-4 mr-2" />
                {isPreviewLoading ? <Loader2 className="size-4 animate-spin" /> : "Preview Segment"}
              </Button>
              <Button type="submit" disabled={isSending}>
                <Send className="size-4 mr-2" />
                {isSending ? <Loader2 className="size-4 animate-spin" /> : "Send Broadcast"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {(showPreview || previewParams) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-5" />
              Segment Preview
            </CardTitle>
            <CardDescription>Estimated reach based on current targeting</CardDescription>
          </CardHeader>
          <CardContent>
            {isPreviewLoading && <LoadingState message="Calculating reach..." />}
            {isPreviewError && <ErrorState error={previewError} onRetry={() => refetchPreview()} />}
            {preview && !isPreviewLoading && !isPreviewError && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Reach</p>
                    <p className="text-3xl font-bold">{preview.estimatedReach.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">users will receive this notification</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Breakdown</p>
                    <div className="flex gap-4 mt-1">
                      <div className="text-center">
                        <p className="text-lg font-bold">{preview.breakdown.travelers.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Travelers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">{preview.breakdown.agencies.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Agencies</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">{preview.breakdown.admins.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Admins</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="size-4" />
                  <span>This preview shows active users only. Inactive or deleted accounts are excluded.</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

