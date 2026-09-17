import { useMemo, useState } from "react";
import {
  usePlatformSettings,
  useUpdatePlatformSettings,
} from "../hooks/use-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/shared/DataState";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import type { PlatformSetting, JsonValue } from "../types";

function stringifyValue(value: JsonValue): string {
  if (value === null) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function parseValue(raw: string, original: JsonValue): JsonValue {
  if (raw === "") return null;
  if (typeof original === "boolean") return raw === "true";
  if (typeof original === "number") {
    const n = Number(raw);
    return Number.isNaN(n) ? original : n;
  }
  if (typeof original === "string") return raw;
  try {
    return JSON.parse(raw) as JsonValue;
  } catch {
    return raw;
  }
}

function SettingRow({
  setting,
  value,
  onChange,
}: {
  setting: PlatformSetting;
  value: JsonValue;
  onChange: (v: JsonValue) => void;
}) {
  const isBool = typeof value === "boolean";
  const isString = typeof value === "string";
  const isNumber = typeof value === "number";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={setting.key} className="font-medium">
          {setting.key}
        </Label>
        <Badge variant="outline" className="text-xs">
          {setting.category}
        </Badge>
      </div>
      {setting.description && (
        <p className="text-sm text-muted-foreground">
          {setting.description}
        </p>
      )}
      {isBool ? (
        <Switch
          checked={value as boolean}
          onCheckedChange={(checked) => onChange(checked)}
        />
      ) : isNumber ? (
        <Input
          id={setting.key}
          type="number"
          value={String(value)}
          onChange={(e) => onChange(parseValue(e.target.value, value))}
          className="rounded-2xl border border-border bg-[var(--input-background)]"
        />
      ) : isString ? (
        <Input
          id={setting.key}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-2xl border border-border bg-[var(--input-background)]"
        />
      ) : (
        <Textarea
          id={setting.key}
          value={stringifyValue(value)}
          onChange={(e) => onChange(parseValue(e.target.value, value))}
          rows={3}
          className="font-mono text-sm rounded-2xl border border-border bg-[var(--input-background)]"
        />
      )}
    </div>
  );
}

export default function PlatformSettings() {
  const { data, isLoading, isError, error, refetch } =
    usePlatformSettings();
  const update = useUpdatePlatformSettings();
  const [draft, setDraft] = useState<Record<string, JsonValue>>({});

  const settings = data?.data?.settings ?? [];

  const grouped = useMemo(() => {
    const map = new Map<string, PlatformSetting[]>();
    for (const s of settings) {
      const list = map.get(s.category) ?? [];
      list.push(s);
      map.set(s.category, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) =>
      a.localeCompare(b),
    );
  }, [settings]);

  const currentValue = (setting: PlatformSetting): JsonValue =>
    setting.key in draft ? draft[setting.key] : setting.value;

  const handleChange = (setting: PlatformSetting, value: JsonValue) => {
    setDraft((prev) => ({ ...prev, [setting.key]: value }));
  };

  const handleSave = () => {
    const payload: Record<string, JsonValue> = {};
    for (const setting of settings) {
      payload[setting.key] = currentValue(setting);
    }
    update.mutate({ settings: payload });
  };

  const hasChanges = Object.keys(draft).length > 0;

  if (isLoading) {
    return (
      <Card className="rounded-xl border border-border bg-card shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load platform settings"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  if (settings.length === 0) {
    return (
      <EmptyState
        title="No platform settings"
        description="There are no platform settings configured yet."
      />
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map(([category, items]) => (
        <Card key={category} className="rounded-xl border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="capitalize">{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {items.map((setting) => (
              <SettingRow
                key={setting.id}
                setting={setting}
                value={currentValue(setting)}
                onChange={(v) => handleChange(setting, v)}
              />
            ))}
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-end">
        <GradientButton
          variant="primary"
          size="default"
          onClick={handleSave}
          disabled={!hasChanges || update.isPending}
        >
          {update.isPending ? "Saving..." : "Save All Changes"}
        </GradientButton>
      </div>
    </div>
  );
}
