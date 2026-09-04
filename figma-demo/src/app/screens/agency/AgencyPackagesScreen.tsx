import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, MapPin, DollarSign, Calendar, Star, Edit, MoreVertical, Eye, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { AgencyHeader } from "../../components/AgencyHeader";
import { AgencySideMenu } from "../../components/AgencySideMenu";
import { useAgencyScrollContext } from "../../AgencyRoot";
import { motion } from "motion/react";

const packages = [
  {
    id: 1,
    title: "Romantic Paris Getaway",
    destination: "Paris, France",
    price: 2499,
    duration: "7 Days",
    rating: 4.8,
    bookings: 24,
    views: 342,
    status: "active",
    image: "https://images.unsplash.com/photo-1664202960778-c430abc6f253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    id: 2,
    title: "Tokyo Adventure Tour",
    destination: "Tokyo, Japan",
    price: 3299,
    duration: "10 Days",
    rating: 4.9,
    bookings: 18,
    views: 256,
    status: "active",
    image: "https://images.unsplash.com/photo-1598785933375-9f14c25f720b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    id: 3,
    title: "Bali Beach Paradise",
    destination: "Bali, Indonesia",
    price: 1899,
    duration: "5 Days",
    rating: 4.7,
    bookings: 32,
    views: 478,
    status: "active",
    image: "https://images.unsplash.com/photo-1729606559548-f1983999e9cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    id: 4,
    title: "Dubai Luxury Experience",
    destination: "Dubai, UAE",
    price: 4299,
    duration: "6 Days",
    rating: 4.9,
    bookings: 15,
    views: 189,
    status: "active",
    image: "https://images.unsplash.com/photo-1597172173960-b8da219af0ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    id: 5,
    title: "Swiss Alps Adventure",
    destination: "Switzerland",
    price: 3799,
    duration: "8 Days",
    rating: 4.8,
    bookings: 21,
    views: 295,
    status: "pending",
    image: "https://images.unsplash.com/photo-1666253496832-ea0fc142f8e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    id: 6,
    title: "Santorini Sunset Romance",
    destination: "Santorini, Greece",
    price: 2899,
    duration: "6 Days",
    rating: 5.0,
    bookings: 28,
    views: 421,
    status: "active",
    image: "https://images.unsplash.com/photo-1656504862966-2f0d002bae4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
];

export default function AgencyPackagesScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const { hideNav, setHideNav } = useAgencyScrollContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredPackages = packages.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const stats = {
    all: packages.length,
    active: packages.filter((p) => p.status === "active").length,
    pending: packages.filter((p) => p.status === "pending").length,
  };

  const totalBookings = packages.reduce((acc, p) => acc + p.bookings, 0);

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <AgencyHeader onMenuClick={() => setMenuOpen(true)} hidden={hideNav} />

      {/* Side Menu */}
      <AgencySideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Page Title & Stats */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl mb-1">My Packages</h1>
              <p className="text-sm text-muted-foreground">{totalBookings} total bookings</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+18%</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { key: "all", label: "All", count: stats.all },
              { key: "active", label: "Active", count: stats.active },
              { key: "pending", label: "Pending", count: stats.pending },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2.5 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                  filter === f.key ? "text-white shadow-lg" : "bg-muted text-muted-foreground"
                }`}
                style={filter === f.key ? { background: "var(--vaykae-gradient)" } : {}}
              >
                <span>{f.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    filter === f.key ? "bg-white/20" : "bg-background"
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="px-6 space-y-4 pb-4">
          {filteredPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PackageCard pkg={pkg} onEdit={() => navigate(`/agency/app/edit-package/${pkg.id}`)} />
            </motion.div>
          ))}

          {filteredPackages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No {filter} packages found</p>
            </div>
          )}
        </div>
      </div>

      {/* FAB - Create Package */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/agency/app/create-package")}
        className="fixed bottom-24 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-20"
        style={{
          background: "var(--vaykae-gradient)",
          boxShadow: "0 8px 24px var(--vaykae-shadow-soft)",
        }}
      >
        <Plus className="w-7 h-7 text-white" />
      </motion.button>
    </div>
  );
}

function PackageCard({ pkg, onEdit }: { pkg: any; onEdit: () => void }) {
  return (
    <div className="bg-card rounded-3xl border border-border overflow-hidden hover:shadow-lg transition-all">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <ImageWithFallback src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
              pkg.status === "active"
                ? "bg-green-500/20 text-green-100 ring-1 ring-green-500/30"
                : "bg-yellow-500/20 text-yellow-100 ring-1 ring-yellow-500/30"
            }`}
          >
            {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
        >
          <Edit className="w-4 h-4 text-white" />
        </button>

        {/* Destination */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{pkg.destination}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold mb-3 line-clamp-1">{pkg.title}</h3>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <StatItem icon={<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />} value={pkg.rating.toString()} />
          <StatItem icon={<Eye className="w-4 h-4" />} value={`${pkg.views}`} />
          <StatItem
            icon={<Calendar className="w-4 h-4" />}
            value={`${pkg.bookings}`}
            highlight
          />
        </div>

        {/* Price & Duration */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Duration</p>
            <p className="text-sm font-medium">{pkg.duration}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-0.5">Price</p>
            <p className="text-lg font-bold" style={{ color: "var(--vaykae-pink)" }}>
              ${pkg.price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, value, highlight = false }: { icon: React.ReactNode; value: string; highlight?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl ${
        highlight ? "bg-gradient-to-br from-pink-500/10 to-purple-500/10" : "bg-muted/50"
      }`}
    >
      <div className={highlight ? "text-[var(--vaykae-pink)]" : "text-muted-foreground"}>{icon}</div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
