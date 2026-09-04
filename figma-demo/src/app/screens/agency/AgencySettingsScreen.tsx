import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Lock,
  FileText,
  DollarSign,
  Bell,
  Moon,
  LogOut,
  ChevronRight,
  Shield,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "../../components/ThemeProvider";

export default function AgencySettingsScreen() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    newRequests: true,
    messages: true,
    payments: true,
    marketing: false,
  });

  const handleLogout = () => {
    navigate("/agency/login");
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/agency/app")} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </div>

      {/* Account Section */}
      <div className="px-6 py-4">
        <h2 className="text-sm text-muted-foreground mb-3">ACCOUNT</h2>
        <div className="space-y-2">
          <SettingButton
            icon={<Lock className="w-5 h-5" />}
            label="Change Password"
            onClick={() => navigate("/agency/app/change-password")}
          />
          <SettingButton
            icon={<Shield className="w-5 h-5" />}
            label="Privacy & Security"
            onClick={() => navigate("/agency/app/privacy-security")}
          />
          <SettingButton
            icon={<FileText className="w-5 h-5" />}
            label="Update Documents"
            onClick={() => navigate("/agency/app/update-documents")}
          />
        </div>
      </div>

      {/* Business Section */}
      <div className="px-6 py-4">
        <h2 className="text-sm text-muted-foreground mb-3">BUSINESS</h2>
        <div className="space-y-2">
          <SettingButton
            icon={<DollarSign className="w-5 h-5" />}
            label="Payment & Commission"
            subtitle="View commission details"
            onClick={() => navigate("/agency/app/revenue")}
          />
          <SettingButton
            icon={<FileText className="w-5 h-5" />}
            label="Payment History"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Notifications Section */}
      <div className="px-6 py-4">
        <h2 className="text-sm text-muted-foreground mb-3">NOTIFICATIONS</h2>
        <div className="space-y-2">
          <ToggleSetting
            label="New Requests"
            subtitle="Get notified for new travel requests"
            checked={notifications.newRequests}
            onChange={() =>
              setNotifications((prev) => ({ ...prev, newRequests: !prev.newRequests }))
            }
          />
          <ToggleSetting
            label="Messages"
            subtitle="Chat and message notifications"
            checked={notifications.messages}
            onChange={() =>
              setNotifications((prev) => ({ ...prev, messages: !prev.messages }))
            }
          />
          <ToggleSetting
            label="Payment Alerts"
            subtitle="Transaction and payment updates"
            checked={notifications.payments}
            onChange={() =>
              setNotifications((prev) => ({ ...prev, payments: !prev.payments }))
            }
          />
          <ToggleSetting
            label="Marketing"
            subtitle="Tips, offers, and announcements"
            checked={notifications.marketing}
            onChange={() =>
              setNotifications((prev) => ({ ...prev, marketing: !prev.marketing }))
            }
          />
        </div>
      </div>

      {/* Support Section */}
      <div className="px-6 py-4">
        <h2 className="text-sm text-muted-foreground mb-3">SUPPORT</h2>
        <div className="space-y-2">
          <SettingButton
            icon={<HelpCircle className="w-5 h-5" />}
            label="Help & Support"
            onClick={() => navigate("/agency/app/support")}
          />
          <SettingButton
            icon={<FileText className="w-5 h-5" />}
            label="Terms & Conditions"
            onClick={() => navigate("/agency/app/terms-and-conditions")}
          />
          <SettingButton
            icon={<FileText className="w-5 h-5" />}
            label="Privacy Policy"
            onClick={() => navigate("/agency/app/privacy-policy")}
          />
        </div>
      </div>

      {/* Logout */}
      <div className="px-6 py-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* App Version */}
      <div className="px-6 py-4 text-center">
        <p className="text-sm text-muted-foreground">Veakey Agency v1.0.0</p>
      </div>
    </div>
  );
}

function SettingButton({
  icon,
  label,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-muted/30 transition-colors text-left"
    >
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p>{label}</p>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </button>
  );
}

function ToggleSetting({
  label,
  subtitle,
  checked,
  onChange,
}: {
  label: string;
  subtitle: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
      <div className="flex-1 min-w-0 pr-4">
        <p className="mb-1">{label}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? "" : "bg-muted"
        }`}
        style={checked ? { background: "var(--veakey-gradient)" } : {}}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}