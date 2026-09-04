import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MessageCircle, Mail, Phone, HelpCircle, Send, CheckCircle2 } from "lucide-react";
import { GradientButton } from "../../components/GradientButton";
import { Input } from "../../components/ui/input";
import { motion } from "motion/react";

export default function AgencySupportScreen() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const supportCategories = [
    { id: "technical", label: "Technical Issue", icon: "🔧" },
    { id: "payment", label: "Payment & Billing", icon: "💳" },
    { id: "account", label: "Account Help", icon: "👤" },
    { id: "booking", label: "Booking Issue", icon: "📅" },
    { id: "other", label: "Other", icon: "💬" },
  ];

  const faqs = [
    {
      question: "How do I verify my agency?",
      answer: "Upload required documents in Settings > Update Documents. Verification takes 2-3 business days.",
    },
    {
      question: "What are the commission rates?",
      answer: "Commission rates vary by subscription tier: Basic (15%), Premium (10%), Featured (8%).",
    },
    {
      question: "How do I create a package?",
      answer: "Navigate to Packages tab and click the + button. Fill in all required details across 4 steps.",
    },
    {
      question: "When do I receive payments?",
      answer: "Payments are processed within 7 days of trip completion. You can track them in Revenue section.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate("/agency/app/settings");
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--vaykae-gradient)" }}
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
          <p className="text-muted-foreground mb-4">
            Our support team will respond within 24 hours.
          </p>
          <p className="text-sm text-muted-foreground">
            Check your email for updates.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/agency/app/settings")}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Help & Support</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Contact Options */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:shadow-md transition-all">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "var(--vaykae-gradient-light)" }}
              >
                <MessageCircle className="w-6 h-6" style={{ color: "var(--vaykae-pink)" }} />
              </div>
              <span className="text-xs font-medium">Live Chat</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:shadow-md transition-all">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "var(--vaykae-gradient-light)" }}
              >
                <Mail className="w-6 h-6" style={{ color: "var(--vaykae-pink)" }} />
              </div>
              <span className="text-xs font-medium">Email</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:shadow-md transition-all">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "var(--vaykae-gradient-light)" }}
              >
                <Phone className="w-6 h-6" style={{ color: "var(--vaykae-pink)" }} />
              </div>
              <span className="text-xs font-medium">Call</span>
            </button>
          </div>
        </div>

        {/* Submit Request Form */}
        <div className="px-6 pb-6">
          <h2 className="text-lg font-semibold mb-4">Submit a Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {supportCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      selectedCategory === cat.id
                        ? "border-purple-300 bg-gradient-to-br from-purple-500/5 to-pink-500/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <Input
                type="text"
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-12 rounded-2xl"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                placeholder="Describe your issue in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[120px] bg-background border border-border rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--vaykae-pink)]"
                required
              />
            </div>

            <GradientButton fullWidth type="submit">
              <Send className="w-5 h-5 mr-2" />
              Submit Request
            </GradientButton>
          </form>
        </div>

        {/* FAQs */}
        <div className="px-6 pb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" style={{ color: "var(--vaykae-pink)" }} />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-card rounded-2xl border border-border overflow-hidden group"
              >
                <summary className="p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <span className="font-medium pr-4">{faq.question}</span>
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </div>
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Support Hours */}
        <div className="px-6 pb-6">
          <div className="bg-muted/30 rounded-2xl p-4">
            <h3 className="font-semibold mb-2">Support Hours</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
              <p>Saturday: 10:00 AM - 4:00 PM PST</p>
              <p>Sunday: Closed</p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Average response time: 2-4 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
