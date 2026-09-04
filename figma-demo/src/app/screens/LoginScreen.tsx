import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowLeft } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { Input } from "../components/ui/input";
import logoImage from "../../assets/1286f9e37f53baf48fc6fa3f4e79744fc547ef9c.png";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/app");
  };

  const handleAutoFill = () => {
    setEmail("demo@vaykae.com");
    setPassword("password123");
  };

  return (
    <div
      className="h-screen w-full max-w-md mx-auto flex flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(141,41,206,0.1) 50%, rgba(216,1,167,0.1) 100%)",
      }}
    >
      <div className="flex flex-col h-full pt-8 pb-8 px-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/select-user")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src={logoImage}
              alt="Vaykae Logo"
              className="w-[141px] h-[114px]"
            />
          </div>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-[20px]">Welcome Back</h1>
            <button
              onClick={handleAutoFill}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-border hover:border-[var(--vaykae-pink)] hover:text-[var(--vaykae-pink)] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Demo
            </button>
          </div>
          <p className="text-muted-foreground mb-8">
            Log in to continue your journey
          </p>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-14 rounded-2xl bg-input-background"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12 h-14 rounded-2xl bg-input-background"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-right text-[var(--vaykae-pink)] mb-6 font-medium"
          >
            Forgot Password?
          </button>

          {/* Login Button */}
          <GradientButton
            fullWidth
            onClick={handleLogin}
            disabled={!email || !password}
            className="mb-4"
          >
            Log In
          </GradientButton>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social Login */}
          <div className="flex gap-3 mb-6">
            <button className="flex-1 h-14 rounded-2xl border border-border flex items-center justify-center gap-2 bg-white/50 hover:bg-white/70 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button className="flex-1 h-14 rounded-2xl border border-border flex items-center justify-center gap-2 bg-white/50 hover:bg-white/70 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[var(--vaykae-pink)] font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}