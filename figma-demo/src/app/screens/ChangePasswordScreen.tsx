import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { GradientButton } from "../components/GradientButton";

export default function ChangePasswordScreen() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setError("");
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    // In real app: API call to change password
    setSuccess(true);
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background" style={{ maxWidth: "430px", margin: "0 auto" }}>
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Change Password</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Info Card */}
        <div className="p-4 rounded-2xl bg-muted/50 mb-6">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-[var(--vaykae-pink)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Password Requirements</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Include uppercase and lowercase letters</li>
                <li>• Include at least one number</li>
              </ul>
            </div>
          </div>
        </div>

        {success && (
          <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 mb-6">
            <p className="text-green-600 text-sm font-medium">
              Password changed successfully!
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full h-12 px-4 pr-12 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full h-12 px-4 pr-12 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full h-12 px-4 pr-12 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <GradientButton
              onClick={handleSubmit}
              disabled={success}
              fullWidth
            >
              {success ? "Password Changed!" : "Update Password"}
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
}
