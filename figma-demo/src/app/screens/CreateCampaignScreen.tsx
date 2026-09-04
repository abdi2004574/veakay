import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, MapPin, DollarSign, Calendar, Camera, Upload, X, Globe, Lock, Gift, FileText, Image as ImageIcon } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";

export default function CreateCampaignScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = searchParams.get("edit");

  const [step, setStep] = useState(1);
  
  // Step 1: Basic Details
  const [campaignTitle, setCampaignTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [tripStartDate, setTripStartDate] = useState("");
  const [tripEndDate, setTripEndDate] = useState("");
  
  // Step 2: Story & Media
  const [story, setStory] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<File | null>(null);
  const [agencyQuote, setAgencyQuote] = useState<File | null>(null);
  
  // Step 3: Settings
  const [isPublic, setIsPublic] = useState(true);
  const [giftMode, setGiftMode] = useState(false);
  const [giftOccasion, setGiftOccasion] = useState("");

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handlePublish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handlePublish = () => {
    // Create/Update campaign logic here
    navigate("/app/campaigns");
  };

  const handleImageSelect = () => {
    // Simulated image selection - would use file input in production
    const mockImages = [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600",
      "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=600",
      "https://images.unsplash.com/photo-1580837119756-563d608dd119?w=600",
    ];
    if (selectedImages.length < 5) {
      setSelectedImages([...selectedImages, mockImages[selectedImages.length % mockImages.length]]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const isStep1Valid = campaignTitle && destination && goalAmount && tripStartDate;
  const isStep2Valid = story && selectedImages.length > 0;

  return (
    <div className="h-screen w-full bg-background flex flex-col" style={{ maxWidth: "430px", margin: "0 auto" }}>
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold">
            {isEditing ? "Edit Campaign" : "Create Campaign"}
          </h1>
          <div className="w-10" />
        </div>

        {/* Progress Indicator */}
        <div className="px-4 pb-3">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="flex-1 h-1 rounded-full transition-all"
                style={{
                  background: s <= step ? "var(--vaykae-gradient)" : "var(--muted)",
                }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Step {step} of 3 • {
              step === 1 ? "Basic Details" :
              step === 2 ? "Story & Media" :
              "Privacy & Settings"
            }
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">Trip Details</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Tell us about your dream vacation
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Campaign Title *
              </label>
              <Input
                placeholder="e.g., My Dream Trip to Greece"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                className="h-12 rounded-2xl bg-input-background"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Destination *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Where do you want to go?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-11 h-12 rounded-2xl bg-input-background"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                City, Country (e.g., Santorini, Greece)
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Funding Goal *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  className="pl-11 h-12 rounded-2xl bg-input-background"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                How much do you need to raise?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={tripStartDate}
                    onChange={(e) => setTripStartDate(e.target.value)}
                    className="pl-10 h-12 rounded-2xl bg-input-background text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={tripEndDate}
                    onChange={(e) => setTripEndDate(e.target.value)}
                    className="pl-10 h-12 rounded-2xl bg-input-background text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">Tell Your Story</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Share why this trip is important to you
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Personal Story *
              </label>
              <Textarea
                placeholder="Why is this trip important to you? What does it mean? Share your story to connect with potential donors..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="min-h-[160px] rounded-2xl bg-input-background resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {story.length}/500 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Campaign Images * (Up to 5)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                    <ImageWithFallback
                      src={img}
                      alt={`Campaign image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {selectedImages.length < 5 && (
                  <button
                    onClick={handleImageSelect}
                    className="aspect-square rounded-2xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:bg-muted/70 transition-colors"
                  >
                    <Camera className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Add photos of your destination or inspiration
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Itinerary (Optional)
              </label>
              <button
                onClick={() => {/* File upload logic */}}
                className="w-full h-24 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
              >
                {itinerary ? (
                  <>
                    <FileText className="w-6 h-6 text-[var(--vaykae-pink)]" />
                    <span className="text-sm font-medium">Itinerary uploaded ✓</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload Itinerary PDF</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Agency Quote (Optional)
              </label>
              <button
                onClick={() => {/* File upload logic */}}
                className="w-full h-24 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
              >
                {agencyQuote ? (
                  <>
                    <FileText className="w-6 h-6 text-[var(--vaykae-pink)]" />
                    <span className="text-sm font-medium">Quote uploaded ✓</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload Quote/Invoice</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">Privacy & Settings</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Choose who can see and contribute to your campaign
              </p>
            </div>

            {/* Privacy Setting */}
            <div className="p-4 rounded-2xl border-2 border-border">
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isPublic
                      ? "linear-gradient(135deg, rgba(215, 1, 168, 0.15) 0%, rgba(119, 0, 198, 0.15) 100%)"
                      : "var(--muted)",
                  }}
                >
                  {isPublic ? (
                    <Globe className="w-6 h-6 text-[var(--vaykae-pink)]" />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold">
                      {isPublic ? "Public Campaign" : "Private Campaign"}
                    </p>
                    <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isPublic
                      ? "Anyone can discover and donate to your campaign"
                      : "Only people with the link can donate"}
                  </p>
                </div>
              </div>
            </div>

            {/* Gift Mode */}
            <div className="p-4 rounded-2xl border-2 border-border">
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: giftMode
                      ? "linear-gradient(135deg, rgba(215, 1, 168, 0.15) 0%, rgba(119, 0, 198, 0.15) 100%)"
                      : "var(--muted)",
                  }}
                >
                  <Gift className={`w-6 h-6 ${giftMode ? "text-[var(--vaykae-pink)]" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold">Gift Mode</p>
                    <Switch checked={giftMode} onCheckedChange={setGiftMode} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Let friends & family gift this trip for special occasions
                  </p>
                  
                  {giftMode && (
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Special Occasion
                      </label>
                      <select
                        value={giftOccasion}
                        onChange={(e) => setGiftOccasion(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-input-background border border-border text-sm"
                      >
                        <option value="">Select occasion</option>
                        <option value="birthday">Birthday</option>
                        <option value="graduation">Graduation</option>
                        <option value="wedding">Wedding</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="retirement">Retirement</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Campaign Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--vaykae-pink)]/5 to-[var(--vaykae-purple)]/5 border border-[var(--vaykae-pink)]/20">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[var(--vaykae-pink)]" />
                Campaign Preview
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-medium text-right max-w-[60%]">
                    {campaignTitle || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination:</span>
                  <span className="font-medium">{destination || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goal:</span>
                  <span className="font-medium">
                    ${goalAmount ? parseInt(goalAmount).toLocaleString() : "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trip Date:</span>
                  <span className="font-medium">
                    {tripStartDate
                      ? new Date(tripStartDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Privacy:</span>
                  <span className="font-medium">
                    {isPublic ? "Public" : "Private"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gift Mode:</span>
                  <span className="font-medium">
                    {giftMode ? `Yes (${giftOccasion || "Not set"})` : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Photos:</span>
                  <span className="font-medium">{selectedImages.length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 h-12 rounded-2xl border-2 border-border font-bold hover:bg-muted transition-colors"
            >
              Back
            </button>
          )}
          <GradientButton
            className={step === 1 ? "w-full" : "flex-[2]"}
            onClick={handleNext}
            disabled={
              (step === 1 && !isStep1Valid) ||
              (step === 2 && !isStep2Valid)
            }
          >
            {step === 3 ? (
              <>
                {isEditing ? "Save Changes" : "Publish Campaign"}
              </>
            ) : (
              "Continue"
            )}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
