import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function AgencyTermsAndConditionsScreen() {
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
        <h1 className="text-2xl font-bold mb-1">Agency Terms & Conditions</h1>
        <p className="text-white/80 text-sm">Last updated: March 17, 2026</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-8">
        <section>
          <h2 className="text-lg mb-3">1. Agency Registration</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            By registering as a travel agency on Vaykae, you represent and warrant that:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>You possess all necessary licenses and certifications to operate as a travel agency</li>
            <li>You are authorized to enter into this agreement</li>
            <li>All information provided during registration is accurate and current</li>
            <li>You will maintain compliance with all applicable travel industry regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">2. Agency Verification</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vaykae reserves the right to verify your credentials, licenses, and business information. You agree to provide all necessary documentation upon request. Failure to complete verification may result in account suspension or termination.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">3. Package Creation and Listings</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            When creating travel packages, you must:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Provide accurate, complete, and truthful descriptions</li>
            <li>Include all relevant terms, conditions, and restrictions</li>
            <li>Clearly disclose all costs, fees, and additional charges</li>
            <li>Update availability and pricing in real-time</li>
            <li>Include high-quality images that accurately represent the package</li>
            <li>Comply with all advertising and consumer protection laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">4. Booking Management</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            You agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Honor all confirmed bookings made through the Platform</li>
            <li>Respond to booking requests within 24 hours</li>
            <li>Provide timely confirmations and travel documents</li>
            <li>Communicate clearly with travelers about itinerary changes</li>
            <li>Handle cancellations and refunds according to your stated policies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">5. Commission and Fees</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Vaykae charges a commission on completed bookings:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Standard commission: 12-15% of package price</li>
            <li>Subscription plans available for reduced commission rates</li>
            <li>Payment processing fees apply to all transactions</li>
            <li>Commission is non-refundable once services are rendered</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Detailed fee schedules are available in your agency dashboard.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">6. Payment Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            Payments for bookings are held by Vaykae and released to your account within 7-14 business days after trip completion or service delivery. You are responsible for any applicable taxes on your earnings.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">7. Customer Service</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            You are responsible for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Providing professional customer service to travelers</li>
            <li>Handling customer inquiries, complaints, and disputes</li>
            <li>Maintaining a minimum rating of 4.0 stars</li>
            <li>Responding to customer messages within 24 hours</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">8. Quality Standards</h2>
          <p className="text-muted-foreground leading-relaxed">
            Agencies must maintain high service quality standards. Vaykae reserves the right to remove packages, suspend accounts, or terminate partnerships with agencies that receive multiple complaints, poor ratings, or violate quality standards.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">9. Insurance and Liability</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            You must:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Maintain appropriate liability insurance coverage</li>
            <li>Provide travel insurance options to customers</li>
            <li>Comply with all safety regulations and guidelines</li>
            <li>Handle all liability claims directly with affected parties</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Vaykae is not liable for any incidents, accidents, or issues that occur during travel arranged through your agency.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">10. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            You retain ownership of your content (descriptions, images, branding). By posting on Vaykae, you grant us a license to display and promote your packages. You must have rights to all content you upload.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">11. Prohibited Activities</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Agencies may not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Engage in fraudulent or deceptive practices</li>
            <li>Manipulate reviews or ratings</li>
            <li>Contact customers outside the Platform to avoid fees</li>
            <li>Offer packages for illegal activities</li>
            <li>Discriminate against customers based on protected characteristics</li>
            <li>Share customer information with third parties without consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">12. Data Protection</h2>
          <p className="text-muted-foreground leading-relaxed">
            You must comply with all data protection laws including GDPR and CCPA. Customer data obtained through Vaykae may only be used for providing booked services and must be protected with appropriate security measures.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">13. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            Either party may terminate this agreement with 30 days notice. Vaykae may immediately suspend or terminate your account for violations of these terms, fraudulent activity, or poor performance. Outstanding bookings must be honored after termination.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">14. Dispute Resolution</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vaykae provides mediation services for disputes between agencies and travelers. You agree to participate in good faith in dispute resolution processes. Unresolved disputes may be subject to binding arbitration.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">15. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update these terms with 30 days notice to active agencies. Continued use of the Platform after changes constitutes acceptance. Material changes affecting fees or commissions will require explicit agreement.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">16. Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            For agency-specific inquiries, contact our Agency Support team:
          </p>
          <div className="mt-3 p-4 bg-muted/50 rounded-2xl">
            <p className="text-sm">Email: agency@vaykae.com</p>
            <p className="text-sm">Phone: 1-800-VAYKAE-AGENCY</p>
            <p className="text-sm">Address: 123 Travel Lane, Adventure City, AC 12345</p>
          </div>
        </section>
      </div>
    </div>
  );
}