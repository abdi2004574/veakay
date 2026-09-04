import { X, User, Settings, HelpCircle, LogOut, Plane, Heart, Users, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AppSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSideMenu({ isOpen, onClose }: AppSideMenuProps) {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: "My Profile", path: "/app/profile", color: "text-blue-500" },
    { icon: Plane, label: "My Campaigns", path: "/app/campaigns", color: "text-purple-500" },
    { icon: Wallet, label: "Wallet & Payments", path: "/app/wallet", color: "text-emerald-500" },
    { icon: Heart, label: "Saved", path: "/app/saved", color: "text-pink-500" },
    { icon: Users, label: "Friends & Group Trips", path: "/app/friends", color: "text-green-500" },
    { icon: Settings, label: "Settings", path: "/app/settings", color: "text-gray-500" },
    { icon: HelpCircle, label: "Help & Support", path: "/help", color: "text-orange-500" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Side Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-card shadow-2xl z-50"
          >
            <div className="h-full flex flex-col">
              {/* Header with Profile */}
              <div className="p-6" style={{ background: "linear-gradient(135deg, var(--vaykae-pink) 0%, var(--vaykae-purple) 100%)" }}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                
                {/* User Profile */}
                <div className="mt-8">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden mb-3 border-4 border-white/30">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
                      alt="John Traveler"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white">John Traveler</h2>
                  <p className="text-sm text-white/80 mt-1">@johntraveler</p>
                  
                  {/* Stats */}
                  <div className="flex gap-4 mt-4">
                    <div>
                      <p className="text-lg font-bold text-white">3</p>
                      <p className="text-xs text-white/80">Campaigns</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">248</p>
                      <p className="text-xs text-white/80">Followers</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">187</p>
                      <p className="text-xs text-white/80">Following</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {menuItems.map((menuItem) => (
                    <button
                      key={menuItem.label}
                      onClick={() => handleNavigate(menuItem.path)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform ${menuItem.color}`}>
                        <menuItem.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{menuItem.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout Button */}
              <div className="p-4 border-t border-border">
                <button
                  onClick={() => {
                    navigate("/");
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}