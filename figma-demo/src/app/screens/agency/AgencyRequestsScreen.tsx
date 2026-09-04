import { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, DollarSign, Calendar, Users, Clock, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { AgencyHeader } from "../../components/AgencyHeader";
import { AgencySideMenu } from "../../components/AgencySideMenu";
import { useAgencyScrollContext } from "../../AgencyRoot";
import { motion } from "motion/react";

const requests = [
  {
    id: 1,
    travelerName: "Sarah Johnson",
    travelerImage: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    destination: "Paris, France",
    destinationImage: "https://images.unsplash.com/photo-1664202960778-c430abc6f253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    budget: 3000,
    travelers: 2,
    dates: "Jul 15-22, 2026",
    duration: "7 Days",
    status: "pending",
    message: "Looking for a romantic honeymoon package with luxury accommodations.",
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    travelerName: "Mike Chen",
    travelerImage: "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    destination: "Tokyo, Japan",
    destinationImage: "https://images.unsplash.com/photo-1598785933375-9f14c25f720b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    budget: 4500,
    travelers: 1,
    dates: "Aug 5-15, 2026",
    duration: "10 Days",
    status: "responded",
    message: "Interested in cultural experiences and local food tours.",
    timeAgo: "5 hours ago",
  },
  {
    id: 3,
    travelerName: "Emily Davis",
    travelerImage: "https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    destination: "Bali, Indonesia",
    destinationImage: "https://images.unsplash.com/photo-1729606559548-f1983999e9cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    budget: 2500,
    travelers: 4,
    dates: "Sep 10-17, 2026",
    duration: "7 Days",
    status: "booked",
    message: "Family trip with kids, need family-friendly activities.",
    timeAgo: "1 day ago",
  },
  {
    id: 4,
    travelerName: "David Wilson",
    travelerImage: "https://images.unsplash.com/photo-1665832102899-2b3f12cf991e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    destination: "Santorini, Greece",
    destinationImage: "https://images.unsplash.com/photo-1656504862966-2f0d002bae4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    budget: 5000,
    travelers: 2,
    dates: "Oct 20-27, 2026",
    duration: "7 Days",
    status: "pending",
    message: "Anniversary trip, looking for romantic sunset views and wine tasting.",
    timeAgo: "3 hours ago",
  },
  {
    id: 5,
    travelerName: "Jessica Lee",
    travelerImage: "https://images.unsplash.com/photo-1594671733084-66a82cc4304a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    destination: "New York, USA",
    destinationImage: "https://images.unsplash.com/photo-1570304816841-906a17d7b067?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    budget: 3500,
    travelers: 3,
    dates: "Nov 15-20, 2026",
    duration: "5 Days",
    status: "responded",
    message: "Girls trip for shopping, Broadway shows, and fine dining.",
    timeAgo: "1 day ago",
  },
];

export default function AgencyRequestsScreen() {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { hideNav, setHideNav } = useAgencyScrollContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredRequests = requests.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const stats = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    responded: requests.filter((r) => r.status === "responded").length,
    booked: requests.filter((r) => r.status === "booked").length,
  };

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <AgencyHeader onMenuClick={() => setMenuOpen(true)} hidden={hideNav} />

      {/* Side Menu */}
      <AgencySideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Page Title & Stats */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl mb-1">Travel Requests</h1>
              <p className="text-sm text-muted-foreground">Manage incoming trip requests</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            <StatCard label="All" count={stats.all} active={filter === "all"} onClick={() => setFilter("all")} />
            <StatCard
              label="Pending"
              count={stats.pending}
              active={filter === "pending"}
              onClick={() => setFilter("pending")}
              color="yellow"
            />
            <StatCard
              label="Replied"
              count={stats.responded}
              active={filter === "responded"}
              onClick={() => setFilter("responded")}
              color="blue"
            />
            <StatCard
              label="Booked"
              count={stats.booked}
              active={filter === "booked"}
              onClick={() => setFilter("booked")}
              color="green"
            />
          </div>
        </div>

        {/* Requests List */}
        <div className="px-6 space-y-4 pb-4">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RequestCard request={request} onClick={() => navigate(`/agency/app/request/${request.id}`)} />
            </motion.div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No {filter} requests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  count,
  active,
  onClick,
  color = "gradient",
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  color?: "gradient" | "yellow" | "blue" | "green";
}) {
  const getColors = () => {
    if (!active) return "bg-muted text-muted-foreground";

    switch (color) {
      case "yellow":
        return "bg-yellow-500/10 text-yellow-600 ring-1 ring-yellow-500/20";
      case "blue":
        return "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20";
      case "green":
        return "bg-green-500/10 text-green-600 ring-1 ring-green-500/20";
      default:
        return "text-white";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-2xl transition-all ${getColors()}`}
      style={active && color === "gradient" ? { background: "var(--vaykae-gradient)" } : {}}
    >
      <p className="text-xl font-bold mb-0.5">{count}</p>
      <p className="text-[10px] font-medium">{label}</p>
    </button>
  );
}

function RequestCard({ request, onClick }: { request: any; onClick: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "responded":
        return "bg-blue-500/10 text-blue-600";
      case "booked":
        return "bg-green-500/10 text-green-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-3xl border border-border overflow-hidden hover:shadow-lg transition-all text-left"
    >
      {/* Destination Image Header */}
      <div className="relative h-32 overflow-hidden">
        <ImageWithFallback
          src={request.destinationImage}
          alt={request.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </div>
        </div>
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-4 h-4" />
            <h3 className="font-semibold">{request.destination}</h3>
          </div>
          <p className="text-xs text-white/80">{request.duration}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Traveler Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
            <ImageWithFallback
              src={request.travelerImage}
              alt={request.travelerName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{request.travelerName}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{request.timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Message Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{request.message}</p>

        {/* Trip Details */}
        <div className="grid grid-cols-3 gap-2">
          <DetailItem icon={<Calendar className="w-4 h-4" />} label={request.dates.split(",")[0]} />
          <DetailItem icon={<Users className="w-4 h-4" />} label={`${request.travelers} ${request.travelers === 1 ? "Person" : "People"}`} />
          <DetailItem icon={<DollarSign className="w-4 h-4" />} label={`$${(request.budget / 1000).toFixed(1)}k`} />
        </div>
      </div>
    </button>
  );
}

function DetailItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-muted/50">
      <div className="text-muted-foreground" style={{ color: "var(--vaykae-pink)" }}>
        {icon}
      </div>
      <span className="text-xs font-medium truncate">{label}</span>
    </div>
  );
}