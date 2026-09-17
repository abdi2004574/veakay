import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postApi } from "@/utils/api";
import { useAuthStore } from "@/stores/auth-store";
import { ROUTES } from "@/lib/constants";
import type { AuthResponse } from "../types";

export default function TwoFactorForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const pendingToken = location.state?.pendingToken;
  const setAuth = useAuthStore((s) => s.setAuth);

  const verify = useMutation({
    mutationFn: () =>
      postApi<AuthResponse>("/admin/auth/2fa", { code, pendingToken }, true),
    onSuccess: (res) => {
      const expiresIn = res.data.expiresIn || 900;
      setAuth(
        {
          id: res.data.user.id,
          email: res.data.user.email,
          displayName: res.data.user.displayName,
          role: res.data.user.role as
            "traveler" | "agency" | "admin" | "super_admin",
          platformRole: "super_admin",
          isActive: true,
        },
        {
          accessToken: res.data.accessToken,
          expiresAt: Date.now() + expiresIn * 1000,
        },
      );
      navigate(ROUTES.DASHBOARD);
    },
    onError: (err: Error) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    verify.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="code">Verification Code</Label>
        <Input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          required
          autoComplete="one-time-code"
          disabled={verify.isPending}
          className="h-12 rounded-2xl border-border bg-[var(--input-background)] text-center text-2xl tracking-widest"
        />
      </div>
      <GradientButton
        type="submit"
        className="w-full"
        disabled={verify.isPending}
      >
        {verify.isPending ? "Verifying..." : "Verify"}
      </GradientButton>
    </form>
  );
}
