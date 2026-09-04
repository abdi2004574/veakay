import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, ArrowLeft, Building2, Shield } from "lucide-react";
import { GradientButton } from "../../components/GradientButton";
import { Input } from "../../components/ui/input";
import logoImage from "../../../assets/3cd1f0992c55a432ccccefc3ad8034814805f79e.png";

export default function AgencySignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    // In real app, send OTP to email
    console.log("Sending OTP to:", email);
    setShowOTP(true);
  };

  const handleVerifyOTP = () => {
    navigate("/agency/registration");
  };

  const handleResendOTP = () => {
    console.log("Resending OTP to:", email);
    // Show toast notification
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
        <div className="flex items-center gap-4 mb-8 pt-4">
          <button
            onClick={() => navigate("/select-user")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {!showOTP ? (
          <>
            {/* Logo & Title */}
            <div className="flex flex-col items-center mb-8">
              <img src={logoImage} alt="Vaykae" className="w-20 h-20 mb-4" />
              <div className="flex items-center gap-2 mb-2">
                <Building2
                  className="w-6 h-6"
                  style={{ color: "var(--vaykae-pink)" }}
                />
                <h1 className="text-2xl font-bold">Travel Agency Sign Up</h1>
              </div>
              <p className="text-muted-foreground text-center">
                Join Vaykae as a verified travel agency
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4 flex-1">
              <div>
                <label className="block mb-2 text-sm font-medium">Business Email</label>
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

              <div>
                <label className="block mb-2 text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-14 rounded-2xl"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 h-14 rounded-2xl"
                  />
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-2">Passwords do not match</p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-muted-foreground"
                />
                <p className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <button
                    onClick={() => navigate("/agency/terms-and-conditions")}
                    className="text-[var(--vaykae-pink)] font-medium"
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    onClick={() => navigate("/agency/privacy-policy")}
                    className="text-[var(--vaykae-pink)] font-medium"
                  >
                    Privacy Policy
                  </button>
                </p>
              </div>
            </div>

            {/* Sign Up Button */}
            <div className="mt-6">
              <GradientButton
                fullWidth
                onClick={handleSignUp}
                disabled={
                  !email ||
                  !password ||
                  !confirmPassword ||
                  password !== confirmPassword ||
                  password.length < 8 ||
                  !agreeTerms
                }
              >
                Continue
              </GradientButton>

              <p className="text-center text-muted-foreground mt-4">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/agency/login")}
                  className="text-[var(--vaykae-pink)] font-medium"
                >
                  Login
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* OTP Verification */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: "var(--vaykae-gradient)" }}
              >
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Verify Email</h1>
              <p className="text-muted-foreground text-center">
                We sent a verification code to
                <br />
                <span className="text-foreground font-medium">{email}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium">Verification Code</label>
              <Input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-14 rounded-2xl text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>

            <p className="text-center text-muted-foreground mb-8">
              Didn't receive the code?{" "}
              <button onClick={handleResendOTP} className="text-[var(--vaykae-pink)] font-medium">
                Resend
              </button>
            </p>

            <GradientButton
              fullWidth
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6}
            >
              Verify & Continue
            </GradientButton>
          </>
        )}
      </div>
    </div>
  );
}