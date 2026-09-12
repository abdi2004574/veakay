"use client";

import { useState, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Save, Loader2 } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/api/useSettingsApi";
import { LoadingState, ErrorState } from "@/components/data-display";
import { toast } from "sonner";

interface SettingsFormData {
  "commission.basic": string;
  "commission.premium": string;
  "commission.featured": string;
  "kyc.threshold": string;
  "otp.expiry_minutes": string;
  "reset_link.expiry_minutes": string;
  "badges.explorer_trips": string;
  "badges.jetsetter_trips": string;
  "campaign.auto_expiry_days": string;
  "email.smtp_host": string;
  "email.smtp_port": string;
  "email.from_address": string;
  "storage.endpoint": string;
  "storage.bucket": string;
}

const initialFormData: SettingsFormData = {
  "commission.basic": "",
  "commission.premium": "",
  "commission.featured": "",
  "kyc.threshold": "",
  "otp.expiry_minutes": "",
  "reset_link.expiry_minutes": "",
  "badges.explorer_trips": "",
  "badges.jetsetter_trips": "",
  "campaign.auto_expiry_days": "",
  "email.smtp_host": "",
  "email.smtp_port": "",
  "email.from_address": "",
  "storage.endpoint": "",
  "storage.bucket": "",
};

interface SettingField {
  key: keyof SettingsFormData;
  label: string;
  type: "text" | "number" | "email";
  min?: number;
  max?: number;
  step?: number;
}

interface SettingSection {
  title: string;
  description: string;
  fields: SettingField[];
}

const settingConfigs: Record<string, SettingSection> = {
  payments: {
    title: "Payments",
    description: "Platform commission rates per agency subscription tier",
    fields: [
      { key: "commission.basic", label: "Basic Tier Commission (%)", type: "number", min: 0, max: 100, step: 0.1 },
      { key: "commission.premium", label: "Premium Tier Commission (%)", type: "number", min: 0, max: 100, step: 0.1 },
      { key: "commission.featured", label: "Featured Tier Commission (%)", type: "number", min: 0, max: 100, step: 0.1 },
    ],
  },
  security: {
    title: "Security",
    description: "Authentication and verification thresholds",
    fields: [
      { key: "kyc.threshold", label: "KYC / High-Value Withdrawal Threshold ($)", type: "number", min: 0, step: 100 },
      { key: "otp.expiry_minutes", label: "OTP Expiry Duration (minutes)", type: "number", min: 1, max: 1440 },
      { key: "reset_link.expiry_minutes", label: "Password Reset Link Expiry (minutes)", type: "number", min: 1, max: 10080 },
    ],
  },
  badges: {
    title: "Badges",
    description: "Traveler status badge milestone thresholds",
    fields: [
      { key: "badges.explorer_trips", label: "Explorer Badge - Completed Trips Required", type: "number", min: 1 },
      { key: "badges.jetsetter_trips", label: "Jetsetter Badge - Completed Trips Required", type: "number", min: 1 },
    ],
  },
  campaigns: {
    title: "Campaigns",
    description: "Campaign lifecycle configuration",
    fields: [
      { key: "campaign.auto_expiry_days", label: "Auto-Expiry Days After Trip End", type: "number", min: 1, max: 365 },
    ],
  },
  email: {
    title: "Email",
    description: "SMTP configuration for transactional emails",
    fields: [
      { key: "email.smtp_host", label: "SMTP Host", type: "text" },
      { key: "email.smtp_port", label: "SMTP Port", type: "number", min: 1, max: 65535 },
      { key: "email.from_address", label: "From Address", type: "email" },
    ],
  },
  storage: {
    title: "Storage",
    description: "S3/MinIO configuration for file uploads",
    fields: [
      { key: "storage.endpoint", label: "Endpoint URL", type: "text" },
      { key: "storage.bucket", label: "Bucket Name", type: "text" },
    ],
  },
};

export default function SettingsPage() {
  const [formData, setFormData] = useState<SettingsFormData>(initialFormData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  const { data, isLoading, isError, error, refetch } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  // Populate form data when settings load
  if (data?.settings) {
    for (const setting of data.settings) {
      if (setting.key in formData) {
        setFormData((prev) => ({
          ...prev,
          [setting.key]: String(setting.value ?? ""),
        }));
      }
    }
  }

  const handleChange = (key: keyof SettingsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setSavedKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const settingsToUpdate: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(formData)) {
      if (value !== "") {
        // Convert numeric fields
        const numericKeys = [
          "commission.basic",
          "commission.premium",
          "commission.featured",
          "kyc.threshold",
          "otp.expiry_minutes",
          "reset_link.expiry_minutes",
          "badges.explorer_trips",
          "badges.jetsetter_trips",
          "campaign.auto_expiry_days",
          "email.smtp_port",
        ];
        if (numericKeys.includes(key)) {
          settingsToUpdate[key] = Number(value);
        } else {
          settingsToUpdate[key] = value;
        }
      }
    }

    setShowConfirm(false);
    updateSettings({ settings: settingsToUpdate }, {
      onSuccess: () => {
        setSavedKeys(new Set(Object.keys(settingsToUpdate)));
        toast.success("Settings saved successfully");
        refetch();
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to save settings";
        toast.error(message);
      },
    });
  };

  const handleConfirmSave = () => {
    setShowConfirm(true);
  };

  const renderSection = (sectionKey: string) => {
    const section = settingConfigs[sectionKey];
    const hasUnsavedChanges = section.fields.some(
      (f) => formData[f.key] !== "" && !savedKeys.has(f.key)
    );

    return (
      <Card key={sectionKey} className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {section.title}
                {hasUnsavedChanges && (
                  <span className="text-xs text-amber-500 font-medium">(unsaved)</span>
                )}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {section.fields.map((field) => (
            <div key={field.key} className="space-y-1">
              <Label htmlFor={field.key} className="text-sm font-medium">
                {field.label}
              </Label>
              {field.type === "number" ? (
                <Input
                  id={field.key}
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full max-w-xs"
                  disabled={isPending}
                />
              ) : (
                <Input
                  id={field.key}
                  type={field.type}
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full max-w-xs"
                  disabled={isPending}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <LoadingState message="Loading settings..." />;
  }

  if (isError) {
    return <ErrorState error={error as Error} onRetry={() => refetch()} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Manage platform configurations including payments, security, badges, campaigns, email, and storage.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.keys(settingConfigs).map((key) => renderSection(key))}
      </div>

      <div className="flex items-center justify-end gap-4 border-t pt-4">
        <Button type="button" variant="outline" onClick={() => refetch()} disabled={isPending}>
          Refresh
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleConfirmSave}
          disabled={isPending}
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Confirm Save
            </>
          )}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <Alert className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" variant="warning" onClick={() => setShowConfirm(false)}>
          <div className="w-full max-w-md bg-background rounded-lg border p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <AlertCircle className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">Confirm Save Changes</h3>
            </div>
            <AlertDescription className="mb-6">
              You are about to update platform settings. This will affect all users and agencies on the platform.
              Please review your changes carefully before confirming.
            </AlertDescription>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                form={undefined}
                onClick={() => {
                  const formEl = document.querySelector("form");
                  if (formEl) {
                    formEl.requestSubmit();
                  }
                }}
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Confirm & Save"}
              </Button>
            </div>
          </div>
        </Alert>
      )}

      {/* Success Indicator */}
      {savedKeys.size > 0 && (
        <Alert className="border-green-200 bg-green-50 text-green-800" variant="success">
          <CheckCircle className="size-5 text-green-600" />
          <AlertDescription>
            {savedKeys.size} setting{savedKeys.size > 1 ? "s" : ""} saved successfully. Changes take effect immediately.
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}

