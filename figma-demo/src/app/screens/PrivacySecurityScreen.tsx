import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Shield, Eye, Lock, Smartphone, Globe, ChevronRight, Bell } from "lucide-react";
import { Switch } from "../components/ui/switch";

export default function PrivacySecurityScreen() {
  const navigate = useNavigate();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<"public" | "friends" | "private">("public");
  const [activityStatus, setActivityStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-6" style={{ maxWidth: "430px", margin: "0 auto" }}>
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Privacy & Security</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Security */}
        <div>
          <h2 className="text-sm font-bold text-muted-foreground mb-3">
            SECURITY
          </h2>

          <div className="rounded-2xl bg-card border border-border divide-y divide-border">
            <button
              onClick={() => navigate("/app/change-password")}
              className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors"
            >
              <Lock className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left">Change Password</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <h2 className="text-sm font-bold text-muted-foreground mb-3">
            PRIVACY
          </h2>

          <div className="rounded-2xl bg-card border border-border divide-y divide-border">
            {/* Profile Visibility */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">
                    Who can see your profile
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setProfileVisibility("public")}
                  className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors ${
                    profileVisibility === "public"
                      ? "bg-[var(--vaykae-pink)]/10 border-2 border-[var(--vaykae-pink)]"
                      : "bg-muted border-2 border-transparent"
                  }`}
                >
                  <span className="font-medium">Everyone</span>
                  {profileVisibility === "public" && (
                    <Shield className="w-5 h-5 text-[var(--vaykae-pink)]" />
                  )}
                </button>
                <button
                  onClick={() => setProfileVisibility("friends")}
                  className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors ${
                    profileVisibility === "friends"
                      ? "bg-[var(--vaykae-pink)]/10 border-2 border-[var(--vaykae-pink)]"
                      : "bg-muted border-2 border-transparent"
                  }`}
                >
                  <span className="font-medium">Friends Only</span>
                  {profileVisibility === "friends" && (
                    <Shield className="w-5 h-5 text-[var(--vaykae-pink)]" />
                  )}
                </button>
                <button
                  onClick={() => setProfileVisibility("private")}
                  className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors ${
                    profileVisibility === "private"
                      ? "bg-[var(--vaykae-pink)]/10 border-2 border-[var(--vaykae-pink)]"
                      : "bg-muted border-2 border-transparent"
                  }`}
                >
                  <span className="font-medium">Private</span>
                  {profileVisibility === "private" && (
                    <Shield className="w-5 h-5 text-[var(--vaykae-pink)]" />
                  )}
                </button>
              </div>
            </div>

            {/* Activity Status */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Activity Status</p>
                  <p className="text-sm text-muted-foreground">
                    Show when you're active
                  </p>
                </div>
              </div>
              <Switch
                checked={activityStatus}
                onCheckedChange={setActivityStatus}
              />
            </div>

            {/* Read Receipts */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Read Receipts</p>
                  <p className="text-sm text-muted-foreground">
                    Let others know when you read their messages
                  </p>
                </div>
              </div>
              <Switch
                checked={readReceipts}
                onCheckedChange={setReadReceipts}
              />
            </div>
          </div>
        </div>

        {/* Data & History */}
        <div>
          <h2 className="text-sm font-bold text-muted-foreground mb-3">
            DATA & HISTORY
          </h2>

          <div className="rounded-2xl bg-card border border-border divide-y divide-border">
            <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <span className="flex-1 text-left">Download My Data</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <span className="flex-1 text-left">Clear Search History</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 rounded-2xl bg-muted/50">
          <p className="text-sm text-muted-foreground">
            🔒 <strong>Your Privacy Matters:</strong> We take your privacy seriously. Your data is encrypted and never shared with third parties without your consent.
          </p>
        </div>
      </div>
    </div>
  );
}
