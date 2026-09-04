import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Users, Plus, DollarSign, MessageCircle, Calendar, MapPin, Edit2, Trash2, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GradientProgress } from "../components/GradientProgress";
import { GradientButton } from "../components/GradientButton";

interface Member {
  id: number;
  name: string;
  image: string;
  contributed: number;
  isYou: boolean;
}

interface Contribution {
  id: number;
  memberId: number;
  memberName: string;
  amount: number;
  type: "donation" | "manual";
  date: Date;
  note?: string;
}

interface Expense {
  id: number;
  name: string;
  amount: number;
  paidBy: string;
  date: Date;
  category: string;
}

const initialMembers: Member[] = [
  { id: 1, name: "You", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100", contributed: 2800, isYou: true },
  { id: 2, name: "Emma Watson", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", contributed: 2100, isYou: false },
  { id: 3, name: "Alex Chen", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", contributed: 1850, isYou: false },
  { id: 4, name: "Sarah Johnson", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", contributed: 1750, isYou: false },
];

const initialContributions: Contribution[] = [
  { id: 1, memberId: 1, memberName: "You", amount: 800, type: "manual", date: new Date("2026-03-10"), note: "Flight deposit" },
  { id: 2, memberId: 2, memberName: "Emma Watson", amount: 600, type: "donation", date: new Date("2026-03-11") },
  { id: 3, memberId: 3, memberName: "Alex Chen", amount: 450, type: "donation", date: new Date("2026-03-12") },
  { id: 4, memberId: 1, memberName: "You", amount: 1000, type: "manual", date: new Date("2026-03-13"), note: "Hotel booking" },
  { id: 5, memberId: 2, memberName: "Emma Watson", amount: 1500, type: "manual", date: new Date("2026-03-14"), note: "Activities package" },
];

const initialExpenses: Expense[] = [
  { id: 1, name: "Flight Tickets", amount: 3200, paidBy: "You", date: new Date("2026-03-10"), category: "Transportation" },
  { id: 2, name: "Hotel Booking", amount: 2400, paidBy: "Emma Watson", date: new Date("2026-03-11"), category: "Accommodation" },
  { id: 3, name: "Activities Package", amount: 1500, paidBy: "Alex Chen", date: new Date("2026-03-12"), category: "Activities" },
  { id: 4, name: "Food Budget", amount: 900, paidBy: "Sarah Johnson", date: new Date("2026-03-13"), category: "Food" },
];

export default function GroupCampaignScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("id") || "1";

  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [contributions, setContributions] = useState<Contribution[]>(initialContributions);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showAddContribution, setShowAddContribution] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  // New contribution form
  const [contributionAmount, setContributionAmount] = useState("");
  const [contributionNote, setContributionNote] = useState("");

  // New expense form
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Transportation");
  const [expensePaidBy, setExpensePaidBy] = useState("You");

  const totalGoal = 12000;
  const totalRaised = members.reduce((sum, m) => sum + m.contributed, 0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddContribution = () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) return;

    const amount = parseFloat(contributionAmount);
    const newContribution: Contribution = {
      id: contributions.length + 1,
      memberId: 1,
      memberName: "You",
      amount,
      type: "manual",
      date: new Date(),
      note: contributionNote || undefined,
    };

    setContributions([newContribution, ...contributions]);

    // Update member's contribution
    setMembers(members.map(m => 
      m.isYou ? { ...m, contributed: m.contributed + amount } : m
    ));

    // Reset form
    setContributionAmount("");
    setContributionNote("");
    setShowAddContribution(false);
  };

  const handleAddExpense = () => {
    if (!expenseName || !expenseAmount || parseFloat(expenseAmount) <= 0) return;

    const amount = parseFloat(expenseAmount);
    const newExpense: Expense = {
      id: expenses.length + 1,
      name: expenseName,
      amount,
      paidBy: expensePaidBy,
      date: new Date(),
      category: expenseCategory,
    };

    setExpenses([newExpense, ...expenses]);

    // Reset form
    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("Transportation");
    setExpensePaidBy("You");
    setShowAddExpense(false);
  };

  const handleDeleteExpense = (id: number) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      setExpenses(expenses.filter(e => e.id !== id));
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
          <div className="flex-1">
            <h1 className="text-lg font-bold">Bali Bachelor Trip 2026</h1>
            <p className="text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 inline mr-1" />
              Aug 15-25, 2026
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Group Overview Card */}
        <div
          className="p-5 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(215, 1, 168, 0.15) 0%, rgba(119, 0, 198, 0.15) 100%)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--vaykae-pink)]" />
              <span className="font-bold">{members.length} Members</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Bali, Indonesia</span>
            </div>
          </div>

          {/* Total Raised */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-lg">${totalRaised.toLocaleString()}</span>
              <span className="text-muted-foreground">Goal: ${totalGoal.toLocaleString()}</span>
            </div>
            <GradientProgress value={totalRaised} max={totalGoal} showPercentage={true} />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground mb-1">Total Contributions</p>
              <p className="font-bold">${totalRaised.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
              <p className="font-bold">${totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <GradientButton onClick={() => setShowAddContribution(true)}>
            <DollarSign className="w-4 h-4 mr-2" />
            Add Contribution
          </GradientButton>
          <button
            onClick={() => setShowAddExpense(true)}
            className="h-12 rounded-2xl border-2 border-[var(--vaykae-pink)] text-[var(--vaykae-pink)] font-bold hover:bg-[var(--vaykae-pink)]/10 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>

        {/* Group Chat Button */}
        <button
          onClick={() => navigate("/app/chat/group-1")}
          className="w-full h-12 rounded-2xl bg-muted hover:bg-muted/70 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <MessageCircle className="w-5 h-5" />
          Open Group Chat
        </button>

        {/* Members Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--vaykae-pink)]" />
              Group Members
            </h2>
            <button
              onClick={() => setShowAddMember(true)}
              className="text-sm text-[var(--vaykae-pink)] font-bold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border"
              >
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold text-sm">
                    {member.name}
                    {member.isYou && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[var(--vaykae-pink)]/10 text-[var(--vaykae-pink)] font-bold">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Contributed: ${member.contributed.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {((member.contributed / totalRaised) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contributions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[var(--vaykae-pink)]" />
            <h2 className="font-bold">Recent Contributions</h2>
          </div>

          <div className="space-y-2">
            {contributions.slice(0, 5).map((contribution) => (
              <div
                key={contribution.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-bold text-sm">{contribution.memberName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {contribution.type === "donation" ? "Donation" : "Manual Entry"}
                    </span>
                    {contribution.note && (
                      <>
                        <span>•</span>
                        <span>{contribution.note}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {contribution.date.toLocaleDateString()}
                  </p>
                </div>
                <span className="font-bold text-[var(--vaykae-pink)]">
                  +${contribution.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-[var(--vaykae-pink)]" />
            <h2 className="font-bold">Expenses & Spending</h2>
          </div>

          <div className="space-y-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm">{expense.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paid by {expense.paidBy} • {expense.date.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">${expense.amount.toLocaleString()}</span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Contribution Modal */}
      {showAddContribution && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-card rounded-t-3xl w-full max-w-[430px] p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add Contribution</h2>
              <button
                onClick={() => setShowAddContribution(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Flight deposit, Hotel booking"
                  value={contributionNote}
                  onChange={(e) => setContributionNote(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                />
              </div>

              <GradientButton
                fullWidth
                onClick={handleAddContribution}
                disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
              >
                Add Contribution
              </GradientButton>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-card rounded-t-3xl w-full max-w-[430px] p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add Expense</h2>
              <button
                onClick={() => setShowAddExpense(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Expense Name</label>
                <input
                  type="text"
                  placeholder="e.g., Flight tickets, Hotel booking"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                >
                  <option value="Transportation">Transportation</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Activities">Activities</option>
                  <option value="Food">Food</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Paid By</label>
                <select
                  value={expensePaidBy}
                  onChange={(e) => setExpensePaidBy(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                >
                  {members.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <GradientButton
                fullWidth
                onClick={handleAddExpense}
                disabled={!expenseName || !expenseAmount || parseFloat(expenseAmount) <= 0}
              >
                Add Expense
              </GradientButton>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-card rounded-t-3xl w-full max-w-[430px] p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add Member</h2>
              <button
                onClick={() => setShowAddMember(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Search for friends to add to this group trip
              </p>
              <input
                type="text"
                placeholder="Search friends..."
                className="w-full h-12 px-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
