import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Mountain, Palmtree, Building, Tent, Ship } from "lucide-react";
import { GradientButton } from "../components/GradientButton";

const destinationTypes = [
  { id: "beach", label: "Beach", icon: Palmtree },
  { id: "mountain", label: "Mountain", icon: Mountain },
  { id: "city", label: "City", icon: Building },
  { id: "adventure", label: "Adventure", icon: Tent },
  { id: "cruise", label: "Cruise", icon: Ship },
];

const travelStyles = [
  { id: "luxury", label: "Luxury" },
  { id: "budget", label: "Budget" },
  { id: "backpacking", label: "Backpacking" },
  { id: "family", label: "Family" },
  { id: "solo", label: "Solo" },
  { id: "group", label: "Group" },
];

export default function TravelPreferencesScreen() {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleDestination = (id: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    // Store preferences
    localStorage.setItem("signup_preferences", JSON.stringify({
      destinations: selectedDestinations,
      styles: selectedStyles,
    }));
    navigate("/signup/add-trips");
  };

  const isValid = selectedDestinations.length > 0 && selectedStyles.length > 0;

  return (
    <div 
      className="h-screen w-full max-w-md mx-auto flex flex-col"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(141,41,206,0.1) 50%, rgba(216,1,167,0.1) 100%)"
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-4">
        <button
          onClick={() => navigate("/signup/create-profile")}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <h1 className="text-[20px] font-bold mb-2">Travel Preferences</h1>
        <p className="text-muted-foreground mb-8">
          Help us personalize your experience
        </p>

        {/* Destination Types */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">What destinations interest you?</h2>
          <div className="grid grid-cols-2 gap-3">
            {destinationTypes.map((dest) => (
              <button
                key={dest.id}
                onClick={() => toggleDestination(dest.id)}
                className={`h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 font-medium ${
                  selectedDestinations.includes(dest.id)
                    ? "border-transparent text-white shadow-lg"
                    : "border-border hover:border-[var(--vaykae-pink)]"
                }`}
                style={
                  selectedDestinations.includes(dest.id)
                    ? { background: "var(--vaykae-gradient)" }
                    : {}
                }
              >
                <dest.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{dest.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">What's your travel style?</h2>
          <div className="grid grid-cols-2 gap-3">
            {travelStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => toggleStyle(style.id)}
                className={`h-14 rounded-2xl border-2 transition-all font-medium ${
                  selectedStyles.includes(style.id)
                    ? "border-transparent text-white shadow-lg"
                    : "border-border hover:border-[var(--vaykae-pink)]"
                }`}
                style={
                  selectedStyles.includes(style.id)
                    ? { background: "var(--vaykae-gradient)" }
                    : {}
                }
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20">
          <p className="text-sm text-muted-foreground text-center">
            Next, you'll be able to add your previous trips with photos and details
          </p>
        </div>

        {/* Continue Button */}
        <GradientButton
          fullWidth
          onClick={handleContinue}
          disabled={!isValid}
        >
          Continue
        </GradientButton>
      </div>
    </div>
  );
}
