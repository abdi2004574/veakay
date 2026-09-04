import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { GradientButton } from "../components/GradientButton";

export default function ProfileCompleteScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear signup data from localStorage
    const timer = setTimeout(() => {
      localStorage.removeItem("signup_email");
      localStorage.removeItem("signup_profile");
      localStorage.removeItem("signup_preferences");
      localStorage.removeItem("signup_payment");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate("/app");
  };

  return (
    <div 
      className="h-screen w-full max-w-md mx-auto flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(141,41,206,0.1) 50%, rgba(216,1,167,0.1) 100%)"
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
        className="mb-8"
      >
        <div className="relative">
          {/* Outer glow circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute inset-0 rounded-full blur-2xl opacity-30"
            style={{ background: "var(--vaykae-gradient)" }}
          />
          
          {/* Success icon */}
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: "var(--vaykae-gradient)" }}
          >
            <CheckCircle2 className="w-20 h-20 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-3">Profile Complete!</h1>
        <p className="text-muted-foreground text-lg">
          Your Vaykae account is ready. Start your journey today!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full space-y-4"
      >
        {/* Features List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-4 mb-6">
          {[
            "Create and manage fundraising campaigns",
            "Connect with travel agencies",
            "Track donations and progress",
            "Share your journey with friends",
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "var(--vaykae-gradient)" }}
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm">{feature}</p>
            </motion.div>
          ))}
        </div>

        <GradientButton fullWidth onClick={handleGetStarted}>
          Get Started
        </GradientButton>
      </motion.div>
    </div>
  );
}