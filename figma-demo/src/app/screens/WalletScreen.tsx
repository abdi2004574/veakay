import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, Plus, ChevronRight, DollarSign, TrendingUp, Users, Eye, EyeOff } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";

interface Transaction {
  id: number;
  type: "received" | "withdrawn" | "pending";
  amount: number;
  from?: string;
  to?: string;
  campaignName?: string;
  date: string;
  status: "completed" | "pending" | "processing";
}

interface PaymentMethod {
  id: number;
  type: "stripe" | "paypal" | "bank";
  name: string;
  last4?: string;
  email?: string;
  isDefault: boolean;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: "received",
    amount: 50,
    from: "Sarah Johnson",
    campaignName: "Santorini Dreams",
    date: "2026-03-15",
    status: "completed",
  },
  {
    id: 2,
    type: "withdrawn",
    amount: 1500,
    to: "Bank Account ****4532",
    campaignName: "Santorini Dreams",
    date: "2026-03-14",
    status: "completed",
  },
  {
    id: 3,
    type: "received",
    amount: 100,
    from: "Michael Chen",
    campaignName: "Tokyo Explorer",
    date: "2026-03-12",
    status: "completed",
  },
  {
    id: 4,
    type: "pending",
    amount: 2000,
    to: "Withdrawal Request",
    campaignName: "Bali Adventure",
    date: "2026-03-10",
    status: "processing",
  },
  {
    id: 5,
    type: "received",
    amount: 75,
    from: "Emily Davis",
    campaignName: "Tokyo Explorer",
    date: "2026-03-08",
    status: "completed",
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    type: "stripe",
    name: "Stripe Account",
    email: "john@example.com",
    isDefault: true,
  },
  {
    id: 2,
    type: "bank",
    name: "Chase Bank",
    last4: "4532",
    isDefault: false,
  },
];

const topContributors = [
  {
    id: 1,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    totalContributed: 500,
    contributions: 5,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    totalContributed: 350,
    contributions: 4,
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    totalContributed: 300,
    contributions: 3,
  },
];

export default function WalletScreen() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<"transactions" | "methods" | "contributors">("transactions");
  const [showAddPayment, setShowAddPayment] = useState(false);

  const availableBalance = 2450;
  const pendingBalance = 2000;
  const totalReceived = 8750;
  const totalWithdrawn = 4300;

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "received":
        return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
      case "withdrawn":
        return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
      case "pending":
        return <DollarSign className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <span className="text-xs text-green-600 font-medium">Completed</span>;
      case "processing":
        return <span className="text-xs text-yellow-600 font-medium">Processing</span>;
      case "pending":
        return <span className="text-xs text-orange-600 font-medium">Pending</span>;
    }
  };

  const getPaymentMethodIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "stripe":
        return "💳";
      case "paypal":
        return "🅿️";
      case "bank":
        return "🏦";
    }
  };

  return (
    <>
      <div className="h-screen w-full max-w-md mx-auto bg-background flex flex-col" style={{ margin: "0 auto" }}>
        {/* Header */}
        <div className="flex-shrink-0 sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
          <div className="flex items-center gap-3 px-4 h-16">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">My Wallet</h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-6">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl mb-6 text-white relative overflow-hidden"
            style={{ background: "var(--vaykae-gradient)" }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Wallet className="w-6 h-6" />
                  <span className="text-sm font-medium opacity-90">Available Balance</span>
                </div>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="mb-6">
                {balanceVisible ? (
                  <h2 className="text-5xl font-bold mb-2">${availableBalance.toLocaleString()}</h2>
                ) : (
                  <h2 className="text-5xl font-bold mb-2">••••••</h2>
                )}
                <p className="text-sm opacity-80">
                  Pending: ${pendingBalance.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/app/withdrawal")}
                  className="h-11 rounded-xl bg-white text-[var(--vaykae-pink)] font-bold hover:bg-white/90 transition-colors"
                >
                  Withdraw
                </button>
                <button
                  onClick={() => setActiveTab("methods")}
                  className="h-11 rounded-xl bg-white/20 backdrop-blur-sm font-bold hover:bg-white/30 transition-colors"
                >
                  Payment Methods
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownLeft className="w-4 h-4 text-green-600" />
                <p className="text-xs text-muted-foreground">Total Received</p>
              </div>
              <p className="text-2xl font-bold text-green-600">${totalReceived.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="w-4 h-4 text-blue-600" />
                <p className="text-xs text-muted-foreground">Total Withdrawn</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">${totalWithdrawn.toLocaleString()}</p>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {[
              { key: "transactions", label: "Transactions", icon: TrendingUp },
              { key: "methods", label: "Payment Methods", icon: CreditCard },
              { key: "contributors", label: "Top Contributors", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`flex-1 h-11 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.key
                      ? "text-white shadow-lg"
                      : "bg-muted text-muted-foreground"
                  }`}
                  style={
                    activeTab === tab.key
                      ? { background: "var(--vaykae-gradient)" }
                      : {}
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <h3 className="font-bold mb-3">Transaction History</h3>
              {mockTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="font-bold">
                            {transaction.type === "received" && `From ${transaction.from}`}
                            {transaction.type === "withdrawn" && `To ${transaction.to}`}
                            {transaction.type === "pending" && "Withdrawal Request"}
                          </p>
                          {transaction.campaignName && (
                            <p className="text-xs text-muted-foreground">
                              {transaction.campaignName}
                            </p>
                          )}
                        </div>
                        <p className={`font-bold ${
                          transaction.type === "received" ? "text-green-600" :
                          transaction.type === "withdrawn" ? "text-blue-600" :
                          "text-yellow-600"
                        }`}>
                          {transaction.type === "received" ? "+" : "-"}${transaction.amount}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === "methods" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Connected Payment Methods</h3>
                <button
                  onClick={() => setShowAddPayment(true)}
                  className="w-8 h-8 rounded-full bg-[var(--vaykae-pink)] text-white flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {mockPaymentMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--vaykae-pink)]/20 to-[var(--vaykae-purple)]/20 flex items-center justify-center text-2xl">
                      {getPaymentMethodIcon(method.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold">{method.name}</p>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {method.last4 ? `••••${method.last4}` : method.email}
                      </p>
                    </div>
                    <button className="w-9 h-9 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}

              <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20">
                <p className="text-sm text-muted-foreground mb-3">
                  Connect your payment method to receive donations and withdraw funds securely.
                </p>
                <GradientButton fullWidth onClick={() => setShowAddPayment(true)}>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Payment Method
                </GradientButton>
              </div>
            </motion.div>
          )}

          {/* Top Contributors Tab */}
          {activeTab === "contributors" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <h3 className="font-bold mb-3">Top Contributors</h3>
              {topContributors.map((contributor, index) => (
                <motion.div
                  key={contributor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <ImageWithFallback
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {index < 3 && (
                        <div
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: "var(--vaykae-gradient)" }}
                        >
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold mb-0.5">{contributor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contributor.contributions} {contributor.contributions === 1 ? "contribution" : "contributions"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[var(--vaykae-pink)]">
                        ${contributor.totalContributed}
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20 text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-[var(--vaykae-pink)]" />
                <h4 className="font-bold mb-2">Thank Your Contributors!</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Show appreciation to those who helped make your dreams come true.
                </p>
                <button className="h-11 px-6 rounded-xl bg-muted hover:bg-muted/70 font-bold transition-colors">
                  Send Thank You Messages
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <AnimatePresence>
        {showAddPayment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowAddPayment(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl p-6"
              style={{ maxWidth: "430px", margin: "0 auto" }}
            >
              <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-6" />
              
              <h3 className="text-xl font-bold mb-2">Add Payment Method</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Choose how you want to receive payments and withdraw funds.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  {
                    type: "stripe",
                    icon: "💳",
                    name: "Stripe",
                    description: "Connect your Stripe account",
                  },
                  {
                    type: "paypal",
                    icon: "🅿️",
                    name: "PayPal",
                    description: "Link your PayPal account",
                  },
                  {
                    type: "bank",
                    icon: "🏦",
                    name: "Bank Account",
                    description: "Add bank account details",
                  },
                ].map((option) => (
                  <button
                    key={option.type}
                    onClick={() => {
                      // Navigate to connection flow
                      setShowAddPayment(false);
                    }}
                    className="w-full p-4 rounded-2xl border-2 border-border hover:border-[var(--vaykae-pink)] transition-all text-left flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--vaykae-pink)]/20 to-[var(--vaykae-purple)]/20 flex items-center justify-center text-2xl">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{option.name}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddPayment(false)}
                className="w-full h-12 rounded-2xl border-2 border-border font-bold hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}