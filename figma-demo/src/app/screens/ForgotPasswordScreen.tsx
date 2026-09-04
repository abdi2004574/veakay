import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { Input } from "../components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import { motion } from "motion/react";
import logoImage from "../../assets/1286f9e37f53baf48fc6fa3f4e79744fc547ef9c.png";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<"email" | "otp" | "newPassword" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = () => {
    setStep("otp");
  };

  const handleVerifyOTP = () => {
    setStep("newPassword");
  };

  const handleResetPassword = () => {
    setStep("success");
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-background flex flex-col p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="flex-1 flex flex-col justify-center">
        {step === "email" && (
          <>
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src={logoImage} alt="Veakey Logo" className="w-[141px] h-[114px]" />
            </div>

            <h1 className="text-[20px] mb-2">Forgot Password</h1>
            <p className="text-muted-foreground mb-8">
              Enter your email to receive a reset code
            </p>

            <div className="mb-6">
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

            <GradientButton fullWidth onClick={handleSendOTP} disabled={!email}>
              Send Reset Code
            </GradientButton>
          </>
        )}

        {step === "otp" && (
          <>
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src={logoImage} alt="Veakey Logo" className="w-[141px] h-[114px]" />
            </div>

            <h1 className="text-[20px] mb-2">Enter Code</h1>
            <p className="text-muted-foreground mb-8">
              We sent a code to {email}
            </p>

            <div className="mb-8 flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <p className="text-center text-muted-foreground mb-8">
              Didn't receive the code?{" "}
              <button className="text-[var(--veakey-pink)]">Resend</button>
            </p>

            <GradientButton fullWidth onClick={handleVerifyOTP} disabled={otp.length !== 6}>
              Verify Code
            </GradientButton>
          </>
        )}

        {step === "newPassword" && (
          <>
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src={logoImage} alt="Veakey Logo" className="w-[141px] h-[114px]" />
            </div>

            <h1 className="text-[20px] mb-2">Create New Password</h1>
            <p className="text-muted-foreground mb-8">
              Your password must be at least 8 characters
            </p>

            <div className="mb-4">
              <label className="block mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-input-background"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-input-background"
                />
              </div>
            </div>

            {/* Validation message */}
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-500 text-sm mb-4">Passwords do not match</p>
            )}

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
          </>
        )}

        {step === "success" && (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                duration: 0.6,
                bounce: 0.3
              }}
              className="flex flex-col items-center"
            >
              {/* Success Icon with Glow */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                <svg
                  className="w-24 h-24 text-green-500 relative"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
              </div>

              {/* Success Title */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl text-center mb-4"
              >
                Password Reset Successfully
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-muted-foreground text-center mb-12 px-4"
              >
                Your password has been updated successfully. You can now log in with your new password.
              </motion.p>

              {/* Back to Login Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full"
              >
                <GradientButton fullWidth onClick={() => navigate("/login")}>
                  Back to Login
                </GradientButton>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}