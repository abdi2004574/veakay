import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Camera,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  X,
  CheckCircle2,
} from "lucide-react";
import { GradientButton } from "../../components/GradientButton";
import { Input } from "../../components/ui/input";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export default function AgencyEditProfileScreen() {
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  const [agencyData, setAgencyData] = useState({
    logo: "https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=400",
    name: "Paradise Travel Co.",
    description: "Your trusted travel partner for dream vacations worldwide. Specializing in luxury tours and adventure travel.",
    email: "contact@paradisetravel.com",
    phone: "+1 (555) 123-4567",
    address: "123 Travel Street, Miami, FL 33101",
    website: "www.paradisetravel.com",
  });

  const [uploadedDocs, setUploadedDocs] = useState([
    { id: 1, name: "Business License.pdf", status: "verified" },
    { id: 2, name: "Travel Certification.pdf", status: "verified" },
  ]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAgencyData({ ...agencyData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        status: "pending",
      };
      setUploadedDocs([...uploadedDocs, newDoc]);
    }
  };

  const removeDocument = (id: number) => {
    setUploadedDocs(uploadedDocs.filter((doc) => doc.id !== id));
  };

  const handleSave = () => {
    // Save logic here
    console.log("Saving agency profile:", agencyData);
    navigate("/agency/app/profile");
  };

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <button onClick={() => navigate("/agency/app/profile")} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Edit Profile</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Logo Section */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative mb-4">
            <ImageWithFallback
              src={agencyData.logo}
              alt="Agency Logo"
              className="w-24 h-24 rounded-2xl object-cover"
            />
            <button
              onClick={() => logoInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "var(--vaykae-gradient)" }}
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-muted-foreground">Change Agency Logo</p>
        </div>

        {/* Basic Information */}
        <div className="px-6 space-y-4">
          <h2 className="font-semibold mb-3">Basic Information</h2>

          <div>
            <label className="block mb-2 text-sm font-medium">Agency Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={agencyData.name}
                onChange={(e) => setAgencyData({ ...agencyData, name: e.target.value })}
                className="pl-12 h-14 rounded-2xl"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              value={agencyData.description}
              onChange={(e) => setAgencyData({ ...agencyData, description: e.target.value })}
              className="w-full h-24 px-4 py-3 rounded-2xl border border-input bg-background resize-none"
              placeholder="Tell us about your agency..."
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                value={agencyData.email}
                onChange={(e) => setAgencyData({ ...agencyData, email: e.target.value })}
                className="pl-12 h-14 rounded-2xl"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Phone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="tel"
                value={agencyData.phone}
                onChange={(e) => setAgencyData({ ...agencyData, phone: e.target.value })}
                className="pl-12 h-14 rounded-2xl"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={agencyData.address}
                onChange={(e) => setAgencyData({ ...agencyData, address: e.target.value })}
                className="pl-12 h-14 rounded-2xl"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Website</label>
            <Input
              type="text"
              value={agencyData.website}
              onChange={(e) => setAgencyData({ ...agencyData, website: e.target.value })}
              className="h-14 rounded-2xl"
              placeholder="www.youragency.com"
            />
          </div>
        </div>

        {/* Documents Section */}
        <div className="px-6 mt-6">
          <h2 className="font-semibold mb-3">Business Documents</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload licenses, certifications, and legal documents
          </p>

          <div className="space-y-3 mb-4">
            {uploadedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-border"
              >
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {doc.status === "verified" ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-500">Verified</span>
                        </>
                      ) : (
                        <span className="text-xs text-orange-500">Pending Review</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => licenseInputRef.current?.click()}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-border hover:border-[var(--vaykae-pink)] transition-colors flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" style={{ color: "var(--vaykae-pink)" }} />
            <span style={{ color: "var(--vaykae-pink)" }}>Upload Document</span>
          </button>
          <input
            ref={licenseInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleDocumentUpload}
            className="hidden"
          />
        </div>

        {/* Save Button */}
        <div className="px-6 mt-6">
          <GradientButton fullWidth onClick={handleSave}>
            Save Changes
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
