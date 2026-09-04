import { useNavigate } from "react-router";
import { Clock, CheckCircle2, Sparkles } from "lucide-react";
import { GradientButton } from "../../components/GradientButton";
import logoImage from "../../../assets/3cd1f0992c55a432ccccefc3ad8034814805f79e.png";

export default function AgencyStatusScreen() {
  const navigate = useNavigate();
  const isApproved = false; // This would come from backend in real app

  if (isApproved) {
    return (
      <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col items-center justify-center p-6">
        <div className="relative mb-8">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center relative animate-pulse"
            style={{ background: "var(--vaykae-gradient)" }}
          >
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3 text-center">Congratulations!</h1>
        <p className="text-xl mb-2 text-center font-bold" style={{ color: "var(--vaykae-pink)" }}>
          ✓ Verified Agency
        </p>

        <div className="w-full max-w-sm space-y-4 my-8">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "var(--vaykae-gradient)" }}
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold">Verified Badge</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Your agency now has a verified badge visible to all travelers
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold">Reputation Score</p>
              <div className="flex items-center gap-1">
                <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full"
                    style={{ width: "85%", background: "var(--vaykae-gradient)" }}
                  />
                </div>
                <span className="text-sm ml-2 font-medium">85/100</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Start building your reputation by delivering excellent service
            </p>
          </div>
        </div>

        <GradientButton fullWidth onClick={() => navigate("/agency/app")}>
          Go to Dashboard
        </GradientButton>
      </div>
    );
  }

  // Pending Verification
  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col items-center justify-center p-6">
      <img src={logoImage} alt="Vaykae" className="w-24 h-24 mb-8" />

      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-950 dark:to-orange-950 flex items-center justify-center">
          <Clock className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 animate-pulse" />
      </div>

      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
        style={{ background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)" }}
      >
        <div className="w-2 h-2 rounded-full bg-yellow-600 animate-pulse" />
        <span className="text-sm font-medium text-yellow-900">Status: Pending Verification</span>
      </div>

      <h1 className="text-2xl font-bold mb-3 text-center">Application Submitted!</h1>
      <p className="text-center text-muted-foreground mb-8 max-w-sm">
        Your agency profile is under review by our admin team. We'll notify you once verification is
        complete.
      </p>

      <div className="w-full max-w-sm space-y-3 mb-8">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Application Received</p>
            <p className="text-sm text-muted-foreground">Your documents are being reviewed</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 opacity-50">
          <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Verification in Progress</p>
            <p className="text-sm text-muted-foreground">Usually takes 2-3 business days</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 opacity-50">
          <Sparkles className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Account Activation</p>
            <p className="text-sm text-muted-foreground">You'll receive a confirmation email</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/select-user")}
        className="text-muted-foreground underline"
      >
        Back to Home
      </button>
    </div>
  );
}