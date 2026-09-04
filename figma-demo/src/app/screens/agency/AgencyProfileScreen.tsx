import { useNavigate } from "react-router";
import { useState } from "react";
import {
  Edit,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  Star,
  Package,
  Users,
  Award,
} from "lucide-react";
import { GradientButton } from "../../components/GradientButton";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { AgencyHeader } from "../../components/AgencyHeader";
import { AgencySideMenu } from "../../components/AgencySideMenu";
import { useAgencyScrollContext } from "../../AgencyRoot";

export default function AgencyProfileScreen() {
  const navigate = useNavigate();
  const { hideNav, setHideNav } = useAgencyScrollContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <AgencyHeader onMenuClick={() => setMenuOpen(true)} hidden={hideNav} />

      {/* Side Menu */}
      <AgencySideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Header with Cover */}
        <div
          className="h-32 relative"
          style={{ background: "var(--veakey-gradient)" }}
        >
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-background bg-muted">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1709873582570-4f17d43921d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                alt="Agency Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pt-16 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl">Paradise Travel Co.</h1>
                <CheckCircle2
                  className="w-6 h-6"
                  style={{ color: "var(--veakey-pink)" }}
                />
              </div>
              <p className="text-muted-foreground mb-3">
                Your trusted partner for unforgettable journeys
              </p>

              {/* Reputation Score */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg">4.8</span>
                </div>
                <button
                  onClick={() => navigate("/agency/app/reviews")}
                  className="text-sm"
                  style={{ color: "var(--vaykae-pink)" }}
                >
                  View 124 reviews →
                </button>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <GradientButton
            fullWidth
            onClick={() => navigate("/agency/app/edit-profile")}
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Profile
          </GradientButton>
        </div>

        {/* Stats */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={<Package className="w-5 h-5" />}
              label="Packages"
              value="42"
            />
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="Bookings"
              value="186"
            />
            <StatCard
              icon={<Award className="w-5 h-5" />}
              label="Years"
              value="5"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="px-6 mb-6">
          <h2 className="text-lg mb-4">Contact Information</h2>
          <div className="space-y-3">
            <ContactItem
              icon={<MapPin className="w-5 h-5" />}
              label="Address"
              value="123 Travel Street, San Francisco, CA 94102"
            />
            <ContactItem
              icon={<Phone className="w-5 h-5" />}
              label="Phone"
              value="+1 (555) 123-4567"
            />
            <ContactItem
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value="contact@paradisetravelco.com"
            />
            <ContactItem
              icon={<Globe className="w-5 h-5" />}
              label="Website"
              value="www.paradisetravelco.com"
            />
          </div>
        </div>

        {/* Verification Status */}
        <div className="px-6 mb-6">
          <h2 className="text-lg mb-4">Verification & Compliance</h2>
          <div className="space-y-3">
            <VerificationItem
              label="Business License"
              status="verified"
              expiry="Expires: Dec 2026"
            />
            <VerificationItem
              label="IATA Certification"
              status="verified"
              expiry="Expires: Jan 2027"
            />
            <VerificationItem
              label="Insurance Coverage"
              status="verified"
              expiry="Expires: Jun 2026"
            />
          </div>
        </div>

        {/* About */}
        <div className="px-6 mb-6">
          <h2 className="text-lg mb-4">About Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            Paradise Travel Co. has been creating unforgettable travel experiences for over 5 years. Our
            team of expert travel consultants is dedicated to making your dream vacation a reality. We
            specialize in luxury getaways, family adventures, and custom-tailored trips to destinations
            around the world.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border text-center">
      <div
        className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, rgba(218, 1, 166, 0.1) 0%, rgba(118, 0, 197, 0.1) 100%)" }}
      >
        <div style={{ color: "var(--veakey-pink)" }}>{icon}</div>
      </div>
      <p className="text-2xl mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-sm break-all">{value}</p>
      </div>
    </div>
  );
}

function VerificationItem({
  label,
  status,
  expiry,
}: {
  label: string;
  status: "verified" | "pending" | "expired";
  expiry: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
      <div className="flex items-center gap-3">
        <CheckCircle2
          className={`w-5 h-5 ${
            status === "verified"
              ? "text-green-600 dark:text-green-400"
              : "text-muted-foreground"
          }`}
        />
        <div>
          <p className="mb-1">{label}</p>
          <p className="text-xs text-muted-foreground">{expiry}</p>
        </div>
      </div>
      <div
        className={`px-3 py-1 rounded-full text-xs ${
          status === "verified"
            ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
            : "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  );
}