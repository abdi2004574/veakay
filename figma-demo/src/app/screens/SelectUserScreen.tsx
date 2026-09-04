import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { User, Building2, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import logoImage from "../../assets/1286f9e37f53baf48fc6fa3f4e79744fc547ef9c.png";

const userTypes = [
  {
    id: "traveler",
    title: "Traveler",
    description: "Raise funds for your dream vacation and share your journey",
    icon: User,
    image: "https://images.unsplash.com/photo-1763665033664-49d3b62d62f0?w=600",
  },
  {
    id: "agency",
    title: "Travel Agency",
    description: "Connect with travelers and offer exclusive packages",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1758518730384-be3d205838e8?w=600",
  },
];

export default function SelectUserScreen() {
  const navigate = useNavigate();

  const handleSelectUser = (type: "traveler" | "agency") => {
    localStorage.setItem("veakey_user_type", type);
    if (type === "agency") {
      navigate("/agency/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(141,41,206,0.1) 50%, rgba(216,1,167,0.1) 100%)",
      }}
    >
      {/* Header */}
      <div className="flex justify-center px-[24px] pt-[100px] pb-[0px]">
        <img src={logoImage} alt="Vaykae" className="w-[141px] h-[114px]" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to Vaykae</h1>
            <p className="text-muted-foreground">Choose how you want to continue</p>
          </div>

          {/* User Type Cards */}
          <div className="space-y-4">
            {userTypes.map((type, index) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => handleSelectUser(type.id as "traveler" | "agency")}
                className="w-full group"
              >
                <div className="relative overflow-hidden rounded-3xl bg-card border-2 border-border hover:border-transparent transition-all duration-300">
                  {/* Content */}
                  <div className="relative p-6 min-h-[160px] flex flex-col justify-between">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: "var(--vaykae-gradient)",
                          boxShadow: "0 4px 16px var(--vaykae-shadow)",
                        }}
                      >
                        <type.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-xl font-bold mb-1">
                          {type.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-end mt-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                        style={{ background: "var(--vaykae-gradient)" }}
                      >
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Gradient Border */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: "var(--vaykae-gradient)",
                      padding: "2px",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Text - Aligned to Bottom */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-muted-foreground px-6 pb-8"
      >
        By continuing, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
      </motion.p>
    </div>
  );
}