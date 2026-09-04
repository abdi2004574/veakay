import { useNavigate } from "react-router";
import { ArrowLeft, Lock, CreditCard, Shield, Bell, LogOut, Trash2, ChevronRight } from "lucide-react";
import { Switch } from "../components/ui/switch";

export default function SettingsScreen() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate to login screen
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    // Could show a confirmation dialog here
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6" style={{ maxWidth: "430px", margin: "0 auto" }}>
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10 px-4">
        <div className="flex items-center gap-3 h-14">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Account */}
        <div>
          <h2 className="text-sm font-bold text-muted-foreground mb-3">ACCOUNT</h2>
          <div className="rounded-2xl bg-card border border-border divide-y divide-border">
            <button
              onClick={() => navigate("/app/change-password")}
              className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors"
            >
              <Lock className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left">Change Password</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => navigate("/app/payment-methods")}
              className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors"
            >
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left">Payment Methods</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => navigate("/app/privacy-security")}
              className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors"
            >
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left">Privacy & Security</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-sm font-bold text-muted-foreground mb-3">NOTIFICATIONS</h2>
          <div className="rounded-2xl bg-card border border-border divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span>Donation Alerts</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span>Campaign Updates</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span>Messages</span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h2 className="text-sm font-bold text-muted-foreground mb-3">DANGER ZONE</h2>
          <div className="rounded-2xl bg-card border border-border divide-y divide-border">
            <button 
              onClick={handleLogout}
              className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 text-destructive"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
            <button 
              onClick={handleDeleteAccount}
              className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 text-destructive"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}