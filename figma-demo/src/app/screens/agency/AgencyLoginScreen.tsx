import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Building2, Sparkles } from "lucide-react";
import { GradientButton } from "../../components/GradientButton";
import { Input } from "../../components/ui/input";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const logoImage = "https://images.unsplash.com/photo-1765141243892-bf56ef5fd31a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjB2YWNhdGlvbiUyMGxvZ28lMjBkZXNpZ258ZW58MXx8fHwxNzczODQ4MzE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export default function AgencyLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [useOTP, setUseOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = () => {
    // In real app, send OTP to email
    console.log("Sending OTP to:", email);
    setOtpSent(true);
  };

  const handleLogin = () => {
    // In a real app, check if agency is verified and authenticate
    console.log("Logging in:", { email, useOTP, otp });
    navigate("/agency/app");
  };

  const handleAutoFill = () => {
    setEmail("demo@vaykae.com");
    setPassword("password123");
    setUseOTP(false);
  };

  return (
    <div
      className="h-screen w-full max-w-[430px] mx-auto flex flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(215,1,168,0.05) 0%, rgba(119,0,198,0.05) 100%)",
      }}
    >
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <button
            onClick={() => navigate("/select-user")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleAutoFill}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-border hover:border-[var(--vaykae-pink)] hover:text-[var(--vaykae-pink)] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Demo
          </button>
        </div>

        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <ImageWithFallback
            src={logoImage}
            alt="Vaykae"
            className="w-20 h-20 mb-4 object-contain"
          />
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-6 h-6" style={{ color: "var(--vaykae-pink)" }} />
            <h1 className="text-2xl font-bold">Agency Login</h1>
          </div>
          <p className="text-muted-foreground text-center">Welcome back to Vaykae</p>
        </div>

        {/* Form */}
        <div className="space-y-4 flex-1">
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="agency@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-14 rounded-2xl"
              />
            </div>
          </div>

          {!useOTP ? (
            <div>
              <label className="block mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 rounded-2xl"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block mb-2 text-sm font-medium">OTP Code</label>
              {!otpSent ? (
                <GradientButton fullWidth onClick={handleSendOTP} disabled={!email}>
                  Send OTP Code
                </GradientButton>
              ) : (
                <>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="h-14 rounded-2xl text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Didn't receive the code?{" "}
                    <button onClick={handleSendOTP} className="text-[var(--vaykae-pink)] font-medium">
                      Resend
                    </button>
                  </p>
                </>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setUseOTP(!useOTP);
                setOtpSent(false);
                setOtp("");
              }}
              className="text-sm text-[var(--vaykae-pink)] font-medium"
            >
              {useOTP ? "Use Password" : "Use OTP Login"}
            </button>
            {!useOTP && (
              <button
                onClick={() => navigate("/agency/forgot-password")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot Password?
              </button>
            )}
          </div>
        </div>

        {/* Login Button */}
        <div className="mt-6">
          <GradientButton
            fullWidth
            onClick={handleLogin}
            disabled={!email || (!useOTP ? !password : !otpSent || otp.length !== 6)}
          >
            Login
          </GradientButton>

          <p className="text-center text-muted-foreground mt-4">
            Don't have an account?{" "}
            <button onClick={() => navigate("/agency/signup")} className="text-[var(--vaykae-pink)] font-medium">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}