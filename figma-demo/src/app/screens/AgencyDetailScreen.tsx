import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Star, MapPin, Calendar, Users, Heart, MessageCircle } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { StarRating } from "../components/StarRating";

const reviews = [
  {
    id: 1,
    user: "Sarah M.",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    rating: 5,
    comment: "Amazing service! They helped make my dream trip come true. The team was professional, responsive, and went above and beyond to ensure everything was perfect.",
    date: "2 weeks ago",
    tripDestination: "Santorini, Greece",
  },
  {
    id: 2,
    user: "Mike D.",
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    rating: 5,
    comment: "Very professional and great prices. Highly recommend! Communication was excellent throughout the entire planning process.",
    date: "1 month ago",
    tripDestination: "Bali, Indonesia",
  },
  {
    id: 3,
    user: "Emma W.",
    userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    rating: 4,
    comment: "Great experience overall. The itinerary was well-planned and everything went smoothly. Only minor delays but nothing major.",
    date: "2 months ago",
    tripDestination: "Paris, France",
  },
];

export default function AgencyDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simulating whether the user has completed a trip with this agency
  const hasCompletedTrip = true; // Would come from backend
  const hasReviewed = false; // Would come from backend

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Header */}
      <div className="relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800"
          alt="Agency"
          className="w-full aspect-[16/9] object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-4">
        {/* Agency Info */}
        <div className="flex items-start gap-3 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl"
            style={{
              background: "var(--veakey-gradient)",
            }}
          >
            DT
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl">Dream Travel Co.</h1>
              <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-xs text-blue-700 dark:text-blue-300">
                Verified
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.8</span>
              </div>
              <span>•</span>
              <span>250+ trips</span>
              <span>•</span>
              <span>150 reviews</span>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="p-4 rounded-2xl bg-card border border-border mb-6">
          <h2 className="font-medium mb-4">Bali Paradise Package</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Ubud, Seminyak, Nusa Penida</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">7 days, 6 nights</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">2-4 people</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="text-muted-foreground">Total Price</span>
            <span className="text-2xl font-semibold">$2,500</span>
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">What's Included</h3>
          <div className="space-y-2">
            {[
              "Round-trip flights",
              "6 nights accommodation",
              "Daily breakfast",
              "Airport transfers",
              "2 guided tours",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                  style={{
                    background: "var(--veakey-gradient)",
                  }}
                >
                  ✓
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Reviews ({reviews.length})</h3>
            <button
              onClick={() => navigate(`/app/review/${id}`)}
              className="text-sm text-[var(--veakey-pink)]"
            >
              See all
            </button>
          </div>

          {/* Write Review CTA (only if user completed trip and hasn't reviewed) */}
          {hasCompletedTrip && !hasReviewed && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-[var(--vaykae-pink)]" />
                <p className="font-bold">Share Your Experience</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                You completed a trip with this agency. Help others by sharing your experience!
              </p>
              <button
                onClick={() => navigate(`/app/review-agency/${id}`)}
                className="w-full h-11 rounded-xl font-bold text-white"
                style={{ background: "var(--vaykae-gradient)" }}
              >
                Write a Review
              </button>
            </div>
          )}

          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-2xl bg-muted/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={review.userImage}
                      alt={review.user}
                      className="w-6 h-6 rounded-full"
                    />
                    <p className="font-medium">{review.user}</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {review.comment}
                </p>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <GradientButton fullWidth>
            Link to My Fundraiser
          </GradientButton>
          <button className="w-full h-12 rounded-2xl border-2 flex items-center justify-center gap-2"
            style={{
              borderColor: "var(--veakey-pink)",
              color: "var(--veakey-pink)",
            }}
          >
            <Heart className="w-5 h-5" />
            Save Package
          </button>
          <button className="w-full h-12 rounded-2xl border-2 flex items-center justify-center gap-2"
            style={{
              borderColor: "var(--veakey-pink)",
              color: "var(--veakey-pink)",
            }}
          >
            <MessageCircle className="w-5 h-5" />
            Contact Agency
          </button>
        </div>
      </div>
    </div>
  );
}