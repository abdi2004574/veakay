import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, ArrowLeft, Lock, Shield, CheckCircle2 } from "lucide-react";
import { GradientButton } from "../../components/GradientButton";
import { Input } from "../../components/ui/input";
import logoImage from "../../../assets/1286f9e37f53baf48fc6fa3f4e79744fc547ef9c.png";

export default function AgencyForgotPasswordScreen() {
  const [step, setStep] = useState<"email" | "otp" | "password" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = () => {
    // In real app, send OTP to email
    console.log("Sending OTP to:", email);
    setStep("otp");
  };

  const handleVerifyOTP = () => {
    // In real app, verify OTP
    console.log("Verifying OTP:", otp);
    setStep("password");
  };

  const handleResetPassword = () => {
    // In real app, update password
    console.log("Resetting password");
    setStep("success");
  };

  const handleResendOTP = () => {
    console.log("Resending OTP to:", email);
    // Show toast or notification
  };

  return (
    <div
      className="h-screen w-full max-w-md mx-auto flex flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(141,41,206,0.1) 50%, rgba(216,1,167,0.1) 100%)",
      }}
    >
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-4">
          <button
            onClick={() => {
              if (step === "email") {
                navigate("/agency/login");
              } else if (step === "otp") {
                setStep("email");
              } else if (step === "password") {
                setStep("otp");
              }
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Email Step */}
        {step === "email" && (
          <>
            <div className="flex flex-col items-center mb-8">
              <img src={logoImage} alt="Vaykae" className="w-20 h-20 mb-4" />
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: "var(--veakey-gradient)" }}
              >
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl mb-2">Forgot Password?</h1>
              <p className="text-muted-foreground text-center">
                Enter your business email to receive a verification code
              </p>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <label className="block mb-2 text-sm">Business Email</label>
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
            </div>

            <div className="mt-6">
              <GradientButton fullWidth onClick={handleSendOTP} disabled={!email}>
                Send Verification Code
              </GradientButton>

              <p className="text-center text-muted-foreground mt-4">
                Remember your password?{" "}
                <button
                  onClick={() => navigate("/agency/login")}
                  className="text-[var(--vaykae-pink)]"
                >
                  Login
                </button>
              </p>
            </div>
          </>
        )}

        {/* OTP Verification Step */}
        {step === "otp" && (
          <>
            <div className="flex flex-col items-center mb-8">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: "var(--veakey-gradient)" }}
              >
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl mb-2">Verify Code</h1>
              <p className="text-muted-foreground text-center">
                We sent a 6-digit code to
                <br />
                <span className="text-foreground font-medium">{email}</span>
              </p>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <label className="block mb-2 text-sm">Verification Code</label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-14 rounded-2xl text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              <p className="text-center text-muted-foreground">
                Didn't receive the code?{" "}
                <button onClick={handleResendOTP} className="text-[var(--veakey-pink)]">
                  Resend
                </button>
              </p>
            </div>

            <div className="mt-6">
              <GradientButton fullWidth onClick={handleVerifyOTP} disabled={otp.length !== 6}>
                Verify Code
              </GradientButton>
            </div>
          </>
        )}

        {/* New Password Step */}
        {step === "password" && (
          <>
            <div className="flex flex-col items-center mb-8">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: "var(--veakey-gradient)" }}
              >
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl mb-2">Create New Password</h1>
              <p className="text-muted-foreground text-center">
                Your new password must be different from previously used passwords
              </p>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <label className="block mb-2 text-sm">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-12 h-14 rounded-2xl"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Must be at least 8 characters with letters and numbers
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm">Confirm New Password</label>
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
              </div>

              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            </div>

            <div className="mt-6">
              <GradientButton
                fullWidth
                onClick={handleResetPassword}
                disabled={
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword ||
                  newPassword.length < 8
                }
              >
                Reset Password
              </GradientButton>
            </div>
          </>
        )}

        {/* Success Step */}
        {step === "success" && (
          <>
            <div className="flex flex-col items-center justify-center flex-1">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-bounce"
                style={{ background: "var(--veakey-gradient)" }}
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-2xl mb-3">Password Reset Successfully!</h1>
              <p className="text-muted-foreground text-center mb-8 max-w-sm">
                Your password has been changed successfully. You can now login with your new password.
              </p>

              <div className="w-full space-y-3 mb-8 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm">Password updated</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm">Account security enhanced</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm">Ready to login</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <GradientButton fullWidth onClick={() => navigate("/agency/login")}>
                Go to Login
              </GradientButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}