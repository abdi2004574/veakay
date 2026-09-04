import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Lock, Eye, Shield, Smartphone, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function AgencyPrivacySecurityScreen() {
  const navigate = useNavigate();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState("public");

  const securitySettings = [
    {
      icon: Lock,
      title: "Change Password",
      description: "Update your password regularly",
      action: () => navigate("/agency/app/change-password"),
      color: "text-purple-500",
    },
    {
      icon: Smartphone,
      title: "Two-Factor Authentication",
      description: twoFactorEnabled ? "Enabled" : "Disabled",
      action: () => setTwoFactorEnabled(!twoFactorEnabled),
      color: "text-blue-500",
      toggle: true,
      value: twoFactorEnabled,
    },
    {
      icon: AlertTriangle,
      title: "Login Alerts",
      description: "Get notified of new logins",
      action: () => setLoginAlerts(!loginAlerts),
      color: "text-orange-500",
      toggle: true,
      value: loginAlerts,
    },
  ];

  const activeSessions = [
    {
      id: 1,
      device: "iPhone 14 Pro",
      location: "San Francisco, CA",
      lastActive: "Active now",
      isCurrent: true,
    },
    {
      id: 2,
      device: "MacBook Pro",
      location: "San Francisco, CA",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
  ];

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
          <h1 className="text-lg font-semibold">Privacy & Security</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Security Settings */}
        <div className="p-6 pb-0">
          <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
          <div className="space-y-3">
            {securitySettings.map((setting, index) => (
              <motion.button
                key={index}
                onClick={setting.action}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center ${setting.color}`}
                  >
                    <setting.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{setting.title}</h3>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  {setting.toggle && (
                    <div
                      className={`w-12 h-7 rounded-full transition-colors ${
                        setting.value ? "bg-gradient-to-r from-[var(--vaykae-pink)] to-[var(--vaykae-purple)]" : "bg-gray-300"
                      }`}
                    >
                      <motion.div
                        animate={{ x: setting.value ? 20 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="w-7 h-7 bg-white rounded-full shadow-md"
                      />
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Profile Visibility */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Visibility</h2>
          <div className="space-y-2">
            {[
              { value: "public", label: "Public", desc: "Anyone can view your profile" },
              { value: "travelers", label: "Travelers Only", desc: "Only registered travelers" },
              { value: "private", label: "Private", desc: "Only you can view" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setProfileVisibility(option.value)}
                className={`w-full p-4 rounded-2xl border transition-all text-left ${
                  profileVisibility === option.value
                    ? "border-purple-300 bg-gradient-to-br from-purple-500/5 to-pink-500/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">{option.label}</h3>
                    <p className="text-sm text-muted-foreground">{option.desc}</p>
                  </div>
                  {profileVisibility === option.value && (
                    <CheckCircle2 className="w-5 h-5" style={{ color: "var(--vaykae-pink)" }} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Sessions */}
        <div className="px-6 pb-6">
          <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{session.device}</h3>
                      {session.isCurrent && (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs text-white"
                          style={{ background: "var(--vaykae-gradient)" }}
                        >
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{session.location}</p>
                    <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                  </div>
                  {!session.isCurrent && (
                    <button className="text-sm text-red-500 hover:text-red-600">
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="px-6 pb-6">
          <h2 className="text-lg font-semibold mb-4">Data & Privacy</h2>
          <div className="space-y-3">
            <button className="w-full bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-all text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">Download Your Data</h3>
                  <p className="text-sm text-muted-foreground">Get a copy of your information</p>
                </div>
              </div>
            </button>

            <button className="w-full bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-all text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
