import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function TermsAndConditionsScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-background overflow-y-auto pb-6">
      {/* Header */}
      <div
        className="p-6 pb-8 text-white relative overflow-hidden"
        style={{ background: "var(--veakey-gradient)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl mb-1">Terms & Conditions</h1>
        <p className="text-white/80 text-sm">Last updated: March 17, 2026</p>
      </div>

      {/* Content */}
      <div className="px-6 mt-6 space-y-6">
        <section>
          <h2 className="text-lg mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing and using Vaykae ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">2. User Accounts</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            To access certain features of the Platform, you must create an account. You are responsible for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and up-to-date information</li>
            <li>Notifying us immediately of any unauthorized access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">3. Fundraising Campaigns</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            When creating a fundraising campaign for travel, you agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Provide truthful and accurate information about your travel plans</li>
            <li>Use funds solely for the stated travel purpose</li>
            <li>Update donors on your travel progress</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">4. Donations</h2>
          <p className="text-muted-foreground leading-relaxed">
            All donations made through Vaykae are voluntary. Donors acknowledge that donations are non-refundable except as required by law. Vaykae is not responsible for how campaign creators use donated funds.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">5. Travel Agency Services</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Travel agencies using the Platform must:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Maintain proper licensing and certifications</li>
            <li>Provide accurate package information and pricing</li>
            <li>Honor all bookings made through the Platform</li>
            <li>Comply with consumer protection laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">6. Fees and Payments</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vaykae charges a platform fee on successful fundraising campaigns and travel bookings. All fees are clearly disclosed before transactions. Payment processing is handled by third-party providers subject to their terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">7. Prohibited Activities</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            You may not use Vaykae to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Engage in fraudulent or misleading activities</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Upload malicious code or interfere with Platform operations</li>
            <li>Circumvent security features or access restrictions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">8. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            All content, features, and functionality on Vaykae are owned by Vaykae and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our content without permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">9. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vaykae is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform, including travel disruptions, cancelled trips, or disputes between users and agencies.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">10. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our discretion. You may terminate your account at any time by contacting support.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">11. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the revised Terms. We will notify users of significant changes via email or Platform notifications.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">12. Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about these Terms & Conditions, please contact us at:
          </p>
          <div className="mt-3 p-4 bg-muted/50 rounded-2xl">
            <p className="text-sm">Email: legal@vaykae.com</p>
            <p className="text-sm">Address: 123 Travel Lane, Adventure City, AC 12345</p>
          </div>
        </section>
      </div>
    </div>
  );
}
