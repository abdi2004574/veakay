import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, Calendar, Users, Star, Image as ImageIcon, Plane, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";

interface Trip {
  id: number;
  destination: string;
  location: string;
  image: string;
  startDate: string;
  endDate: string;
  status: "completed" | "ongoing" | "upcoming";
  campaignId?: number;
  agencyId?: number;
  agencyName?: string;
  agencyLogo?: string;
  participants: number;
  photos: number;
  hasReviewed?: boolean;
  totalRaised?: number;
}

const mockTrips: Trip[] = [
  {
    id: 1,
    destination: "Santorini Dreams",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600",
    startDate: "2026-03-10",
    endDate: "2026-03-17",
    status: "completed",
    campaignId: 1,
    agencyId: 1,
    agencyName: "Paradise Travel Co.",
    agencyLogo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200",
    participants: 2,
    photos: 24,
    hasReviewed: true,
    totalRaised: 4500,
  },
  {
    id: 2,
    destination: "Bali Adventure",
    location: "Ubud, Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600",
    startDate: "2026-02-15",
    endDate: "2026-02-22",
    status: "completed",
    campaignId: 2,
    agencyId: 2,
    agencyName: "Wanderlust Adventures",
    agencyLogo: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200",
    participants: 1,
    photos: 18,
    hasReviewed: true,
    totalRaised: 3200,
  },
  {
    id: 3,
    destination: "Tokyo Explorer",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600",
    startDate: "2026-04-05",
    endDate: "2026-04-12",
    status: "upcoming",
    campaignId: 3,
    agencyId: 3,
    agencyName: "Global Explorers",
    agencyLogo: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200",
    participants: 3,
    photos: 0,
    hasReviewed: false,
    totalRaised: 5800,
  },
  {
    id: 4,
    destination: "Paris Getaway",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
    startDate: "2026-01-05",
    endDate: "2026-01-10",
    status: "completed",
    campaignId: 4,
    agencyId: 3,
    agencyName: "Global Explorers",
    agencyLogo: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200",
    participants: 2,
    photos: 32,
    hasReviewed: true,
    totalRaised: 2800,
  },
  {
    id: 5,
    destination: "Iceland Northern Lights",
    location: "Reykjavik, Iceland",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600",
    startDate: "2025-12-20",
    endDate: "2025-12-27",
    status: "completed",
    participants: 4,
    photos: 45,
    hasReviewed: false,
    totalRaised: 6200,
  },
];

export default function PreviousTripsScreen() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"all" | "completed" | "upcoming">("all");

  const filteredTrips = mockTrips.filter(trip => {
    if (activeFilter === "all") return true;
    if (activeFilter === "completed") return trip.status === "completed";
    if (activeFilter === "upcoming") return trip.status === "upcoming";
    return true;
  });

  const tripCounts = {
    all: mockTrips.length,
    completed: mockTrips.filter(t => t.status === "completed").length,
    upcoming: mockTrips.filter(t => t.status === "upcoming").length,
  };

  const getStatusBadge = (status: Trip["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case "upcoming":
        return (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1">
            <Plane className="w-3 h-3" />
            Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20" style={{ maxWidth: "430px", margin: "0 auto" }}>
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 h-16">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">My Trips</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 pb-3">
          {[
            { key: "all", label: "All Trips", count: tripCounts.all },
            { key: "completed", label: "Completed", count: tripCounts.completed },
            { key: "upcoming", label: "Upcoming", count: tripCounts.upcoming },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
              className={`flex-1 h-10 rounded-xl font-bold text-sm transition-all ${
                activeFilter === filter.key
                  ? "text-white shadow-lg"
                  : "bg-muted text-muted-foreground"
              }`}
              style={
                activeFilter === filter.key
                  ? { background: "var(--vaykae-gradient)" }
                  : {}
              }
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20 mb-6"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">{tripCounts.all}</p>
              <p className="text-xs text-muted-foreground">Total Trips</p>
            </div>
            <div className="text-center border-l border-r border-[var(--vaykae-pink)]/20">
              <p className="text-3xl font-bold mb-1">
                {mockTrips.reduce((sum, t) => sum + (t.photos || 0), 0)}
              </p>
              <p className="text-xs text-muted-foreground">Photos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">
                {new Set(mockTrips.map(t => t.location.split(",")[1]?.trim())).size}
              </p>
              <p className="text-xs text-muted-foreground">Countries</p>
            </div>
          </div>
        </motion.div>

        {/* Trips List */}
        <div className="space-y-4">
          {filteredTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/app/trip/${trip.id}`)}
              className="rounded-2xl overflow-hidden bg-card border border-border cursor-pointer hover:border-[var(--vaykae-pink)]/30 transition-all"
            >
              {/* Trip Image */}
              <div className="relative">
                <ImageWithFallback
                  src={trip.image}
                  alt={trip.destination}
                  className="w-full aspect-[16/9] object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  {getStatusBadge(trip.status)}
                </div>

                {/* Photos Badge */}
                {trip.photos > 0 && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {trip.photos}
                  </div>
                )}
              </div>

              {/* Trip Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{trip.destination}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  {trip.location}
                </p>

                {/* Trip Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Dates</p>
                      <p className="font-medium">
                        {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Travelers</p>
                      <p className="font-medium">{trip.participants} {trip.participants === 1 ? "person" : "people"}</p>
                    </div>
                  </div>
                </div>

                {/* Agency Info */}
                {trip.agencyName && trip.agencyLogo && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={trip.agencyLogo}
                          alt={trip.agencyName}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div className="text-xs">
                          <p className="text-muted-foreground">Agency</p>
                          <p className="font-medium">{trip.agencyName}</p>
                        </div>
                      </div>

                      {/* Review Status */}
                      {trip.status === "completed" && !trip.hasReviewed && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/review-agency/${trip.agencyId}`);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                          style={{ background: "var(--vaykae-gradient)" }}
                        >
                          <Star className="w-3 h-3 inline mr-1" />
                          Review
                        </button>
                      )}
                      {trip.status === "completed" && trip.hasReviewed && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="font-medium">Reviewed</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Campaign Info */}
                {trip.totalRaised && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Fundraised Amount</span>
                      <span className="font-bold text-[var(--vaykae-pink)]">
                        ${trip.totalRaised.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrips.length === 0 && (
          <div className="text-center py-16">
            <Plane className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No {activeFilter} Trips</h3>
            <p className="text-muted-foreground">
              {activeFilter === "upcoming"
                ? "Plan your next adventure and create a campaign"
                : "Your trip history will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
