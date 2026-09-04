import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, User, Calendar } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function CreateProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [about, setAbout] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    // Store profile data
    localStorage.setItem("signup_profile", JSON.stringify({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      about,
    }));
    navigate("/signup/travel-preferences");
  };

  const isValid = firstName && lastName && gender && dateOfBirth;

  return (
    <div 
      className="h-screen w-full max-w-md mx-auto flex flex-col relative"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(141,41,206,0.1) 50%, rgba(216,1,167,0.1) 100%)"
      }}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <button
          onClick={() => navigate("/signup/otp")}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <h1 className="text-[20px] mb-2">Create Your Profile</h1>
        <p className="text-muted-foreground mb-8">
          Tell us about yourself
        </p>

        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-4 border-background shadow-lg">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-muted-foreground" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "var(--vaykae-gradient)" }}
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3">Upload profile photo</p>
        </div>

        {/* First Name */}
        <div className="mb-4">
          <label className="block mb-2">First Name</label>
          <Input
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-14 rounded-2xl bg-input-background"
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block mb-2">Last Name</label>
          <Input
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-14 rounded-2xl bg-input-background"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block mb-2">Gender</label>
          <div className="grid grid-cols-3 gap-3">
            {["Male", "Female", "Other"].map((option) => (
              <button
                key={option}
                onClick={() => setGender(option)}
                className={`h-14 rounded-2xl border-2 transition-all font-medium ${
                  gender === option
                    ? "border-transparent text-white shadow-lg"
                    : "border-border hover:border-[var(--vaykae-pink)]"
                }`}
                style={
                  gender === option
                    ? { background: "var(--vaykae-gradient)" }
                    : {}
                }
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label className="block mb-2">Date of Birth</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="pl-12 h-14 rounded-2xl bg-input-background"
            />
          </div>
        </div>

        {/* About */}
        <div className="mb-6">
          <label className="block mb-2">About (Optional)</label>
          <textarea
            placeholder="Tell us about yourself and your travel dreams..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background focus:outline-none focus:border-[var(--vaykae-pink)] resize-none transition-colors"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {about.length}/200 characters
          </p>
        </div>

        {/* Continue Button */}
        <GradientButton
          fullWidth
          onClick={handleContinue}
          disabled={!isValid}
          className="mb-4"
        >
          Continue
        </GradientButton>
      </div>
    </div>
  );
}