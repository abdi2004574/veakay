import { useState } from "react";
import { useNavigate } from "react-router";
import { Camera, Award } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { BadgeReveal } from "../components/BadgeReveal";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const travelPreferences = [
  "Adventure",
  "Luxury",
  "Backpacking",
  "Solo",
  "Family",
  "Beach",
  "Mountains",
  "City",
  "Cultural",
  "Wildlife",
];

export default function ProfileSetupScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [showBadge, setShowBadge] = useState(false);
  const navigate = useNavigate();

  const togglePreference = (pref: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref)
        ? prev.filter((p) => p !== pref)
        : [...prev, pref]
    );
  };

  const handleComplete = () => {
    setShowBadge(true);
  };

  const handleBadgeClose = () => {
    setShowBadge(false);
    navigate("/app");
  };

  return (
    <>
      <div className="h-screen w-full max-w-md mx-auto bg-background overflow-y-auto p-6">
        <h1 className="text-3xl mb-2">Complete Your Profile</h1>
        <p className="text-muted-foreground mb-8">
          Let's personalize your travel experience
        </p>

        {/* Profile Photo */}
        <div className="mb-8">
          <label className="block mb-4">Profile Photo</label>
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center"
                style={{
                  boxShadow: "0 4px 16px var(--veakey-shadow)",
                }}
              >
                {profileImage ? (
                  <ImageWithFallback
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <button
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{
                  background: "var(--veakey-gradient)",
                  boxShadow: "0 4px 16px var(--veakey-shadow)",
                }}
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Travel Preferences */}
        <div className="mb-8">
          <label className="block mb-4">Travel Preferences</label>
          <div className="flex flex-wrap gap-2">
            {travelPreferences.map((pref) => {
              const isSelected = selectedPreferences.includes(pref);
              return (
                <button
                  key={pref}
                  onClick={() => togglePreference(pref)}
                  className="px-4 py-2 rounded-full border transition-all"
                  style={
                    isSelected
                      ? {
                          background: "var(--veakey-gradient)",
                          color: "white",
                          border: "none",
                        }
                      : {
                          borderColor: "var(--border)",
                        }
                  }
                >
                  {pref}
                </button>
              );
            })}
          </div>
        </div>

        {/* Previous Trips */}
        <div className="mb-8">
          <label className="block mb-4">Previous Trip Photos (Optional)</label>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <button
                key={i}
                className="aspect-square rounded-2xl bg-muted flex items-center justify-center"
              >
                <Camera className="w-8 h-8 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Connect Wallet */}
        <div className="mb-8">
          <label className="block mb-4">Connect Payment Method</label>
          <div className="space-y-3">
            <button className="w-full h-14 rounded-2xl border border-border flex items-center gap-3 px-4">
              <div className="w-10 h-10 rounded-full bg-[#635BFF] flex items-center justify-center text-white">
                S
              </div>
              <span>Stripe</span>
            </button>
            <button className="w-full h-14 rounded-2xl border border-border flex items-center gap-3 px-4">
              <div className="w-10 h-10 rounded-full bg-[#0070BA] flex items-center justify-center text-white">
                P
              </div>
              <span>PayPal</span>
            </button>
          </div>
        </div>

        {/* Complete Button */}
        <GradientButton
          fullWidth
          onClick={handleComplete}
          disabled={selectedPreferences.length === 0}
          className="mb-6"
        >
          Complete Setup
        </GradientButton>
      </div>

      {/* Badge Reveal Modal */}
      {showBadge && (
        <BadgeReveal badge="🏅 Dreamer Badge" onClose={handleBadgeClose} />
      )}
    </>
  );
}
