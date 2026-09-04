import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CreditCard, Plus, Trash2, Check } from "lucide-react";
import { GradientButton } from "../components/GradientButton";

interface PaymentMethod {
  id: string;
  type: "card" | "bank";
  last4: string;
  brand?: string;
  bankName?: string;
  isDefault: boolean;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    last4: "4242",
    brand: "Visa",
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    last4: "5555",
    brand: "Mastercard",
    isDefault: false,
  },
  {
    id: "3",
    type: "bank",
    last4: "6789",
    bankName: "Chase Bank",
    isDefault: false,
  },
];

export default function PaymentMethodsScreen() {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showAddCard, setShowAddCard] = useState(false);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this payment method?")) {
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6" style={{ maxWidth: "430px", margin: "0 auto" }}>
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Payment Methods</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Info */}
        <p className="text-sm text-muted-foreground mb-6">
          Manage your payment methods for receiving donations and withdrawals
        </p>

        {/* Payment Methods List */}
        <div className="space-y-3 mb-6">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="p-4 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(215, 1, 168, 0.1) 0%, rgba(119, 0, 198, 0.1) 100%)",
                  }}
                >
                  <CreditCard className="w-6 h-6 text-[var(--vaykae-pink)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold">
                      {method.type === "card"
                        ? method.brand
                        : method.bankName}
                    </p>
                    {method.isDefault && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                        style={{ background: "var(--vaykae-gradient)" }}
                      >
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {method.type === "card" ? "Card" : "Bank Account"} ending in{" "}
                    {method.last4}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="text-sm text-[var(--vaykae-pink)] font-medium hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="text-sm text-destructive font-medium hover:underline ml-auto"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Payment Method Button */}
        <GradientButton
          onClick={() => setShowAddCard(true)}
          fullWidth
          className="flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Payment Method
        </GradientButton>

        {/* Info Card */}
        <div className="mt-6 p-4 rounded-2xl bg-muted/50">
          <p className="text-sm text-muted-foreground">
            💳 <strong>Secure Payments:</strong> All payment information is encrypted and securely stored. We never store your full card details.
          </p>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-card rounded-t-3xl w-full max-w-[430px] p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add Payment Method</h2>
              <button
                onClick={() => setShowAddCard(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                />
              </div>

              <GradientButton
                onClick={() => setShowAddCard(false)}
                fullWidth
              >
                Add Card
              </GradientButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
