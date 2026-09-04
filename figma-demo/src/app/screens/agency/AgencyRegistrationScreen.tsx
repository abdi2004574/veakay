import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  Upload,
  FileText,
  Award,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { GradientButton } from "../../components/GradientButton";
import { Input } from "../../components/ui/input";

export default function AgencyRegistrationScreen() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Step 1 - Business Information
  const [agencyName, setAgencyName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Step 2 - Document Uploads
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [certifications, setCertifications] = useState<File | null>(null);
  const [legalDocs, setLegalDocs] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit to backend
      console.log("Submitting agency registration");
      navigate("/agency/status");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/agency/signup");
    }
  };

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-border">
        <button onClick={handleBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Agency Registration</h1>
          <p className="text-sm text-muted-foreground">
            Step {step} of 3
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="h-2 flex-1 rounded-full overflow-hidden bg-muted"
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: s <= step ? "100%" : "0%",
                  background: s <= step ? "var(--vaykae-gradient)" : "transparent",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ background: "var(--vaykae-gradient)" }}
              >
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">Business Information</h2>
              <p className="text-sm text-muted-foreground">
                Tell us about your travel agency
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Agency Name *</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Your Agency Name"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="pl-12 h-14 rounded-2xl"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Business Contact Number *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="pl-12 h-14 rounded-2xl"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Business Email *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="contact@agency.com"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="pl-12 h-14 rounded-2xl"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Business Address *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                <textarea
                  placeholder="Street address"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full pl-12 p-4 rounded-2xl border border-border bg-background resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-2 text-sm font-medium">City *</label>
                <Input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-12 rounded-2xl"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Zip Code *</label>
                <Input
                  type="text"
                  placeholder="12345"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="h-12 rounded-2xl"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Country *</label>
              <Input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="h-12 rounded-2xl"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ background: "var(--veakey-gradient)" }}
              >
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl mb-2">Document Upload</h2>
              <p className="text-sm text-muted-foreground">
                Upload your business documents for verification
              </p>
            </div>

            {/* Business License */}
            <UploadCard
              title="Business License"
              description="Upload your official business license"
              icon={<FileText className="w-6 h-6" />}
              file={businessLicense}
              onChange={(e) => handleFileUpload(e, setBusinessLicense)}
            />

            {/* Certifications */}
            <UploadCard
              title="Travel Certifications"
              description="IATA, ASTA or other certifications"
              icon={<Award className="w-6 h-6" />}
              file={certifications}
              onChange={(e) => handleFileUpload(e, setCertifications)}
            />

            {/* Legal Documents */}
            <UploadCard
              title="Legal Documents"
              description="Insurance, tax documents, etc."
              icon={<FileText className="w-6 h-6" />}
              file={legalDocs}
              onChange={(e) => handleFileUpload(e, setLegalDocs)}
            />

            {/* Logo */}
            <UploadCard
              title="Agency Logo"
              description="Your brand logo (PNG or JPG)"
              icon={<ImageIcon className="w-6 h-6" />}
              file={logo}
              onChange={(e) => handleFileUpload(e, setLogo)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ background: "var(--veakey-gradient)" }}
              >
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl mb-2">Review & Submit</h2>
              <p className="text-sm text-muted-foreground">
                Please review your information before submitting
              </p>
            </div>

            {/* Review Cards */}
            <div className="space-y-3">
              <ReviewCard label="Agency Name" value={agencyName} />
              <ReviewCard label="Contact Number" value={contactNumber} />
              <ReviewCard label="Business Email" value={businessEmail} />
              <ReviewCard label="Address" value={businessAddress} />
              <ReviewCard
                label="Documents Uploaded"
                value={`${[businessLicense, certifications, legalDocs, logo].filter(Boolean).length} of 4`}
              />
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-muted-foreground">
                By submitting, you confirm that all information provided is accurate and you agree to
                Veakey's agency verification process.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="p-6 border-t border-border">
        <GradientButton
          fullWidth
          onClick={handleNext}
          disabled={
            step === 1
              ? !agencyName || !contactNumber || !businessEmail || !businessAddress || !city || !country || !zipCode
              : step === 2
              ? !businessLicense || !certifications || !legalDocs || !logo
              : false
          }
        >
          {step === 3 ? "Submit for Verification" : "Continue"}
        </GradientButton>
      </div>
    </div>
  );
}

// Upload Card Component
function UploadCard({
  title,
  description,
  icon,
  file,
  onChange,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="border border-border rounded-2xl p-4">
      <label className="cursor-pointer block">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 flex items-center justify-center flex-shrink-0">
            <div style={{ color: "var(--veakey-pink)" }}>{icon}</div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
            {file ? (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="truncate">{file.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--veakey-pink)" }}>
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </div>
            )}
          </div>
        </div>
        <input type="file" className="hidden" onChange={onChange} accept=".pdf,.jpg,.jpeg,.png" />
      </label>
    </div>
  );
}

// Review Card Component
function ReviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-muted/30">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}