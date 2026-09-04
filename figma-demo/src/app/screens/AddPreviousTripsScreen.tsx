import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, X, MapPin, Calendar, Users, Plus, Check } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { Input } from "../components/ui/input";
import { motion, AnimatePresence } from "motion/react";

interface PreviousTrip {
  id: string;
  destination: string;
  location: string;
  startDate: string;
  endDate: string;
  travelers: number;
  image: string;
  description?: string;
}

export default function AddPreviousTripsScreen() {
  const [trips, setTrips] = useState<PreviousTrip[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Partial<PreviousTrip>>({
    travelers: 1,
  });
  const [tripImage, setTripImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTripImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTrip = () => {
    if (currentTrip.destination && currentTrip.location && currentTrip.startDate && currentTrip.endDate && tripImage) {
      const newTrip: PreviousTrip = {
        id: `trip-${Date.now()}`,
        destination: currentTrip.destination,
        location: currentTrip.location,
        startDate: currentTrip.startDate,
        endDate: currentTrip.endDate,
        travelers: currentTrip.travelers || 1,
        image: tripImage,
        description: currentTrip.description,
      };
      
      setTrips([...trips, newTrip]);
      setCurrentTrip({ travelers: 1 });
      setTripImage(null);
      setShowAddForm(false);
    }
  };

  const removeTrip = (id: string) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  const handleContinue = () => {
    // Store trips data
    localStorage.setItem("signup_trips", JSON.stringify(trips));
    navigate("/signup/payment-setup");
  };

  const handleSkip = () => {
    navigate("/signup/payment-setup");
  };

  const isFormValid = currentTrip.destination && currentTrip.location && 
                      currentTrip.startDate && currentTrip.endDate && tripImage;

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
          onClick={() => navigate("/signup/travel-preferences")}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <h1 className="text-[20px] font-bold mb-2">Previous Trips</h1>
        <p className="text-muted-foreground mb-6">
          Share your travel memories (optional)
        </p>

        {/* Added Trips Grid */}
        {trips.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-muted-foreground">
                {trips.length} {trips.length === 1 ? "Trip" : "Trips"} Added
              </h3>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {trips.map((trip) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-2xl overflow-hidden bg-card border-2 border-border"
                >
                  {/* Trip Image */}
                  <div className="relative aspect-square">
                    <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeTrip(trip.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>

                    {/* Trip Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <h3 className="font-bold text-sm mb-0.5 line-clamp-1">{trip.destination}</h3>
                      <p className="text-xs opacity-90 flex items-center gap-1 line-clamp-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {trip.location}
                      </p>
                    </div>
                  </div>
                  
                  {/* Trip Stats */}
                  <div className="p-2.5 bg-card">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span className="line-clamp-1">
                          {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{trip.travelers}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Add Trip Button or Form */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full h-20 rounded-2xl border-2 border-dashed border-border hover:border-[var(--vaykae-pink)] transition-all flex items-center justify-center gap-3 mb-6 group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--vaykae-pink)]/20 to-[var(--vaykae-purple)]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-[var(--vaykae-pink)]" />
            </div>
            <div className="text-left">
              <p className="font-bold">Add Previous Trip</p>
              <p className="text-xs text-muted-foreground">Share your travel story</p>
            </div>
          </button>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <div className="p-5 rounded-2xl border-2 border-[var(--vaykae-pink)]/30 bg-card/50 backdrop-blur-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Add Trip Details</h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setCurrentTrip({ travelers: 1 });
                      setTripImage(null);
                    }}
                    className="w-8 h-8 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Trip Image */}
                <div>
                  <label className="block text-sm font-bold mb-2">Trip Photo *</label>
                  {tripImage ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <img src={tripImage} alt="Trip" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setTripImage(null)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-[var(--vaykae-pink)] transition-colors flex flex-col items-center justify-center gap-2 bg-muted/30"
                    >
                      <Camera className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-medium">Upload photo</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Trip Name */}
                <div>
                  <label className="block text-sm font-bold mb-2">Trip Name *</label>
                  <Input
                    type="text"
                    placeholder="e.g., Santorini Dreams"
                    value={currentTrip.destination || ""}
                    onChange={(e) => setCurrentTrip({ ...currentTrip, destination: e.target.value })}
                    className="h-12 rounded-xl bg-input-background"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold mb-2">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="e.g., Santorini, Greece"
                      value={currentTrip.location || ""}
                      onChange={(e) => setCurrentTrip({ ...currentTrip, location: e.target.value })}
                      className="pl-10 h-12 rounded-xl bg-input-background"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold mb-2">Start *</label>
                    <Input
                      type="date"
                      value={currentTrip.startDate || ""}
                      onChange={(e) => setCurrentTrip({ ...currentTrip, startDate: e.target.value })}
                      className="h-12 rounded-xl bg-input-background text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">End *</label>
                    <Input
                      type="date"
                      value={currentTrip.endDate || ""}
                      onChange={(e) => setCurrentTrip({ ...currentTrip, endDate: e.target.value })}
                      className="h-12 rounded-xl bg-input-background text-sm"
                      min={currentTrip.startDate}
                    />
                  </div>
                </div>

                {/* Number of Travelers */}
                <div>
                  <label className="block text-sm font-bold mb-2">Travelers</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentTrip({ ...currentTrip, travelers: Math.max(1, (currentTrip.travelers || 1) - 1) })}
                      className="w-12 h-12 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center font-bold text-lg transition-colors"
                    >
                      −
                    </button>
                    <div className="flex-1 h-12 rounded-xl border-2 border-border bg-input-background flex items-center justify-center font-bold text-lg">
                      {currentTrip.travelers || 1}
                    </div>
                    <button
                      onClick={() => setCurrentTrip({ ...currentTrip, travelers: (currentTrip.travelers || 1) + 1 })}
                      className="w-12 h-12 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center font-bold text-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold mb-2">Description (Optional)</label>
                  <textarea
                    placeholder="Share memories from this trip..."
                    value={currentTrip.description || ""}
                    onChange={(e) => setCurrentTrip({ ...currentTrip, description: e.target.value })}
                    rows={3}
                    maxLength={150}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input-background focus:outline-none focus:border-[var(--vaykae-pink)] resize-none transition-colors text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentTrip.description?.length || 0}/150
                  </p>
                </div>

                {/* Add Button */}
                <GradientButton
                  fullWidth
                  onClick={handleAddTrip}
                  disabled={!isFormValid}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add This Trip
                </GradientButton>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Navigation Buttons */}
        <div className="space-y-3 mt-6">
          <GradientButton
            fullWidth
            onClick={handleContinue}
            disabled={trips.length === 0}
          >
            {trips.length > 0 ? `Continue with ${trips.length} ${trips.length === 1 ? "Trip" : "Trips"}` : "Continue"}
          </GradientButton>
          
          <button
            onClick={handleSkip}
            className="w-full h-12 rounded-2xl border-2 border-border font-bold hover:bg-muted transition-colors"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}
