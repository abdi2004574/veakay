import { X, User, Settings, HelpCircle, LogOut, Package, Inbox, DollarSign, Star, FileText, Bell, BarChart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AgencySideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgencySideMenu({ isOpen, onClose }: AgencySideMenuProps) {
  const navigate = useNavigate();

  const menuSections = [
    {
      title: "Management",
      items: [
        { icon: BarChart, label: "Dashboard", path: "/agency/app", color: "text-blue-500" },
        { icon: Package, label: "My Packages", path: "/agency/app/packages", color: "text-purple-500" },
        { icon: Inbox, label: "Travel Requests", path: "/agency/app/requests", color: "text-orange-500" },
        { icon: DollarSign, label: "Revenue", path: "/agency/app/revenue", color: "text-emerald-500" },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: User, label: "My Profile", path: "/agency/app/profile", color: "text-indigo-500" },
        { icon: Star, label: "Reviews & Ratings", path: "/agency/app/reviews", color: "text-yellow-500" },
        { icon: Bell, label: "Notifications", path: "/agency/app/notifications", color: "text-pink-500" },
        { icon: Settings, label: "Settings", path: "/agency/app/settings", color: "text-gray-500" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help & Support", path: "/help", color: "text-cyan-500" },
        { icon: FileText, label: "Terms & Conditions", path: "/agency/app/terms-and-conditions", color: "text-slate-500" },
      ],
    },
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
            className="fixed top-0 left-0 bottom-0 w-[300px] bg-card shadow-2xl z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header with Profile - Enhanced Gradient */}
              <div className="relative p-6 pb-8 overflow-hidden" style={{ background: "var(--vaykae-gradient)" }}>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
                <div className="absolute top-1/2 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10" />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                
                {/* Agency Profile */}
                <div className="relative z-10 mt-8">
                  {/* Logo with glow effect */}
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-white/30 rounded-3xl blur-xl" />
                    <div className="relative w-20 h-20 rounded-3xl bg-white flex items-center justify-center overflow-hidden border-4 border-white/40 shadow-2xl">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1709873582570-4f17d43921d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                        alt="Paradise Travel Co."
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-white mb-1">Paradise Travel Co.</h2>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <p className="text-sm text-white/90">Verified Agency ✓</p>
                    </div>
                  </div>
                  
                  {/* Stats - Enhanced */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-2.5 mb-1">
                        <p className="text-xl font-bold text-white">24</p>
                      </div>
                      <p className="text-[10px] text-white/80 font-medium">Packages</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-2.5 mb-1">
                        <p className="text-xl font-bold text-white">186</p>
                      </div>
                      <p className="text-[10px] text-white/80 font-medium">Bookings</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-2.5 mb-1">
                        <p className="text-xl font-bold text-white">4.8</p>
                      </div>
                      <p className="text-[10px] text-white/80 font-medium">Rating</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items - Scrollable */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {menuSections.map((section, sectionIndex) => (
                  <div key={section.title} className={sectionIndex > 0 ? "mt-6" : ""}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((menuItem) => (
                        <motion.button
                          key={menuItem.label}
                          onClick={() => handleNavigate(menuItem.path)}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-muted transition-all group"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform ${menuItem.color}`}
                          >
                            <menuItem.icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-sm">{menuItem.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Logout Button - Enhanced */}
              <div className="p-4 border-t border-border">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate("/agency/login");
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl relative overflow-hidden group"
                  style={{ background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <div className="relative w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LogOut className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="relative font-semibold text-red-500">Logout</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
