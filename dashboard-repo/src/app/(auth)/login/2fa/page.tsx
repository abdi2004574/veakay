"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";
import { verify2FA } from "@/lib/auth";
import { toast } from "sonner";

function TwoFactorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingToken, setPendingToken] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("pendingToken");
    if (!token) {
      router.push("/login");
      return;
    }
    setPendingToken(token);
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingToken) return;
    setError(null);
    setLoading(true);

    try {
      const data = await verify2FA(pendingToken, code);

      useAuthStore.getState().setTokens(
        data.accessToken,
        data.refreshToken,
      );
      useAuthStore.getState().setUser({
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.displayName,
        role: data.user.role,
        isEmailVerified: data.user.isEmailVerified,
        onboardingComplete: data.user.onboardingComplete,
      });

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
      const serverMessage = axiosErr?.response?.data?.error?.message;
      setError(serverMessage || "Invalid two-factor code");
      toast.error(serverMessage || "Invalid two-factor code");
    } finally {
      setLoading(false);
    }
  };

  if (!pendingToken) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vaykae-pink/5 to-vaykae-purple/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-r from-vaykae-pink to-vaykae-purple text-white">
              <Shield className="size-6" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Two-Factor Authentication</CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={loading || code.length < 6}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Verify & Sign In"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="size-4" />
              Back to login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function TwoFactorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="size-8 animate-spin" /></div>}>
      <TwoFactorForm />
    </Suspense>
  );
}