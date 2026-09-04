import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Share2, Heart, MessageCircle, CreditCard, Wallet, Check, CheckCircle2, Gift, MapPin, Calendar, Users, TrendingUp, Eye, X, ChevronLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GradientProgress } from "../components/GradientProgress";
import { GradientButton } from "../components/GradientButton";
import { Input } from "../components/ui/input";
import { motion, AnimatePresence } from "motion/react";

const topContributors = [
  { name: "Sarah Johnson", amount: 500, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
  { name: "Mike Davis", amount: 350, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
  { name: "Lisa Chen", amount: 200, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
];

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    description: "•••• •••• •••• 4242",
    icon: CreditCard,
    color: "#E74C3C",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "john.doe@email.com",
    icon: Wallet,
    color: "#0070BA",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Linked account",
    icon: Wallet,
    color: "#635BFF",
  },
  {
    id: "bank",
    name: "Bank Account",
    description: "•••• 5678",
    icon: Wallet,
    color: "#2ECC71",
  },
];

export default function CampaignDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationStep, setDonationStep] = useState<"amount" | "payment" | "success">("amount");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isGiftMode, setIsGiftMode] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [giftOccasion, setGiftOccasion] = useState("");

  // Simulated real-time campaign data
  const [campaignData, setCampaignData] = useState({
    raised: 3500,
    goal: 5000,
    donors: 42,
    views: 234,
  });

  const handleDonateSuccess = () => {
    // Simulate real-time progress update
    const amount = parseFloat(donationAmount);
    setCampaignData(prev => ({
      ...prev,
      raised: prev.raised + amount,
      donors: prev.donors + 1,
    }));
  };

  const closeDialog = () => {
    setShowDonateDialog(false);
    setTimeout(() => {
      setDonationStep("amount");
      setDonationAmount("");
      setSelectedPayment("");
      setIsGiftMode(false);
      setGiftMessage("");
      setGiftOccasion("");
    }, 300);
  };

  const handleBackStep = () => {
    if (donationStep === "payment") {
      setDonationStep("amount");
    } else if (donationStep === "success") {
      closeDialog();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background pb-4" style={{ maxWidth: "430px", margin: "0 auto" }}>
        {/* Header Image */}
        <div className="relative">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800"
            alt="Campaign"
            className="w-full aspect-[4/3] object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
            <Share2 className="w-5 h-5" />
          </button>
          
          {/* Gift Mode Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Gift className="w-4 h-4 text-[var(--vaykae-pink)]" />
              Gift Mode Active
            </span>
          </div>
        </div>

        <div className="px-4 py-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
              alt="Emma Watson"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-bold">Emma Watson</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Santorini, Greece
              </p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/70 text-sm font-bold transition-colors">
              Follow
            </button>
          </div>

          {/* Campaign Details */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-2xl font-bold">My Dream to Visit Santorini</h2>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Aug 15, 2026
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {campaignData.views} views
              </span>
            </div>
          </div>

          {/* Story */}
          <div className="mb-6">
            <p className="text-muted-foreground leading-relaxed">
              I've always dreamed of watching the sunset over the white cliffs of Santorini. 
              This trip represents a personal milestone for me, celebrating my graduation and 
              the beginning of a new chapter. Your support would mean the world to me! 🌅
            </p>
          </div>

          {/* Progress Card - Real-time updates */}
          <motion.div
            key={campaignData.raised}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 0.3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-3xl font-bold">${campaignData.raised.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  raised of ${campaignData.goal.toLocaleString()} goal
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{campaignData.donors}</p>
                <p className="text-sm text-muted-foreground">donors</p>
              </div>
            </div>
            <GradientProgress 
              value={campaignData.raised} 
              max={campaignData.goal} 
              showPercentage={true} 
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {Math.round((campaignData.raised / campaignData.goal) * 100)}% funded
              </span>
              <span className="text-sm font-bold text-[var(--vaykae-pink)]">
                ${(campaignData.goal - campaignData.raised).toLocaleString()} to go
              </span>
            </div>
          </motion.div>

          {/* Top Contributors */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--vaykae-pink)]" />
              Top Contributors
            </h3>
            <div className="space-y-3">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                  <div className="relative">
                    <ImageWithFallback
                      src={contributor.image}
                      alt={contributor.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                        👑
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{contributor.name}</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                  <p className="font-bold text-[var(--vaykae-pink)]">${contributor.amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            <GradientButton
              fullWidth
              onClick={() => setShowDonateDialog(true)}
            >
              <Gift className="w-5 h-5 mr-2" />
              Donate Now
            </GradientButton>
            <button className="px-6 py-3 rounded-2xl border-2 border-border hover:bg-muted transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="px-6 py-3 rounded-2xl border-2 border-border hover:bg-muted transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet Donate Modal */}
      <AnimatePresence>
        {showDonateDialog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={closeDialog}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl"
              style={{ maxWidth: "430px", margin: "0 auto", maxHeight: "90vh" }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-card rounded-t-3xl border-b border-border z-10">
                {/* Handle Bar */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 bg-muted rounded-full" />
                </div>

                <div className="flex items-center justify-between px-6 pb-4">
                  {donationStep !== "amount" && donationStep !== "success" && (
                    <button
                      onClick={handleBackStep}
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  {(donationStep === "amount" || donationStep === "success") && <div className="w-9" />}
                  
                  <h2 className="text-lg font-bold flex-1 text-center">
                    {donationStep === "amount" && "Make a Donation"}
                    {donationStep === "payment" && "Payment Method"}
                    {donationStep === "success" && "Success!"}
                  </h2>
                  
                  <button
                    onClick={closeDialog}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: "calc(90vh - 120px)" }}>
                {donationStep === "amount" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4 pt-4"
                  >
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Support Emma Watson's dream trip to Santorini
                    </p>

                    {/* Gift Mode Toggle */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Gift className="w-5 h-5 text-[var(--vaykae-pink)]" />
                          <span className="font-bold">Gift this donation</span>
                        </div>
                        <button
                          onClick={() => setIsGiftMode(!isGiftMode)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            isGiftMode ? "bg-[var(--vaykae-pink)]" : "bg-muted"
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              isGiftMode ? "translate-x-6" : ""
                            }`}
                          />
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {isGiftMode && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-3 mt-3 overflow-hidden"
                          >
                            <div>
                              <label className="block text-xs font-bold mb-1.5">Occasion</label>
                              <select
                                value={giftOccasion}
                                onChange={(e) => setGiftOccasion(e.target.value)}
                                className="w-full h-11 px-3 rounded-xl bg-input-background border border-border text-sm"
                              >
                                <option value="">Select occasion</option>
                                <option value="Birthday">Birthday 🎂</option>
                                <option value="Graduation">Graduation 🎓</option>
                                <option value="Wedding">Wedding 💍</option>
                                <option value="Anniversary">Anniversary ❤️</option>
                                <option value="Congratulations">Congratulations 🎉</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold mb-1.5">Gift Message</label>
                              <textarea
                                value={giftMessage}
                                onChange={(e) => setGiftMessage(e.target.value)}
                                placeholder="Add a personal message..."
                                className="w-full h-20 px-3 py-2 rounded-xl bg-input-background border border-border text-sm resize-none"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="block mb-2 font-bold text-sm">Amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          className="h-14 pl-8 pr-4 rounded-2xl text-lg font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[25, 50, 100].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setDonationAmount(amount.toString())}
                          className={`h-12 rounded-xl border-2 transition-all font-bold ${
                            donationAmount === amount.toString()
                              ? "border-[var(--vaykae-pink)] bg-[var(--vaykae-pink)]/10 text-[var(--vaykae-pink)]"
                              : "border-border hover:border-[var(--vaykae-pink)]/50"
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <GradientButton
                        fullWidth
                        onClick={() => setDonationStep("payment")}
                        disabled={!donationAmount || Number(donationAmount) <= 0}
                        className="h-14"
                      >
                        Continue
                      </GradientButton>
                    </div>
                  </motion.div>
                )}

                {donationStep === "payment" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4 pt-4"
                  >
                    {/* Amount Summary */}
                    <div className="bg-muted/50 rounded-2xl p-4 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground font-medium">Donation Amount</span>
                        <span className="text-2xl font-bold">${donationAmount}</span>
                      </div>
                      {isGiftMode && giftOccasion && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <div className="flex items-center gap-2 text-sm">
                            <Gift className="w-4 h-4 text-[var(--vaykae-pink)]" />
                            <span className="font-bold text-[var(--vaykae-pink)]">{giftOccasion} Gift</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Methods */}
                    <div>
                      <label className="block mb-3 font-bold text-sm">Choose Payment Method</label>
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setSelectedPayment(method.id)}
                            className={`w-full rounded-2xl border-2 transition-all p-4 ${
                              selectedPayment === method.id
                                ? "border-[var(--vaykae-pink)] bg-[var(--vaykae-pink)]/5"
                                : "border-border hover:border-[var(--vaykae-pink)]/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${method.color}20` }}
                              >
                                <method.icon className="w-5 h-5" style={{ color: method.color }} />
                              </div>

                              <div className="flex-1 text-left">
                                <p className="font-bold text-sm mb-0.5">{method.name}</p>
                                <p className="text-xs text-muted-foreground">{method.description}</p>
                              </div>

                              {selectedPayment === method.id && (
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ background: "var(--vaykae-gradient)" }}
                                >
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <GradientButton
                        fullWidth
                        onClick={() => {
                          setDonationStep("success");
                          handleDonateSuccess();
                        }}
                        disabled={!selectedPayment}
                        className="h-14"
                      >
                        Donate ${donationAmount}
                      </GradientButton>
                    </div>
                  </motion.div>
                )}

                {donationStep === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-6"
                  >
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.1,
                        }}
                        className="relative"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="absolute inset-0 rounded-full blur-2xl opacity-30"
                          style={{ background: "var(--vaykae-gradient)" }}
                        />
                        
                        <div
                          className="relative w-24 h-24 rounded-full flex items-center justify-center"
                          style={{ background: "var(--vaykae-gradient)" }}
                        >
                          <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
                        </div>
                      </motion.div>
                    </div>

                    {/* Success Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center mb-6"
                    >
                      <h2 className="text-2xl font-bold mb-2">
                        {isGiftMode ? "Gift Sent! 🎁" : "Donation Successful!"}
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Thank you for your generous {isGiftMode ? "gift" : "donation"} of{" "}
                        <span className="font-bold text-foreground">${donationAmount}</span>
                      </p>
                      
                      {isGiftMode && giftOccasion && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20 mb-4">
                          <p className="text-sm font-bold text-[var(--vaykae-pink)] mb-1">
                            {giftOccasion} Gift
                          </p>
                          {giftMessage && (
                            <p className="text-sm text-muted-foreground italic">
                              "{giftMessage}"
                            </p>
                          )}
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground">
                        Your support brings Emma one step closer to their dream destination.
                      </p>
                    </motion.div>

                    {/* Success Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-muted/50 rounded-2xl p-4 border border-border mb-6"
                    >
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transaction ID</span>
                          <span className="font-bold">#DN{Math.floor(Math.random() * 100000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Method</span>
                          <span className="font-bold">
                            {paymentMethods.find(m => m.id === selectedPayment)?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span className="font-bold">{new Date().toLocaleDateString()}</span>
                        </div>
                        {isGiftMode && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type</span>
                            <span className="font-bold flex items-center gap-1">
                              <Gift className="w-4 h-4 text-[var(--vaykae-pink)]" />
                              Gift Donation
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Close Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <GradientButton
                        fullWidth
                        onClick={closeDialog}
                        className="h-14"
                      >
                        Done
                      </GradientButton>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
