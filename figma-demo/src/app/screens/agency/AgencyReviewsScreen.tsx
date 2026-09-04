import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Star, TrendingUp, ThumbsUp, MessageCircle, Filter } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

interface Review {
  id: number;
  travelerName: string;
  travelerAvatar: string;
  rating: number;
  tripName: string;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: 1,
    travelerName: "Jessica Lee",
    travelerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    rating: 5,
    tripName: "Dubai Luxury Experience",
    comment: "Absolutely amazing trip! Paradise Travel Co. handled everything perfectly. The itinerary was well-planned, hotels were luxurious, and our guide was knowledgeable. Highly recommend!",
    date: "2 days ago",
    helpful: 12,
    verified: true,
  },
  {
    id: 2,
    travelerName: "Michael Chen",
    travelerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    rating: 5,
    tripName: "Tokyo Adventure",
    comment: "Best travel experience ever! The team was responsive and accommodating. They customized our itinerary based on our preferences and everything went smoothly.",
    date: "5 days ago",
    helpful: 8,
    verified: true,
  },
  {
    id: 3,
    travelerName: "Sarah Johnson",
    travelerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    rating: 4,
    tripName: "Bali Cultural Tour",
    comment: "Great trip overall. The cultural experiences were authentic and memorable. Only minor issue was a slight delay at one hotel check-in, but the team resolved it quickly.",
    date: "1 week ago",
    helpful: 5,
    verified: true,
  },
  {
    id: 4,
    travelerName: "David Park",
    travelerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    rating: 5,
    tripName: "Paris Romance Package",
    comment: "Perfect honeymoon trip! Every detail was thoughtfully planned. The romantic dinners, Seine cruise, and surprise champagne at Eiffel Tower made it unforgettable.",
    date: "2 weeks ago",
    helpful: 15,
    verified: true,
  },
  {
    id: 5,
    travelerName: "Emma Davis",
    travelerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    rating: 4,
    tripName: "Greece Island Hopping",
    comment: "Wonderful experience exploring the Greek islands. Beautiful accommodations and well-organized ferry schedules. Would have loved one more day in Santorini!",
    date: "3 weeks ago",
    helpful: 6,
    verified: true,
  },
];

export default function AgencyReviewsScreen() {
  const navigate = useNavigate();
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    stars: rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / totalReviews) * 100,
  }));

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate("/agency/app/profile")} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Reviews & Ratings</h1>
        </div>

        {/* Overall Rating Card */}
        <div className="p-4 rounded-2xl bg-muted/30 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold">{avgRating}</span>
                <span className="text-muted-foreground">out of 5</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(parseFloat(avgRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{totalReviews} total reviews</p>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="w-8 h-8 mb-1" style={{ color: "var(--vaykae-pink)" }} />
              <span className="text-xs text-muted-foreground">Excellent</span>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map((dist) => (
              <button
                key={dist.stars}
                onClick={() => setFilterRating(filterRating === dist.stars ? null : dist.stars)}
                className={`w-full flex items-center gap-2 p-2 rounded-xl transition-colors ${
                  filterRating === dist.stars ? "bg-background" : "hover:bg-background/50"
                }`}
              >
                <span className="text-sm w-6">{dist.stars}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${dist.percentage}%`,
                      background: "var(--vaykae-gradient)",
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">
                  {dist.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Info */}
        {filterRating && (
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              Showing {filteredReviews.length} {filterRating}-star reviews
            </p>
            <button
              onClick={() => setFilterRating(null)}
              className="text-sm font-medium"
              style={{ color: "var(--vaykae-pink)" }}
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto pb-20">
        {filteredReviews.map((review) => (
          <div key={review.id} className="p-4 border-b border-border">
            {/* Reviewer Info */}
            <div className="flex items-start gap-3 mb-3">
              <ImageWithFallback
                src={review.travelerAvatar}
                alt={review.travelerName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{review.travelerName}</h3>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      Verified Trip
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{review.tripName}</p>
              </div>
            </div>

            {/* Review Comment */}
            <p className="text-sm mb-3 leading-relaxed">{review.comment}</p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
