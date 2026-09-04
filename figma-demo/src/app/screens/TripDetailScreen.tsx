import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MapPin, Calendar, Users, Star, Share2, Download, MessageCircle, CheckCircle2, DollarSign, Plane } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GradientButton } from "../components/GradientButton";
import { motion, AnimatePresence } from "motion/react";

interface TripPhoto {
  id: number;
  url: string;
  caption?: string;
}

const tripPhotos: TripPhoto[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
    caption: "Sunset in Oia",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    caption: "Blue domes",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
    caption: "Caldera views",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800",
    caption: "Traditional architecture",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1601581987809-a874a81309c9?w=800",
    caption: "Beach day",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1607968565043-36af90dde238?w=800",
    caption: "Local cuisine",
  },
];

const itinerary = [
  {
    day: 1,
    title: "Arrival & Sunset in Oia",
    activities: ["Airport pickup", "Hotel check-in", "Sunset viewing at Oia Castle", "Welcome dinner"],
  },
  {
    day: 2,
    title: "Exploring Fira & Wine Tasting",
    activities: ["Fira town walking tour", "Cable car ride", "Wine tasting at local vineyard", "Free evening"],
  },
  {
    day: 3,
    title: "Boat Tour & Hot Springs",
    activities: ["Caldera boat tour", "Swimming in hot springs", "Visit to Thirasia island", "Beach barbecue"],
  },
  {
    day: 4,
    title: "Beach Day & Akrotiri",
    activities: ["Red Beach visit", "Ancient Akrotiri ruins tour", "Lunch at seaside taverna", "Free time"],
  },
  {
    day: 5,
    title: "Hiking & Photography",
    activities: ["Fira to Oia hiking trail", "Photo stops along the way", "Lunch in Imerovigli", "Shopping time"],
  },
  {
    day: 6,
    title: "Relaxation & Local Experience",
    activities: ["Cooking class", "Local market visit", "Spa and wellness", "Farewell dinner"],
  },
  {
    day: 7,
    title: "Departure",
    activities: ["Final breakfast", "Last-minute shopping", "Airport transfer", "Departure"],
  },
];

export default function TripDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<TripPhoto | null>(null);
  const [activeTab, setActiveTab] = useState<"photos" | "itinerary">("photos");

  // Mock trip data - would come from API
  const trip = {
    id: 1,
    destination: "Santorini Dreams",
    location: "Santorini, Greece",
    coverImage: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
    startDate: "2026-03-10",
    endDate: "2026-03-17",
    status: "completed" as const,
    campaignId: 1,
    agencyId: 1,
    agencyName: "Paradise Travel Co.",
    agencyLogo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200",
    agencyRating: 4.8,
    participants: 2,
    hasReviewed: true,
    totalRaised: 4500,
    totalGoal: 5000,
    contributors: 23,
    description: "An unforgettable journey through the stunning island of Santorini. Experience breathtaking sunsets, pristine beaches, ancient ruins, and authentic Greek cuisine in this Mediterranean paradise.",
  };

  const duration = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <div className="min-h-screen bg-background pb-20" style={{ maxWidth: "430px", margin: "0 auto" }}>
        {/* Header with Cover Image */}
        <div className="relative">
          <ImageWithFallback
            src={trip.coverImage}
            alt={trip.destination}
            className="w-full aspect-[4/3] object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Share Button */}
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Trip Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{trip.destination}</h1>
            <p className="flex items-center gap-1 text-sm">
              <MapPin className="w-4 h-4" />
              {trip.location}
            </p>
          </div>
        </div>

        <div className="p-4">
          {/* Trip Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-card border border-border text-center">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-[var(--vaykae-pink)]" />
              <p className="text-xs text-muted-foreground mb-0.5">Duration</p>
              <p className="font-bold text-sm">{duration} Days</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-[var(--vaykae-pink)]" />
              <p className="text-xs text-muted-foreground mb-0.5">Travelers</p>
              <p className="font-bold text-sm">{trip.participants}</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border text-center">
              <DollarSign className="w-5 h-5 mx-auto mb-1 text-[var(--vaykae-pink)]" />
              <p className="text-xs text-muted-foreground mb-0.5">Raised</p>
              <p className="font-bold text-sm">${(trip.totalRaised / 1000).toFixed(1)}k</p>
            </div>
          </div>

          {/* Trip Dates */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Trip Dates</p>
                <p className="font-bold">
                  {new Date(trip.startDate).toLocaleDateString("en-US", { 
                    month: "long", 
                    day: "numeric", 
                    year: "numeric" 
                  })}
                </p>
                <p className="text-sm text-muted-foreground">to</p>
                <p className="font-bold">
                  {new Date(trip.endDate).toLocaleDateString("en-US", { 
                    month: "long", 
                    day: "numeric", 
                    year: "numeric" 
                  })}
                </p>
              </div>
              <Plane className="w-12 h-12 text-[var(--vaykae-pink)]" />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3">About This Trip</h2>
            <p className="text-muted-foreground leading-relaxed">{trip.description}</p>
          </div>

          {/* Agency Info */}
          <div className="p-4 rounded-2xl bg-card border border-border mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={trip.agencyLogo}
                  alt={trip.agencyName}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <p className="text-xs text-muted-foreground">Organized by</p>
                  <p className="font-bold">{trip.agencyName}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{trip.agencyRating}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/app/agency/${trip.agencyId}`)}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/70 text-sm font-bold transition-colors"
              >
                View
              </button>
            </div>

            {/* Review CTA */}
            {!trip.hasReviewed && (
              <>
                <div className="h-px bg-border mb-3" />
                <GradientButton
                  fullWidth
                  onClick={() => navigate(`/app/review-agency/${trip.agencyId}`)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Write a Review
                </GradientButton>
              </>
            )}
            {trip.hasReviewed && (
              <>
                <div className="h-px bg-border mb-3" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">Review submitted</span>
                  </div>
                  <button
                    onClick={() => navigate("/app/my-reviews")}
                    className="text-sm font-bold text-[var(--vaykae-pink)]"
                  >
                    View
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Campaign Link */}
          {trip.campaignId && (
            <div className="p-4 rounded-2xl bg-card border border-border mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fundraising Campaign</p>
                  <p className="font-bold mb-1">{trip.destination}</p>
                  <p className="text-sm text-muted-foreground">
                    ${trip.totalRaised.toLocaleString()} raised • {trip.contributors} contributors
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/app/campaign/${trip.campaignId}`)}
                  className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/70 text-sm font-bold transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("photos")}
              className={`flex-1 h-11 rounded-xl font-bold transition-all ${
                activeTab === "photos"
                  ? "text-white shadow-lg"
                  : "bg-muted text-muted-foreground"
              }`}
              style={
                activeTab === "photos"
                  ? { background: "var(--vaykae-gradient)" }
                  : {}
              }
            >
              Photos ({tripPhotos.length})
            </button>
            <button
              onClick={() => setActiveTab("itinerary")}
              className={`flex-1 h-11 rounded-xl font-bold transition-all ${
                activeTab === "itinerary"
                  ? "text-white shadow-lg"
                  : "bg-muted text-muted-foreground"
              }`}
              style={
                activeTab === "itinerary"
                  ? { background: "var(--vaykae-gradient)" }
                  : {}
              }
            >
              Itinerary
            </button>
          </div>

          {/* Photos Grid */}
          {activeTab === "photos" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-2 mb-6"
            >
              {tripPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Itinerary List */}
          {activeTab === "itinerary" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 mb-6"
            >
              {itinerary.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ background: "var(--vaykae-gradient)" }}
                    >
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">{day.title}</h3>
                      <ul className="space-y-1.5">
                        {day.activities.map((activity, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-[var(--vaykae-pink)] mt-1">•</span>
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full h-12 rounded-2xl bg-muted hover:bg-muted/70 font-bold flex items-center justify-center gap-2 transition-colors">
              <Download className="w-5 h-5" />
              Download Trip Photos
            </button>
            <button className="w-full h-12 rounded-2xl bg-muted hover:bg-muted/70 font-bold flex items-center justify-center gap-2 transition-colors">
              <MessageCircle className="w-5 h-5" />
              Contact Agency
            </button>
          </div>
        </div>
      </div>

      {/* Photo Viewer Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50"
              onClick={() => setSelectedPhoto(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ maxWidth: "430px", margin: "0 auto" }}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white"
                >
                  ✕
                </button>
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="max-w-full max-h-[70vh] rounded-2xl"
                />
                {selectedPhoto.caption && (
                  <p className="text-white text-center mt-4 font-medium">
                    {selectedPhoto.caption}
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
