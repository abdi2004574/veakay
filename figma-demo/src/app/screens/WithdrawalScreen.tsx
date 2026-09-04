import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, DollarSign, Shield, Plus, Check, Building2, Wallet, Smartphone, CreditCard, ChevronRight, AlertCircle } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { motion, AnimatePresence } from "motion/react";

interface WithdrawalAccount {
  id: string;
  type: "bank" | "paypal" | "mobile" | "card";
  name: string;
  details: string;
  icon: typeof Building2;
  color: string;
}

type Step = "amount" | "confirm" | "success";

export default function WithdrawalScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAccountType, setShowAccountType] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("bank1");
  const [newAccountType, setNewAccountType] = useState<WithdrawalAccount["type"] | "">("");
  
  const availableBalance = 2450; // From wallet balance

  const [accounts, setAccounts] = useState<WithdrawalAccount[]>([
    {
      id: "bank1",
      type: "bank",
      name: "Chase Bank",
      details: "****1234",
      icon: Building2,
      color: "#0066FF"
    },
    {
      id: "paypal1",
      type: "paypal",
      name: "PayPal",
      details: "user@email.com",
      icon: Wallet,
      color: "#00457C"
    }
  ]);

  // Form states for adding new account
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountHolderName: ""
  });

  const [paypalForm, setPaypalForm] = useState({
    email: ""
  });

  const [mobileForm, setMobileForm] = useState({
    provider: "",
    phoneNumber: ""
  });

  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: ""
  });

  const accountTypes = [
    {
      type: "bank" as const,
      name: "Bank Account",
      description: "Direct bank transfer",
      icon: Building2,
      color: "#0066FF"
    },
    {
      type: "paypal" as const,
      name: "PayPal",
      description: "PayPal account",
      icon: Wallet,
      color: "#00457C"
    },
    {
      type: "mobile" as const,
      name: "Mobile Money",
      description: "M-Pesa, Venmo, etc.",
      icon: Smartphone,
      color: "#00C853"
    },
    {
      type: "card" as const,
      name: "Debit Card",
      description: "Direct to card",
      icon: CreditCard,
      color: "#FF6B35"
    }
  ];

  const handleContinueToConfirm = () => {
    if (!amount || Number(amount) > availableBalance || Number(amount) <= 0 || !selectedAccountId) {
      return;
    }
    setStep("confirm");
  };

  const handleWithdraw = () => {
    // In real app: API call to process withdrawal
    setStep("success");
  };

  const handleAddAccount = () => {
    let newAccount: WithdrawalAccount | null = null;

    if (newAccountType === "bank" && bankForm.bankName && bankForm.accountNumber) {
      newAccount = {
        id: `bank${Date.now()}`,
        type: "bank",
        name: bankForm.bankName,
        details: `****${bankForm.accountNumber.slice(-4)}`,
        icon: Building2,
        color: "#0066FF"
      };
      setBankForm({ bankName: "", accountNumber: "", routingNumber: "", accountHolderName: "" });
    } else if (newAccountType === "paypal" && paypalForm.email) {
      newAccount = {
        id: `paypal${Date.now()}`,
        type: "paypal",
        name: "PayPal",
        details: paypalForm.email,
        icon: Wallet,
        color: "#00457C"
      };
      setPaypalForm({ email: "" });
    } else if (newAccountType === "mobile" && mobileForm.provider && mobileForm.phoneNumber) {
      newAccount = {
        id: `mobile${Date.now()}`,
        type: "mobile",
        name: mobileForm.provider,
        details: mobileForm.phoneNumber,
        icon: Smartphone,
        color: "#00C853"
      };
      setMobileForm({ provider: "", phoneNumber: "" });
    } else if (newAccountType === "card" && cardForm.cardNumber && cardForm.cardHolderName) {
      newAccount = {
        id: `card${Date.now()}`,
        type: "card",
        name: "Debit Card",
        details: `****${cardForm.cardNumber.slice(-4)}`,
        icon: CreditCard,
        color: "#FF6B35"
      };
      setCardForm({ cardNumber: "", cardHolderName: "", expiryDate: "" });
    }

    if (newAccount) {
      setAccounts([...accounts, newAccount]);
      setSelectedAccountId(newAccount.id);
      setShowAddAccount(false);
      setNewAccountType("");
    }
  };

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);
  const withdrawalFee = Number(amount) > 0 ? Number(amount) * 0.025 : 0; // 2.5% fee
  const totalAmount = Number(amount) + withdrawalFee;

  // Success Screen
  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6" style={{ maxWidth: "430px", margin: "0 auto" }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
          style={{
            background: "var(--vaykae-gradient)",
            boxShadow: "0 8px 32px rgba(215, 1, 168, 0.3)",
          }}
        >
          <Check className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-2">Withdrawal Successful!</h1>
        <p className="text-muted-foreground text-center mb-2">
          ${Number(amount).toFixed(2)} will be deposited to
        </p>
        <p className="text-muted-foreground text-center mb-8">
          {selectedAccount?.name} ({selectedAccount?.details})
        </p>
        <div className="w-full p-4 rounded-2xl bg-muted/50 mb-8">
          <p className="text-sm text-muted-foreground text-center">
            💰 Processing time: 2-3 business days
          </p>
        </div>

        <GradientButton fullWidth onClick={() => navigate("/app/wallet")}>
          Back to Wallet
        </GradientButton>
      </div>
    );
  }

  // Confirmation Screen
  if (step === "confirm") {
    const Icon = selectedAccount?.icon || Building2;
    
    return (
      <div className="min-h-screen bg-background pb-6" style={{ maxWidth: "430px", margin: "0 auto" }}>
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10">
          <div className="flex items-center gap-3 px-4 h-14">
            <button
              onClick={() => setStep("amount")}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Confirm Withdrawal</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Amount Summary */}
          <div className="p-6 rounded-2xl text-center" style={{
            background: "linear-gradient(135deg, rgba(215, 1, 168, 0.1) 0%, rgba(119, 0, 198, 0.1) 100%)",
          }}>
            <p className="text-sm text-muted-foreground mb-2">Withdrawal Amount</p>
            <p className="text-4xl font-bold mb-1" style={{
              background: "var(--vaykae-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              ${Number(amount).toFixed(2)}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="rounded-2xl bg-card border border-border divide-y divide-border">
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Withdrawal To</p>
              <div className="flex items-center gap-3 mt-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: selectedAccount?.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">{selectedAccount?.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedAccount?.details}</p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Withdrawal Amount</span>
                <span className="font-medium">${Number(amount).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Processing Fee (2.5%)</span>
                <span className="font-medium">${withdrawalFee.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="font-bold">Total Deducted</span>
                <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Remaining Balance</p>
              <p className="font-bold text-lg">${(availableBalance - totalAmount).toFixed(2)}</p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="p-4 rounded-2xl bg-muted/50 flex gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--vaykae-pink)] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Important Notice</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Funds will be transferred within 2-3 business days</li>
                <li>• This action cannot be undone</li>
                <li>• You will receive a confirmation email</li>
              </ul>
            </div>
          </div>

          {/* Confirm Button */}
          <GradientButton
            fullWidth
            onClick={handleWithdraw}
          >
            Confirm Withdrawal
          </GradientButton>

          <button
            onClick={() => setStep("amount")}
            className="w-full h-12 rounded-2xl border border-border hover:bg-muted transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Amount Entry Screen
  return (
    <>
      <div className="min-h-screen bg-background flex flex-col pb-6" style={{ maxWidth: "430px", margin: "0 auto" }}>
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10">
          <div className="flex items-center gap-3 px-4 h-14">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Withdraw Funds</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Available Balance */}
          <div className="p-6 rounded-2xl mb-6 text-center relative overflow-hidden"
            style={{
              background: "var(--vaykae-gradient)",
            }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative">
              <p className="text-white/80 mb-2">Available Balance</p>
              <p className="text-4xl text-white font-bold">
                ${availableBalance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Withdrawal Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Withdrawal Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={availableBalance}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors text-lg font-medium"
              />
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="flex gap-2 mt-3">
              {[25, 50, 75, 100].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setAmount(((availableBalance * percent) / 100).toFixed(2))}
                  className="flex-1 h-10 rounded-xl border-2 border-border hover:border-[var(--vaykae-pink)] hover:bg-[var(--vaykae-pink)]/5 text-sm font-medium transition-colors"
                >
                  {percent}%
                </button>
              ))}
            </div>

            {/* Error Message */}
            {amount && Number(amount) > availableBalance && (
              <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Insufficient balance
              </p>
            )}
          </div>

          {/* Withdrawal Accounts */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Withdraw To</label>
              <button
                onClick={() => setShowAccountType(true)}
                className="text-sm flex items-center gap-1 font-bold"
                style={{ color: "var(--vaykae-pink)" }}
              >
                <Plus className="w-4 h-4" />
                Add Account
              </button>
            </div>
            
            <div className="space-y-3">
              {accounts.map((account) => {
                const Icon = account.icon;
                const isSelected = selectedAccountId === account.id;
                
                return (
                  <button
                    key={account.id}
                    onClick={() => setSelectedAccountId(account.id)}
                    className="relative w-full p-4 rounded-2xl border-2 flex items-center gap-3 transition-all"
                    style={{
                      borderColor: isSelected ? "var(--vaykae-pink)" : "var(--border)",
                      background: isSelected ? "linear-gradient(135deg, rgba(215, 1, 168, 0.05) 0%, rgba(119, 0, 198, 0.05) 100%)" : "var(--card)"
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: account.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.details}</p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--vaykae-gradient)" }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 rounded-2xl bg-muted/50 flex gap-3">
            <Shield className="w-5 h-5 text-[var(--vaykae-pink)] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Secure Withdrawal</p>
              <p className="text-muted-foreground">
                Your funds will be securely transferred within 2-3 business days. A 2.5% processing fee applies.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="px-4 pt-4 border-t border-border">
          <GradientButton
            fullWidth
            onClick={handleContinueToConfirm}
            disabled={!amount || Number(amount) > availableBalance || Number(amount) <= 0 || !selectedAccountId}
          >
            Continue to Confirmation
          </GradientButton>
        </div>
      </div>

      {/* Account Type Selection Modal */}
      {showAccountType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-card rounded-t-3xl w-full max-w-[430px] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Select Account Type</h2>
              <button
                onClick={() => setShowAccountType(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="space-y-3">
              {accountTypes.map((accountType) => {
                const Icon = accountType.icon;
                return (
                  <button
                    key={accountType.type}
                    onClick={() => {
                      setNewAccountType(accountType.type);
                      setShowAccountType(false);
                      setShowAddAccount(true);
                    }}
                    className="w-full p-4 rounded-2xl border border-border flex items-center gap-3 hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: accountType.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold">{accountType.name}</p>
                      <p className="text-sm text-muted-foreground">{accountType.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-card rounded-t-3xl w-full max-w-[430px] p-6 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {newAccountType === "bank" && "Add Bank Account"}
                {newAccountType === "paypal" && "Add PayPal Account"}
                {newAccountType === "mobile" && "Add Mobile Money"}
                {newAccountType === "card" && "Add Debit Card"}
              </h2>
              <button
                onClick={() => {
                  setShowAddAccount(false);
                  setNewAccountType("");
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              {newAccountType === "bank" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bank Name</label>
                    <input
                      placeholder="e.g., Chase Bank"
                      value={bankForm.bankName}
                      onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Account Holder Name</label>
                    <input
                      placeholder="Full name on account"
                      value={bankForm.accountHolderName}
                      onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Account Number</label>
                    <input
                      placeholder="Enter account number"
                      value={bankForm.accountNumber}
                      onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Routing Number</label>
                    <input
                      placeholder="9-digit routing number"
                      value={bankForm.routingNumber}
                      onChange={(e) => setBankForm({ ...bankForm, routingNumber: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                    />
                  </div>
                </>
              )}

              {newAccountType === "paypal" && (
                <div>
                  <label className="block text-sm font-medium mb-2">PayPal Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={paypalForm.email}
                    onChange={(e) => setPaypalForm({ ...paypalForm, email: e.target.value })}
                    className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                  />
                </div>
              )}

              {newAccountType === "mobile" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Provider</label>
                    <input
                      placeholder="e.g., M-Pesa, Venmo"
                      value={mobileForm.provider}
                      onChange={(e) => setMobileForm({ ...mobileForm, provider: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={mobileForm.phoneNumber}
                      onChange={(e) => setMobileForm({ ...mobileForm, phoneNumber: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                    />
                  </div>
                </>
              )}

              {newAccountType === "card" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                    <input
                      placeholder="Name on card"
                      value={cardForm.cardHolderName}
                      onChange={(e) => setCardForm({ ...cardForm, cardHolderName: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <input
                      placeholder="1234 5678 9012 3456"
                      value={cardForm.cardNumber}
                      onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      placeholder="MM/YY"
                      value={cardForm.expiryDate}
                      onChange={(e) => setCardForm({ ...cardForm, expiryDate: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddAccount(false);
                  setNewAccountType("");
                }}
                className="flex-1 h-12 rounded-2xl border border-border hover:bg-muted font-medium transition-colors"
              >
                Cancel
              </button>
              <GradientButton
                onClick={handleAddAccount}
                className="flex-1"
              >
                Add Account
              </GradientButton>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
