import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Edit2, Trash2, Star, Clock, Calendar } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { StarRating } from "../components/StarRating";
import { GradientButton } from "../components/GradientButton";
import { motion, AnimatePresence } from "motion/react";

interface Review {
  id: number;
  agencyId: number;
  agencyName: string;
  agencyLogo: string;
  agencyLocation: string;
  rating: number;
  review: string;
  createdAt: string;
  tripDate: string;
  canEdit: boolean;
  daysUntilEditExpires: number;
}

const mockReviews: Review[] = [
  {
    id: 1,
    agencyId: 1,
    agencyName: "Paradise Travel Co.",
    agencyLogo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200",
    agencyLocation: "Miami, FL",
    rating: 5,
    review: "Absolutely fantastic experience! The team was professional, responsive, and helped plan every detail of my Santorini trip. Communication was excellent throughout, and they went above and beyond to ensure everything was perfect. Highly recommend!",
    createdAt: "2026-03-15",
    tripDate: "2026-03-10",
    canEdit: true,
    daysUntilEditExpires: 5,
  },
  {
    id: 2,
    agencyId: 2,
    agencyName: "Wanderlust Adventures",
    agencyLogo: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200",
    agencyLocation: "San Francisco, CA",
    rating: 4,
    review: "Great service overall. The itinerary was well-planned and the agency was very helpful with all my questions. Only minor issue was a slight delay in response time during peak season, but everything worked out perfectly in the end.",
    createdAt: "2026-02-20",
    tripDate: "2026-02-15",
    canEdit: false,
    daysUntilEditExpires: 0,
  },
  {
    id: 3,
    agencyId: 3,
    agencyName: "Global Explorers",
    agencyLogo: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200",
    agencyLocation: "New York, NY",
    rating: 5,
    review: "Exceeded all expectations! Every aspect of the trip was perfectly coordinated. The agency's attention to detail and customer service was outstanding.",
    createdAt: "2026-01-10",
    tripDate: "2026-01-05",
    canEdit: false,
    daysUntilEditExpires: 0,
  },
];

export default function MyReviewsScreen() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState(mockReviews);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleEdit = (reviewId: number) => {
    // Navigate to edit review screen (reuse ReviewAgencyScreen with edit mode)
    navigate(`/app/review/${reviewId}/edit`);
  };

  const handleDelete = (reviewId: number) => {
    setDeleteConfirm(reviewId);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setReviews(reviews.filter(r => r.id !== deleteConfirm));
      setDeleteConfirm(null);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <>
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
            <h1 className="text-xl font-bold">My Reviews</h1>
          </div>
        </div>

        <div className="p-4">
          {/* Summary Card */}
          {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20 mb-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Average Rating</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
                    <StarRating rating={Math.round(averageRating)} size="sm" readonly />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Total Reviews</p>
                  <p className="text-3xl font-bold">{reviews.length}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl overflow-hidden bg-card border border-border"
              >
                {/* Agency Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <ImageWithFallback
                      src={review.agencyLogo}
                      alt={review.agencyName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">{review.agencyName}</h3>
                      <p className="text-xs text-muted-foreground">{review.agencyLocation}</p>
                    </div>
                    {review.canEdit && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(review.id)}
                          className="w-9 h-9 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="w-9 h-9 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Trip: {new Date(review.tripDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <StarRating rating={review.rating} size="md" readonly />
                    {review.canEdit && (
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                        Editable ({review.daysUntilEditExpires} days left)
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {review.review}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {reviews.length === 0 && (
            <div className="text-center py-16">
              <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground mb-6">
                Share your experience after completing a trip with an agency
              </p>
              <GradientButton onClick={() => navigate("/app/explore")}>
                Explore Agencies
              </GradientButton>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl p-6"
              style={{ maxWidth: "430px", margin: "0 auto" }}
            >
              <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-6" />
              
              <h3 className="text-xl font-bold mb-2">Delete Review?</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this review? This action cannot be undone and the review will be removed from the agency's profile.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 h-12 rounded-2xl border-2 border-border font-bold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 h-12 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
