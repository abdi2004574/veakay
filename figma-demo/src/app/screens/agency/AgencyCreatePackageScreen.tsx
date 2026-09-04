import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Upload,
  Plus,
  X,
  Plane,
  Hotel,
  Utensils,
  Camera,
  Clock,
  Info,
} from "lucide-react";
import { GradientButton } from "../../components/GradientButton";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Input } from "../../components/ui/input";
import { motion, AnimatePresence } from "motion/react";

interface PackageFormData {
  title: string;
  destination: string;
  price: string;
  duration: string;
  maxTravelers: string;
  description: string;
  images: string[];
  included: string[];
  excluded: string[];
  itinerary: Array<{ day: number; title: string; description: string }>;
}

export default function AgencyCreatePackageScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PackageFormData>({
    title: "",
    destination: "",
    price: "",
    duration: "",
    maxTravelers: "",
    description: "",
    images: [],
    included: [],
    excluded: [],
    itinerary: [],
  });

  const [newIncluded, setNewIncluded] = useState("");
  const [newExcluded, setNewExcluded] = useState("");

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/agency/app/packages");
    }
  };

  const handleSubmit = () => {
    // Handle package creation
    console.log("Creating package:", formData);
    navigate("/agency/app/packages");
  };

  const addIncluded = () => {
    if (newIncluded.trim()) {
      setFormData({ ...formData, included: [...formData.included, newIncluded.trim()] });
      setNewIncluded("");
    }
  };

  const addExcluded = () => {
    if (newExcluded.trim()) {
      setFormData({ ...formData, excluded: [...formData.excluded, newExcluded.trim()] });
      setNewExcluded("");
    }
  };

  const removeIncluded = (index: number) => {
    setFormData({
      ...formData,
      included: formData.included.filter((_, i) => i !== index),
    });
  };

  const removeExcluded = (index: number) => {
    setFormData({
      ...formData,
      excluded: formData.excluded.filter((_, i) => i !== index),
    });
  };

  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        { day: formData.itinerary.length + 1, title: "", description: "" },
      ],
    });
  };

  const updateItineraryDay = (index: number, field: "title" | "description", value: string) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[index][field] = value;
    setFormData({ ...formData, itinerary: updatedItinerary });
  };

  const removeItineraryDay = (index: number) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Create Package</h1>
          <div className="w-10" />
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: step <= currentStep ? "100%" : 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
                style={{ background: "var(--vaykae-gradient)" }}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <StepHeader
                icon={<Info className="w-6 h-6" />}
                title="Basic Information"
                description="Enter the key details about your travel package"
              />

              <div className="space-y-5">
                <FormField
                  label="Package Title"
                  icon={<MapPin className="w-5 h-5" />}
                  required
                >
                  <Input
                    type="text"
                    placeholder="e.g., Romantic Paris Getaway"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-12 rounded-2xl"
                  />
                </FormField>

                <FormField
                  label="Destination"
                  icon={<MapPin className="w-5 h-5" />}
                  required
                >
                  <Input
                    type="text"
                    placeholder="e.g., Paris, France"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="h-12 rounded-2xl"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Price (USD)"
                    icon={<DollarSign className="w-5 h-5" />}
                    required
                  >
                    <Input
                      type="number"
                      placeholder="2499"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="h-12 rounded-2xl"
                    />
                  </FormField>

                  <FormField
                    label="Duration"
                    icon={<Clock className="w-5 h-5" />}
                    required
                  >
                    <Input
                      type="text"
                      placeholder="7 Days"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="h-12 rounded-2xl"
                    />
                  </FormField>
                </div>

                <FormField
                  label="Max Travelers"
                  icon={<Users className="w-5 h-5" />}
                  required
                >
                  <Input
                    type="number"
                    placeholder="e.g., 10"
                    value={formData.maxTravelers}
                    onChange={(e) => setFormData({ ...formData, maxTravelers: e.target.value })}
                    className="h-12 rounded-2xl"
                  />
                </FormField>

                <FormField
                  label="Description"
                  icon={<Info className="w-5 h-5" />}
                  required
                >
                  <textarea
                    placeholder="Describe your package in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-[120px] bg-background border border-border rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--vaykae-pink)]"
                  />
                </FormField>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <StepHeader
                icon={<Camera className="w-6 h-6" />}
                title="Package Images"
                description="Upload attractive images of your destination"
              />

              <div className="space-y-5">
                {/* Image Upload */}
                <div className="border-2 border-dashed border-border rounded-3xl p-8 text-center hover:border-[var(--vaykae-pink)] transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium mb-1">Upload Package Images</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    PNG, JPG up to 10MB (Recommended: 1200x800px)
                  </p>
                  <button
                    className="px-6 py-2.5 rounded-full bg-muted hover:bg-muted/80 text-sm transition-colors"
                  >
                    Choose Files
                  </button>
                </div>

                {/* Preview Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-2xl bg-muted flex items-center justify-center relative overflow-hidden group"
                    >
                      <Plus className="w-8 h-8 text-muted-foreground" />
                      <button className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <StepHeader
                icon={<Plane className="w-6 h-6" />}
                title="Inclusions & Exclusions"
                description="Specify what's included and excluded in your package"
              />

              <div className="space-y-6">
                {/* What's Included */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Hotel className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    What's Included
                  </h3>

                  <div className="flex gap-2 mb-3">
                    <Input
                      type="text"
                      placeholder="e.g., Hotel accommodation"
                      value={newIncluded}
                      onChange={(e) => setNewIncluded(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addIncluded()}
                      className="h-11 rounded-2xl flex-1"
                    />
                    <button
                      onClick={addIncluded}
                      className="px-4 rounded-2xl text-white"
                      style={{ background: "var(--vaykae-gradient)" }}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.included.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between bg-green-500/5 border border-green-500/20 rounded-xl p-3"
                      >
                        <span className="text-sm">{item}</span>
                        <button
                          onClick={() => removeIncluded(index)}
                          className="p-1 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* What's Excluded */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    What's Not Included
                  </h3>

                  <div className="flex gap-2 mb-3">
                    <Input
                      type="text"
                      placeholder="e.g., International flights"
                      value={newExcluded}
                      onChange={(e) => setNewExcluded(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addExcluded()}
                      className="h-11 rounded-2xl flex-1"
                    />
                    <button
                      onClick={addExcluded}
                      className="px-4 rounded-2xl text-white"
                      style={{ background: "var(--vaykae-gradient)" }}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.excluded.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between bg-red-500/5 border border-red-500/20 rounded-xl p-3"
                      >
                        <span className="text-sm">{item}</span>
                        <button
                          onClick={() => removeExcluded(index)}
                          className="p-1 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <StepHeader
                icon={<Calendar className="w-6 h-6" />}
                title="Day-by-Day Itinerary"
                description="Create a detailed itinerary for your package"
              />

              <div className="space-y-4 mb-4">
                {formData.itinerary.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-3xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ background: "var(--vaykae-gradient)" }}
                        >
                          {day.day}
                        </div>
                        <h4 className="font-semibold">Day {day.day}</h4>
                      </div>
                      <button
                        onClick={() => removeItineraryDay(index)}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    <Input
                      type="text"
                      placeholder="Day title (e.g., Arrival & City Tour)"
                      value={day.title}
                      onChange={(e) => updateItineraryDay(index, "title", e.target.value)}
                      className="h-11 rounded-2xl mb-3"
                    />

                    <textarea
                      placeholder="Day description..."
                      value={day.description}
                      onChange={(e) => updateItineraryDay(index, "description", e.target.value)}
                      className="w-full min-h-[80px] bg-background border border-border rounded-2xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--vaykae-pink)]"
                    />
                  </motion.div>
                ))}
              </div>

              <button
                onClick={addItineraryDay}
                className="w-full py-3.5 rounded-2xl border-2 border-dashed border-border hover:border-[var(--vaykae-pink)] transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Day {formData.itinerary.length + 1}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-xl border-t border-border p-4">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3.5 rounded-2xl bg-muted hover:bg-muted/80 transition-colors"
            >
              Back
            </button>
          )}
          {currentStep < totalSteps ? (
            <GradientButton fullWidth={currentStep === 1} onClick={handleNext}>
              Continue
            </GradientButton>
          ) : (
            <GradientButton fullWidth onClick={handleSubmit}>
              Create Package
            </GradientButton>
          )}
        </div>
      </div>
    </div>
  );
}

function StepHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "linear-gradient(135deg, rgba(215, 1, 168, 0.1) 0%, rgba(119, 0, 198, 0.1) 100%)" }}
      >
        <div style={{ color: "var(--vaykae-pink)" }}>{icon}</div>
      </div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function FormField({
  label,
  icon,
  required,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 mb-2 text-sm font-medium">
        <div className="text-muted-foreground" style={{ color: "var(--vaykae-pink)" }}>
          {icon}
        </div>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
