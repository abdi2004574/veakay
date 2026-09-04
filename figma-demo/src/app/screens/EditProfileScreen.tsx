import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, User, Calendar, Mail, Phone, MapPin, Globe, Mountain, Palmtree, Building, Tent, Ship } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

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

export default function EditProfileScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile data
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200");
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Traveler");
  const [username, setUsername] = useState("johntraveler");
  const [email, setEmail] = useState("john@example.com");
  const [phone, setPhone] = useState("+1 234 567 8900");
  const [gender, setGender] = useState("Male");
  const [dateOfBirth, setDateOfBirth] = useState("1995-06-15");
  const [location, setLocation] = useState("New York, USA");
  const [about, setAbout] = useState("Travel enthusiast | Dream chaser | Adventure seeker 🌍✈️");
  
  // Preferences
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(["beach", "city"]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["solo", "luxury"]);

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

  const handleSave = () => {
    // Save profile data
    const profileData = {
      profileImage,
      firstName,
      lastName,
      username,
      email,
      phone,
      gender,
      dateOfBirth,
      location,
      about,
      selectedDestinations,
      selectedStyles,
    };
    
    localStorage.setItem("user_profile", JSON.stringify(profileData));
    navigate(-1);
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 h-16">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Edit Profile</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Photo Section */}
        <div className="p-6 flex flex-col items-center bg-gradient-to-b from-[var(--vaykae-pink)]/5 to-transparent">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg">
              <ImageWithFallback
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
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
          <p className="text-sm text-muted-foreground mt-3">Tap to change photo</p>
        </div>

        <div className="px-6 pb-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 h-12 rounded-2xl"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10 h-12 rounded-2xl"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">@</span>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-8 h-12 rounded-2xl"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Male", "Female", "Other"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setGender(option)}
                      className={`h-12 rounded-2xl border-2 transition-all font-medium ${
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
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="pl-10 h-12 rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-2xl"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12 rounded-2xl"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="pl-10 h-12 rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">About</h2>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell us about yourself and your travel dreams..."
              rows={4}
              maxLength={200}
              className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background focus:outline-none focus:border-[var(--vaykae-pink)] resize-none transition-colors"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {about.length}/200 characters
            </p>
          </div>

          {/* Travel Preferences */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Travel Preferences</h2>
            
            {/* Destination Types */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-3">Favorite Destinations</h3>
              <div className="grid grid-cols-2 gap-3">
                {destinationTypes.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => toggleDestination(dest.id)}
                    className={`h-20 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 font-medium ${
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
                    <dest.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{dest.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <h3 className="text-sm font-medium mb-3">Travel Style</h3>
              <div className="grid grid-cols-2 gap-3">
                {travelStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => toggleStyle(style.id)}
                    className={`h-12 rounded-2xl border-2 transition-all font-medium ${
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
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 border-t border-border bg-background">
        <GradientButton fullWidth onClick={handleSave}>
          Save Changes
        </GradientButton>
      </div>
    </div>
  );
}
