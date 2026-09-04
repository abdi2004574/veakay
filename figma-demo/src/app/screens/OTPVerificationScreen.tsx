import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import logoImage from "../../assets/1286f9e37f53baf48fc6fa3f4e79744fc547ef9c.png";

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const email = localStorage.getItem("signup_email") || "your email";

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    navigate("/signup/create-profile");
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div 
      className="h-screen w-full max-w-md mx-auto flex flex-col p-6"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(141,41,206,0.1) 50%, rgba(216,1,167,0.1) 100%)"
      }}
    >
      {/* Back Button */}
      <div className="pt-2 pb-4">
        <button
          onClick={() => navigate("/signup")}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logoImage} alt="Vaykae Logo" className="w-[141px] h-[114px]" />
        </div>

        <h1 className="text-[20px] mb-2">Verify Your Email</h1>
        <p className="text-muted-foreground mb-8">
          We sent a verification code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>

        {/* OTP Input */}
        <div className="flex gap-3 mb-6 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 border-border focus:border-[var(--vaykae-pink)] focus:outline-none transition-colors bg-input-background"
            />
          ))}
        </div>

        {/* Timer/Resend */}
        <div className="text-center mb-8">
          {timer > 0 ? (
            <p className="text-muted-foreground">
              Resend code in{" "}
              <span className="font-medium text-foreground">
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-[var(--vaykae-pink)] font-medium"
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Verify Button */}
        <GradientButton
          fullWidth
          onClick={handleVerify}
          disabled={!isComplete}
        >
          Verify & Continue
        </GradientButton>
      </div>
    </div>
  );
}