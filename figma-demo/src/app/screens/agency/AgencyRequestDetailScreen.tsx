import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Send,
  Heart,
  Star,
  Plane,
  Hotel,
  Utensils,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { GradientButton } from "../../components/GradientButton";
import { motion } from "motion/react";

const requestsData = [
  {
    id: 1,
    travelerName: "Sarah Johnson",
    travelerImage: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    destination: "Paris, France",
    destinationImage: "https://images.unsplash.com/photo-1664202960778-c430abc6f253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    budget: 3000,
    travelers: 2,
    dates: "Jul 15-22, 2026",
    startDate: "July 15, 2026",
    endDate: "July 22, 2026",
    duration: "7 Days",
    status: "pending",
    message: "Looking for a romantic honeymoon package with luxury accommodations.",
    preferences: {
      accommodation: "5-star hotels",
      activities: ["City tours", "Fine dining", "Museums", "Seine River cruise"],
      transportation: "Private transfers preferred",
      specialRequests: "Champagne and flowers in room on arrival",
    },
    travelerInfo: {
      email: "sarah.j@email.com",
      phone: "+1 (555) 123-4567",
      rating: 4.9,
      completedTrips: 12,
    },
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
    startDate: "August 5, 2026",
    endDate: "August 15, 2026",
    duration: "10 Days",
    status: "responded",
    message: "Interested in cultural experiences and local food tours.",
    preferences: {
      accommodation: "Traditional ryokan + modern hotel mix",
      activities: ["Temple visits", "Food tours", "Anime culture", "Mt. Fuji day trip"],
      transportation: "JR Pass + local trains",
      specialRequests: "Vegetarian meal options needed",
    },
    travelerInfo: {
      email: "mike.chen@email.com",
      phone: "+1 (555) 234-5678",
      rating: 5.0,
      completedTrips: 8,
    },
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
    startDate: "September 10, 2026",
    endDate: "September 17, 2026",
    duration: "7 Days",
    status: "booked",
    message: "Family trip with kids, need family-friendly activities.",
    preferences: {
      accommodation: "Family resort with kids club",
      activities: ["Beach activities", "Water sports", "Cultural shows", "Rice terrace tours"],
      transportation: "Private van with car seats",
      specialRequests: "Connecting rooms, kid-friendly restaurants",
    },
    travelerInfo: {
      email: "emily.davis@email.com",
      phone: "+1 (555) 345-6789",
      rating: 4.7,
      completedTrips: 5,
    },
  },
];

export default function AgencyRequestDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responseText, setResponseText] = useState("");
  const [showResponseBox, setShowResponseBox] = useState(false);

  const request = requestsData.find((r) => r.id === Number(id));

  if (!request) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Request not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "responded":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "booked":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/agency/app/requests")}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Request Details</h1>
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
              request.status
            )}`}
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Destination Image */}
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={request.destinationImage}
            alt={request.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5" />
              <h2 className="text-2xl font-bold">{request.destination}</h2>
            </div>
            <p className="text-sm text-white/90">{request.duration}</p>
          </div>
        </div>

        {/* Traveler Info Card */}
        <div className="p-6">
          <div className="bg-card rounded-3xl border border-border p-5 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <ImageWithFallback
                    src={request.travelerImage}
                    alt={request.travelerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-card" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{request.travelerName}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{request.travelerInfo.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{request.travelerInfo.completedTrips} trips</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/agency/app/chat/${request.id}`)}
                className="p-3 rounded-full hover:bg-muted transition-colors"
                style={{ color: "var(--vaykae-pink)" }}
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ContactInfo
                icon={<Users className="w-4 h-4" />}
                label="Email"
                value={request.travelerInfo.email}
              />
              <ContactInfo
                icon={<Users className="w-4 h-4" />}
                label="Phone"
                value={request.travelerInfo.phone}
              />
            </div>
          </div>

          {/* Trip Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Trip Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailCard
                icon={<Calendar className="w-5 h-5" />}
                label="Start Date"
                value={request.startDate}
                gradient
              />
              <DetailCard
                icon={<Calendar className="w-5 h-5" />}
                label="End Date"
                value={request.endDate}
                gradient
              />
              <DetailCard
                icon={<Users className="w-5 h-5" />}
                label="Travelers"
                value={`${request.travelers} ${request.travelers === 1 ? "Person" : "People"}`}
              />
              <DetailCard
                icon={<DollarSign className="w-5 h-5" />}
                label="Budget"
                value={`$${request.budget.toLocaleString()}`}
              />
            </div>
          </div>

          {/* Request Message */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Request Message</h3>
            <div className="bg-muted/30 rounded-2xl p-4">
              <p className="text-muted-foreground leading-relaxed">{request.message}</p>
            </div>
          </div>

          {/* Preferences */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Travel Preferences</h3>
            <div className="space-y-4">
              <PreferenceItem
                icon={<Hotel className="w-5 h-5" />}
                label="Accommodation"
                value={request.preferences.accommodation}
              />
              <PreferenceItem
                icon={<Plane className="w-5 h-5" />}
                label="Transportation"
                value={request.preferences.transportation}
              />
              <PreferenceItem
                icon={<Utensils className="w-5 h-5" />}
                label="Special Requests"
                value={request.preferences.specialRequests}
              />
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Heart className="w-5 h-5" style={{ color: "var(--vaykae-pink)" }} />
                  <span className="font-medium">Preferred Activities</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {request.preferences.activities.map((activity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full text-xs bg-muted text-foreground"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Response Section */}
          {request.status === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Send Response</h3>
              <div className="bg-card rounded-2xl border border-border p-4">
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your proposal or response to this travel request..."
                  className="w-full min-h-[120px] bg-background rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--vaykae-pink)]"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      {request.status === "pending" && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-background/95 backdrop-blur-xl border-t border-border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                // Handle decline
                navigate("/agency/app/requests");
              }}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-muted hover:bg-muted/80 transition-colors"
            >
              <XCircle className="w-5 h-5" />
              <span>Decline</span>
            </button>
            <GradientButton
              onClick={() => {
                // Handle send proposal
                navigate("/agency/app/requests");
              }}
            >
              <Send className="w-5 h-5 mr-2" />
              Send Proposal
            </GradientButton>
          </div>
        </div>
      )}

      {request.status === "responded" && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-background/95 backdrop-blur-xl border-t border-border p-4">
          <GradientButton
            fullWidth
            onClick={() => navigate(`/agency/app/chat/${request.id}`)}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Continue Conversation
          </GradientButton>
        </div>
      )}

      {request.status === "booked" && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-background/95 backdrop-blur-xl border-t border-border p-4">
          <div className="flex items-center justify-center gap-2 py-3 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Booking Confirmed</span>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({
  icon,
  label,
  value,
  gradient = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient?: boolean;
}) {
  return (
    <div
      className="p-4 rounded-2xl"
      style={
        gradient
          ? { background: "linear-gradient(135deg, rgba(215, 1, 168, 0.08) 0%, rgba(119, 0, 198, 0.08) 100%)" }
          : { background: "var(--muted)" }
      }
    >
      <div
        className="mb-2"
        style={gradient ? { color: "var(--vaykae-pink)" } : { color: "var(--muted-foreground)" }}
      >
        {icon}
      </div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}

function ContactInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  );
}

function PreferenceItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30">
      <div className="text-muted-foreground mt-0.5" style={{ color: "var(--vaykae-pink)" }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
