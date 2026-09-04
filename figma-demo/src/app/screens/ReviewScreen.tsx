import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Star } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { Textarea } from "../components/ui/textarea";

export default function ReviewScreen() {
  const { agencyId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-background flex flex-col">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl">Write a Review</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Agency Info */}
        <div className="p-4 rounded-2xl bg-muted/50 mb-6 text-center">
          <h2 className="font-medium mb-1">Dream Travel Co.</h2>
          <p className="text-sm text-muted-foreground">How was your experience?</p>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block mb-3 text-center">Rate Your Experience</label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-6">
          <label className="block mb-2">Your Review</label>
          <Textarea
            placeholder="Share your experience with this agency..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="min-h-[150px] rounded-2xl bg-input-background"
          />
        </div>

        <div className="p-4 rounded-2xl bg-muted/50 text-sm text-muted-foreground">
          <p>Your review can be edited within 7 days of submission.</p>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <GradientButton
          fullWidth
          onClick={handleSubmit}
          disabled={rating === 0 || !review.trim()}
        >
          Submit Review
        </GradientButton>
      </div>
    </div>
  );
}
