import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { GradientButton } from "../../components/GradientButton";
import { Input } from "../../components/ui/input";
import { motion } from "motion/react";

export default function AgencyChangePasswordScreen() {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordRequirements = [
    { id: 1, text: "At least 8 characters", met: newPassword.length >= 8 },
    { id: 2, text: "Contains uppercase letter", met: /[A-Z]/.test(newPassword) },
    { id: 3, text: "Contains lowercase letter", met: /[a-z]/.test(newPassword) },
    { id: 4, text: "Contains number", met: /[0-9]/.test(newPassword) },
    { id: 5, text: "Contains special character", met: /[!@#$%^&*]/.test(newPassword) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allRequirementsMet && passwordsMatch) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/agency/app/settings");
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--vaykae-gradient)" }}
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Password Changed!</h2>
          <p className="text-muted-foreground">Your password has been updated successfully.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/agency/app/settings")}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Change Password</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium">
              <Lock className="w-4 h-4" style={{ color: "var(--vaykae-pink)" }} />
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-12 rounded-2xl pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium">
              <Lock className="w-4 h-4" style={{ color: "var(--vaykae-pink)" }} />
              New Password
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 rounded-2xl pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            {newPassword && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-4 bg-muted/30 rounded-2xl space-y-2"
              >
                <p className="text-xs font-medium text-muted-foreground mb-2">Password must contain:</p>
                {passwordRequirements.map((req) => (
                  <div key={req.id} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                        req.met ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {req.met && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-xs ${req.met ? "text-green-600" : "text-muted-foreground"}`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium">
              <Lock className="w-4 h-4" style={{ color: "var(--vaykae-pink)" }} />
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 rounded-2xl pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2"
              >
                {passwordsMatch ? (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Passwords match
                  </p>
                ) : (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </motion.div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
            <p className="text-sm text-blue-600">
              Make sure your new password is strong and unique. You'll be logged out and need to sign in again with your new password.
            </p>
          </div>
        </form>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-xl border-t border-border p-4">
        <GradientButton
          fullWidth
          onClick={handleSubmit}
          disabled={!currentPassword || !allRequirementsMet || !passwordsMatch}
        >
          Change Password
        </GradientButton>
      </div>
    </div>
  );
}
