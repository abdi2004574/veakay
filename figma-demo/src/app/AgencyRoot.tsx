import { Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Package, Inbox, MessageCircle, User } from "lucide-react";
import { motion } from "motion/react";
import { createContext, useState, useContext } from "react";

// Context to share scroll state
interface ScrollContextType {
  hideNav: boolean;
  setHideNav: (hide: boolean) => void;
}

const AgencyScrollContext = createContext<ScrollContextType>({
  hideNav: false,
  setHideNav: () => {},
});

export const useAgencyScrollContext = () => useContext(AgencyScrollContext);

export default function AgencyRoot() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hideNav, setHideNav] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Home", path: "/agency/app" },
    { icon: Package, label: "Packages", path: "/agency/app/packages" },
    { icon: Inbox, label: "Requests", path: "/agency/app/requests" },
    { icon: MessageCircle, label: "Chat", path: "/agency/app/chat" },
    { icon: User, label: "Profile", path: "/agency/app/profile" },
  ];

  const isActive = (path: string) => {
    if (path === "/agency/app") {
      return location.pathname === "/agency/app";
    }
    return location.pathname.startsWith(path);
  };

  // Hide bottom nav on detail screens and specific pages
  const detailScreenPaths = [
    "/agency/app/create-package",    // Create package
    "/agency/app/edit-package/",     // Edit package
    "/agency/app/chat/",             // Chat detail
    "/agency/app/request/",          // Request detail
    "/agency/app/edit-profile",      // Edit profile
    "/agency/app/revenue",           // Revenue
    "/agency/app/settings",          // Settings
    "/agency/app/terms-and-conditions", // Terms
    "/agency/app/privacy-policy",    // Privacy
    "/agency/app/notifications",     // Notifications
    "/agency/app/reviews",           // Reviews
    "/agency/app/change-password",   // Change Password
    "/agency/app/privacy-security",  // Privacy & Security
    "/agency/app/update-documents",  // Update Documents
    "/agency/app/support",           // Support
  ];

  const hideBottomNav = detailScreenPaths.some(path => location.pathname.includes(path));

  return (
    <AgencyScrollContext.Provider value={{ hideNav, setHideNav }}>
      <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col relative overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>

        {/* Bottom Navigation */}
        {!hideBottomNav && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: hideNav ? 80 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-card/95 backdrop-blur-xl border-t border-border shadow-lg z-30"
          >
            <div className="flex items-center justify-around h-16 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all"
                    style={{
                      background: active ? "var(--vaykae-gradient)" : "transparent",
                      boxShadow: active ? "0 4px 12px var(--vaykae-shadow-soft)" : "none",
                    }}
                  >
                    <Icon
                      className={`w-5 h-5 transition-all ${
                        active ? "text-white" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-medium transition-all ${
                        active ? "text-white" : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </AgencyScrollContext.Provider>
  );
}