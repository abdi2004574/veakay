import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postApi } from "@/utils/api";
import { ROUTES } from "@/lib/constants";

interface LoginResponse {
  pendingToken: string;
  email: string;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: () =>
      postApi<LoginResponse>("/admin/auth/login", { email, password }, true),
    onSuccess: (res) => {
      navigate(ROUTES.TWO_FACTOR, {
        state: { pendingToken: res.data.pendingToken, email: res.data.email },
      });
    },
    onError: (err: Error) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    login.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={login.isPending}
          className="h-11 rounded-2xl border-border bg-[var(--input-background)]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={login.isPending}
          className="h-11 rounded-2xl border-border bg-[var(--input-background)]"
        />
      </div>
      <GradientButton
        type="submit"
        className="w-full"
        disabled={login.isPending}
      >
        {login.isPending ? "Signing in..." : "Sign In"}
      </GradientButton>
    </form>
  );
}
