import { Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router";
import vaykayLogo from "../../assets/3cd1f0992c55a432ccccefc3ad8034814805f79e.png";
import { motion } from "motion/react";

interface AgencyHeaderProps {
  onMenuClick: () => void;
  hidden?: boolean;
}

export function AgencyHeader({ onMenuClick, hidden = false }: AgencyHeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: hidden ? -80 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 p-4"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <img 
          src={vaykayLogo} 
          alt="Vaykae" 
          className="h-8 object-contain"
        />
        <button
          onClick={() => navigate("/agency/app/notifications")}
          className="relative p-2 -mr-2 hover:bg-muted rounded-full transition-colors"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--vaykae-pink)] rounded-full" />
        </button>
      </div>
    </motion.div>
  );
}
