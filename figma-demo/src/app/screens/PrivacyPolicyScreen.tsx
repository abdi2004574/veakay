import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function PrivacyPolicyScreen() {
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
        <h1 className="text-2xl mb-1">Privacy Policy</h1>
        <p className="text-white/80 text-sm">Last updated: March 17, 2026</p>
      </div>

      {/* Content */}
      <div className="px-6 mt-6 space-y-6">
        <section>
          <h2 className="text-lg mb-3">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to Vaykae. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">2. Information We Collect</h2>
          
          <h3 className="text-base mb-2 mt-4">Personal Information</h3>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We collect information you provide directly to us:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Name, email address, phone number</li>
            <li>Profile information and photos</li>
            <li>Payment and billing information</li>
            <li>Travel preferences and destinations</li>
            <li>Campaign descriptions and updates</li>
          </ul>

          <h3 className="text-base mb-2 mt-4">Automatically Collected Information</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, features used, time spent)</li>
            <li>Location data (with your permission)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">3. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We use collected information for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Providing and maintaining our services</li>
            <li>Processing transactions and sending notifications</li>
            <li>Personalizing your experience</li>
            <li>Communicating with you about updates and promotions</li>
            <li>Analyzing usage patterns to improve our Platform</li>
            <li>Preventing fraud and ensuring security</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">4. Information Sharing</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We may share your information with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Travel Agencies:</strong> When you book packages or request services</li>
            <li><strong>Service Providers:</strong> Payment processors, hosting providers, analytics services</li>
            <li><strong>Other Users:</strong> Profile information visible on campaigns and social features</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">5. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement appropriate technical and organizational measures to protect your data, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">6. Your Rights and Choices</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
            <li><strong>Object:</strong> Object to certain processing of your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-3">7. Cookies and Tracking</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookie preferences through your browser settings, though this may affect Platform functionality.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">8. Third-Party Links</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our Platform may contain links to third-party websites and services. We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing any information.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">9. Children's Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vaykae is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">10. International Data Transfers</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">11. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain your personal data for as long as necessary to provide our services and comply with legal obligations. When data is no longer needed, we securely delete or anonymize it.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">12. Changes to Privacy Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy periodically. We will notify you of significant changes via email or Platform notification. Your continued use after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-3">13. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about this Privacy Policy or to exercise your rights, please contact us at:
          </p>
          <div className="mt-3 p-4 bg-muted/50 rounded-2xl">
            <p className="text-sm">Email: privacy@vaykae.com</p>
            <p className="text-sm">Address: 123 Travel Lane, Adventure City, AC 12345</p>
            <p className="text-sm mt-2">Data Protection Officer: dpo@vaykae.com</p>
          </div>
        </section>
      </div>
    </div>
  );
}
