import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Send, CheckCircle2, Star } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GradientButton } from "../components/GradientButton";
import { StarRating } from "../components/StarRating";
import { motion, AnimatePresence } from "motion/react";

// Mock agency data - would come from API
const agencies = [
  {
    id: 1,
    name: "Paradise Travel Co.",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200",
    location: "Miami, FL",
  },
];

export default function ReviewAgencyScreen() {
  const { agencyId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const agency = agencies.find((a) => a.id === Number(agencyId)) || agencies[0];

  const handleSubmit = () => {
    if (rating === 0) {
      return;
    }

    // Submit review logic here
    setShowSuccess(true);

    setTimeout(() => {
      navigate("/app/my-reviews");
    }, 2000);
  };

  const ratingLabels = [
    "",
    "Poor",
    "Fair",
    "Good",
    "Very Good",
    "Excellent",
  ];

  return (
    <>
      <div className="min-h-screen bg-background" style={{ maxWidth: "430px", margin: "0 auto" }}>
        {/* Header */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
          <div className="flex items-center gap-3 px-4 h-16">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Rate Your Experience</h1>
          </div>
        </div>

        <div className="p-6">
          {/* Agency Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20 mb-6"
          >
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={agency.logo}
                alt={agency.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h2 className="font-bold text-lg">{agency.name}</h2>
                <p className="text-sm text-muted-foreground">{agency.location}</p>
              </div>
            </div>
          </motion.div>

          {/* Rating Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <label className="block mb-3 font-bold">How would you rate your experience?</label>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border">
              <StarRating rating={rating} onRatingChange={setRating} size="lg" />
              <AnimatePresence mode="wait">
                {rating > 0 && (
                  <motion.p
                    key={rating}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-3 text-lg font-bold"
                    style={{
                      background: "var(--vaykae-gradient)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {ratingLabels[rating]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Review Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <label className="block mb-3 font-bold">
              Share your experience (Optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell others about your trip, the service quality, communication, and overall experience..."
              className="w-full h-40 px-4 py-3 rounded-2xl bg-input-background border border-border resize-none focus:outline-none focus:ring-2 focus:ring-[var(--vaykae-pink)]/30 transition-all"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                Help others make informed decisions
              </p>
              <p className="text-xs text-muted-foreground">
                {review.length}/500
              </p>
            </div>
          </motion.div>

          {/* Quick Feedback Tags */}
          {rating > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <label className="block mb-3 font-bold">
                Quick Feedback (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Great Communication",
                  "Professional",
                  "Value for Money",
                  "Responsive",
                  "Well Organized",
                  "Knowledgeable",
                  "Friendly",
                  "Reliable",
                ].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-2 rounded-full border-2 border-border hover:border-[var(--vaykae-pink)] hover:bg-[var(--vaykae-pink)]/5 text-sm font-medium transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GradientButton
              fullWidth
              onClick={handleSubmit}
              disabled={rating === 0}
              className="h-14"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Review
            </GradientButton>
            
            <p className="text-xs text-center text-muted-foreground mt-3">
              You can edit or delete this review within 7 days
            </p>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ maxWidth: "430px", margin: "0 auto" }}
            >
              <div className="bg-card rounded-3xl p-8 w-full text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1,
                  }}
                  className="relative inline-flex mb-6"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute inset-0 rounded-full blur-2xl opacity-30"
                    style={{ background: "var(--vaykae-gradient)" }}
                  />
                  
                  <div
                    className="relative w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ background: "var(--vaykae-gradient)" }}
                  >
                    <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold mb-2">Review Submitted!</h2>
                <p className="text-muted-foreground">
                  Thank you for sharing your experience. Your feedback helps other travelers make informed decisions.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
