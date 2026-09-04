import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, DollarSign, TrendingUp, Clock, CheckCircle2, Download } from "lucide-react";
import { GradientButton } from "../../components/GradientButton";

const transactions = [
  {
    id: 1,
    tripName: "Romantic Paris Getaway",
    travelerName: "Sarah Johnson",
    amount: 2499,
    commission: 249.90,
    status: "completed",
    date: "Mar 1, 2026",
  },
  {
    id: 2,
    tripName: "Tokyo Adventure Tour",
    travelerName: "Mike Chen",
    amount: 3299,
    commission: 329.90,
    status: "completed",
    date: "Feb 28, 2026",
  },
  {
    id: 3,
    tripName: "Bali Beach Paradise",
    travelerName: "Emily Davis",
    amount: 1899,
    commission: 189.90,
    status: "pending",
    date: "Mar 3, 2026",
  },
];

const subscriptionTiers = [
  {
    name: "Basic",
    price: 0,
    commission: "15%",
    features: ["List up to 10 packages", "Basic analytics", "Email support"],
    isRecommended: false,
  },
  {
    name: "Premium",
    price: 49,
    commission: "10%",
    features: [
      "Unlimited packages",
      "Advanced analytics",
      "Priority support",
      "Featured placement",
    ],
    isRecommended: true,
  },
  {
    name: "Featured",
    price: 99,
    commission: "8%",
    features: [
      "Everything in Premium",
      "Top of search results",
      "Dedicated account manager",
      "Custom branding",
    ],
    isRecommended: false,
  },
];

export default function AgencyRevenueScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/agency/app")}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Revenue & Payments</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Stats Header */}
        <div
          className="p-6 pb-8 text-white relative overflow-hidden"
          style={{ background: "var(--vaykae-gradient)" }}
        >
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm text-white/80">Total Earnings</span>
              </div>
              <p className="text-2xl font-bold">$42,850</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm text-white/80">Pending</span>
              </div>
              <p className="text-2xl font-bold">$1,899</p>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
        </div>

        {/* Commission Info */}
        <div className="px-6 py-4">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Current Commission Rate</span>
              <span className="text-xl font-bold">10%</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--vaykae-pink)" }}>
              <TrendingUp className="w-4 h-4" />
              <span>Premium Tier</span>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Transaction History</h2>
            <button className="flex items-center gap-2 text-sm" style={{ color: "var(--vaykae-pink)" }}>
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 truncate">{transaction.tripName}</h3>
                    <p className="text-sm text-muted-foreground">{transaction.travelerName}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ml-2 ${
                      transaction.status === "completed"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-yellow-500/10 text-yellow-600"
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Your Commission</p>
                    <p className="text-lg font-bold">${transaction.commission}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Trip Total</p>
                    <p className="text-sm font-medium">${transaction.amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Date</p>
                    <p className="text-sm font-medium">{transaction.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="px-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Subscription Tiers</h2>
          <div className="space-y-3">
            {subscriptionTiers.map((tier) => (
              <div
                key={tier.name}
                className={`bg-card rounded-2xl p-4 border ${
                  tier.isRecommended
                    ? "border-purple-300"
                    : "border-border"
                } relative overflow-hidden`}
              >
                {tier.isRecommended && (
                  <div
                    className="absolute top-0 right-0 px-3 py-1 text-xs text-white rounded-bl-xl"
                    style={{ background: "var(--vaykae-gradient)" }}
                  >
                    Recommended
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold">${tier.price}</span>
                    <span className="text-muted-foreground mb-1">/month</span>
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-muted text-sm">
                    {tier.commission} commission
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.isRecommended ? (
                  <GradientButton fullWidth onClick={() => {}}>
                    Upgrade Now
                  </GradientButton>
                ) : (
                  <button className="w-full h-11 rounded-full border border-border hover:border-purple-300 transition-colors font-medium">
                    {tier.name === "Basic" ? "Current Plan" : "Select Plan"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
