import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function AgencyPrivacyPolicyScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="p-4 pb-6 text-white relative flex-shrink-0"
        style={{ background: "var(--vaykae-gradient)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold mb-1">Agency Privacy Policy</h1>
        <p className="text-white/80 text-sm">Last updated: March 17, 2026</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-8">
        <section>
          <h2 className="text-lg mb-3">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            This Privacy Policy outlines how Vaykae collects, uses, and protects information from travel agencies ("Agency Partners") using our Platform. This policy is in addition to our general Privacy Policy and addresses agency-specific data practices.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">2. Information We Collect from Agencies</h2>
          
          <h3 className="text-base mb-2 mt-4">Business Information</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Company name, business address, contact information</li>
            <li>Business registration numbers and tax IDs</li>
            <li>Licenses, certifications, and insurance documentation</li>
            <li>Bank account and payment processing details</li>
            <li>Authorized representative information</li>
          </ul>

          <h3 className="text-base mb-2 mt-4">Operational Data</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Package listings, pricing, and availability</li>
            <li>Booking and transaction history</li>
            <li>Customer reviews and ratings</li>
            <li>Communication with travelers</li>
            <li>Performance metrics and analytics</li>
          </ul>

          <h3 className="text-base mb-2 mt-4">Usage Data</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Dashboard access logs and activity</li>
            <li>Feature usage and preferences</li>
            <li>Device and browser information</li>
            <li>IP addresses and location data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">3. How We Use Agency Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We use collected information to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Verify your credentials and maintain platform security</li>
            <li>Process bookings and facilitate payments</li>
            <li>Display your packages to potential travelers</li>
            <li>Provide analytics and performance insights</li>
            <li>Communicate important updates and opportunities</li>
            <li>Improve platform features and services</li>
            <li>Ensure compliance with legal and regulatory requirements</li>
            <li>Resolve disputes and provide customer support</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">4. Information Sharing</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Your agency information may be shared with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Travelers:</strong> Business name, contact details, packages, reviews visible to users</li>
            <li><strong>Payment Processors:</strong> Financial information for transaction processing</li>
            <li><strong>Verification Services:</strong> License and credential verification</li>
            <li><strong>Analytics Providers:</strong> Aggregated, anonymized data for insights</li>
            <li><strong>Legal Authorities:</strong> When required by law or to enforce our terms</li>
            <li><strong>Marketing Partners:</strong> With your consent, to promote your services</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            We do not sell your business information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">5. Customer Data Responsibilities</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            When you receive customer information through bookings, you must:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Use data only for providing booked services</li>
            <li>Implement appropriate security measures</li>
            <li>Comply with all applicable data protection laws (GDPR, CCPA, etc.)</li>
            <li>Not share customer data with third parties without consent</li>
            <li>Delete data when no longer needed for service provision</li>
            <li>Report any data breaches to Vaykae immediately</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            You are an independent data controller for customer data and are solely responsible for compliance with privacy laws.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">6. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We protect agency information using industry-standard security measures including encryption, secure servers, access controls, and regular security audits. Payment information is processed through PCI-DSS compliant providers. You must also maintain security best practices for your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">7. Your Rights and Choices</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            As an agency partner, you can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Access:</strong> View and export your business data</li>
            <li><strong>Update:</strong> Modify your profile and package information</li>
            <li><strong>Control Visibility:</strong> Manage which information is public</li>
            <li><strong>Communication Preferences:</strong> Choose notification settings</li>
            <li><strong>Account Closure:</strong> Request account deletion (subject to outstanding obligations)</li>
            <li><strong>Data Portability:</strong> Export your data in standard formats</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">8. Public Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your agency profile, packages, ratings, and reviews are publicly visible on the Platform. This information may be indexed by search engines. You can control the content of your public profile through your dashboard settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">9. Analytics and Performance Tracking</h2>
          <p className="text-muted-foreground leading-relaxed">
            We track performance metrics including booking rates, customer satisfaction, response times, and revenue. This data helps us improve the Platform and may be used to determine featured placement and recommendations.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">10. Marketing and Promotions</h2>
          <p className="text-muted-foreground leading-relaxed">
            With your permission, we may feature your agency in marketing materials, use your logo and content for promotional purposes, and share success stories. You can opt out of promotional activities at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">11. Third-Party Integrations</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you connect third-party tools or services (booking systems, accounting software, etc.) to your Vaykae account, those providers will have access to relevant data. Review their privacy policies before connecting.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">12. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain agency information for the duration of your partnership and for 7 years after account closure for legal, tax, and audit purposes. Transaction records may be retained longer as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">13. International Operations</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vaykae operates globally. Your information may be transferred to and processed in different countries. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">14. Compliance and Audits</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may conduct periodic compliance reviews and audits to ensure agencies meet platform standards and legal requirements. You agree to cooperate with reasonable audit requests.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">15. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We will notify agency partners of material changes to this Privacy Policy at least 30 days in advance via email and dashboard notifications. Continued use of the Platform constitutes acceptance of changes.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">16. Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            For privacy-related questions or to exercise your rights, contact us at:
          </p>
          <div className="mt-3 p-4 bg-muted/50 rounded-2xl">
            <p className="text-sm">Agency Privacy: privacy-agency@vaykae.com</p>
            <p className="text-sm">Data Protection Officer: dpo@vaykae.com</p>
            <p className="text-sm">Phone: 1-800-VAYKAE-AGENCY</p>
            <p className="text-sm mt-2">Address: 123 Travel Lane, Adventure City, AC 12345</p>
          </div>
        </section>
      </div>
    </div>
  );
}