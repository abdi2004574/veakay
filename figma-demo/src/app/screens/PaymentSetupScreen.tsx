import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CreditCard, Wallet, X, Plus, Check } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { Input } from "../components/ui/input";

interface Card {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const paymentMethods = [
  {
    id: "paypal",
    name: "PayPal",
    description: "Connect your PayPal account",
    icon: "💳",
    color: "#0070BA",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Link your Stripe account",
    icon: "💰",
    color: "#635BFF",
  },
  {
    id: "bank",
    name: "Bank Account",
    description: "Add your bank details",
    icon: "🏦",
    color: "#2ECC71",
  },
];

export default function PaymentSetupScreen() {
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const navigate = useNavigate();

  const toggleMethod = (id: string) => {
    setSelectedMethods((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ");
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
      setCardNumber(formatCardNumber(cleaned));
    }
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 4) {
      setExpiryDate(formatExpiryDate(cleaned));
    }
  };

  const handleCvvChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const handleAddCard = () => {
    if (cardNumber && cardHolder && expiryDate && cvv) {
      const newCard: Card = {
        id: Date.now().toString(),
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardHolder,
        expiryDate,
        cvv,
      };
      setCards([...cards, newCard]);
      // Reset form
      setCardNumber("");
      setCardHolder("");
      setExpiryDate("");
      setCvv("");
      setShowAddCard(false);
    }
  };

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const maskCardNumber = (number: string) => {
    return "•••• •••• •••• " + number.slice(-4);
  };

  const handleComplete = () => {
    // Store payment setup
    localStorage.setItem("signup_payment", JSON.stringify({
      methods: selectedMethods,
      cards: cards,
    }));
    navigate("/signup/complete");
  };

  const isCardFormValid = cardNumber.replace(/\s/g, "").length === 16 && cardHolder && expiryDate.length === 5 && cvv.length >= 3;
  const hasAnyPaymentMethod = selectedMethods.length > 0 || cards.length > 0;

  return (
    <div 
      className="h-screen w-full max-w-md mx-auto flex flex-col"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(141,41,206,0.1) 50%, rgba(216,1,167,0.1) 100%)"
      }}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <button
          onClick={() => navigate("/signup/travel-preferences")}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <h1 className="text-[20px] mb-2">Payment Setup</h1>
        <p className="text-muted-foreground mb-8">
          Choose how you'll receive and send funds
        </p>

        {/* Info Card */}
        <div className="bg-muted/50 rounded-2xl p-4 mb-6 border border-border">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--vaykae-gradient)" }}>
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                All transactions are encrypted and secure. You can add or remove payment methods later.
              </p>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Cards</h2>
            {!showAddCard && (
              <button
                onClick={() => setShowAddCard(true)}
                className="flex items-center gap-2 text-sm text-[var(--vaykae-pink)] font-medium hover:opacity-80 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Add Card
              </button>
            )}
          </div>

          {/* Saved Cards */}
          {cards.length > 0 && (
            <div className="space-y-3 mb-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="w-full rounded-2xl border-2 border-border p-4 bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--vaykae-gradient)" }}
                    >
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{maskCardNumber(card.cardNumber)}</p>
                      <p className="text-sm text-muted-foreground">{card.cardHolder}</p>
                    </div>

                    <button
                      onClick={() => handleRemoveCard(card.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Card Form */}
          {showAddCard && (
            <div className="bg-muted/50 rounded-2xl border border-border p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Add New Card</h3>
                <button
                  onClick={() => setShowAddCard(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-sm mb-2">Card Number</label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    className="h-12 rounded-xl bg-input-background"
                  />
                </div>

                {/* Card Holder */}
                <div>
                  <label className="block text-sm mb-2">Card Holder Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    className="h-12 rounded-xl bg-input-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Expiry Date */}
                  <div>
                    <label className="block text-sm mb-2">Expiry Date</label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      className="h-12 rounded-xl bg-input-background"
                    />
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="block text-sm mb-2">CVV</label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => handleCvvChange(e.target.value)}
                      className="h-12 rounded-xl bg-input-background"
                    />
                  </div>
                </div>

                <GradientButton
                  fullWidth
                  onClick={handleAddCard}
                  disabled={!isCardFormValid}
                  className="h-12"
                >
                  Add Card
                </GradientButton>
              </div>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <h2 className="font-medium mb-4">Other Payment Methods</h2>
        <div className="space-y-3 mb-6">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => toggleMethod(method.id)}
              className={`w-full rounded-2xl border-2 transition-all p-4 ${
                selectedMethods.includes(method.id)
                  ? "border-[var(--vaykae-pink)] bg-muted/30"
                  : "border-border hover:border-[var(--vaykae-pink)]/50"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${method.color}20` }}
                >
                  {method.icon}
                </div>

                {/* Info */}
                <div className="flex-1 text-left">
                  <h3 className="font-medium mb-0.5">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>

                {/* Checkmark */}
                {selectedMethods.includes(method.id) && (
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

        {/* Skip Option */}
        <p className="text-center text-sm text-muted-foreground mb-6">
          You can skip this step and add payment methods later in settings
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <GradientButton
            fullWidth
            onClick={handleComplete}
            disabled={!hasAnyPaymentMethod}
          >
            Complete Setup
          </GradientButton>

          <button
            onClick={handleComplete}
            className="w-full h-14 rounded-2xl border-2 border-border hover:border-[var(--vaykae-pink)] transition-colors font-medium"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}