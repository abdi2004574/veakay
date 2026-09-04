import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { GradientButton } from "../components/GradientButton";
import imgImage19Slide1 from "../../assets/c9b7d3f9afa5654b8b5df5d9e9a8ddd2d656b8fe.png";
import imgImage20Slide1 from "../../assets/57e3645a8d786fb72d3fc561d52b2620be5bd861.png";
import imgImage19Slide2 from "../../assets/e6ae8806e8e5527707598481e223f679669ae8bb.png";
import imgImage19Slide3 from "../../assets/3dbb4b34fdd2e205e4622de19d0bbd75cac95e74.png";

const slides = [
  {
    title: "Fund Your Dream Vacation",
    description:
      "Turn your travel dreams into reality by creating fundraising campaigns for your next adventure.",
    backgroundImage1: imgImage19Slide1,
    backgroundImage2: imgImage20Slide1,
    hasSecondImage: true,
  },
  {
    title: "Collaborate with Travel Agencies",
    description:
      "Connect with trusted travel agencies to plan your perfect trip and get the best deals.",
    backgroundImage1: imgImage19Slide2,
    hasSecondImage: false,
  },
  {
    title: "Share Your Journey",
    description:
      "Share your travel experiences, inspire others, and build lasting memories with friends and family.",
    backgroundImage1: imgImage19Slide3,
    hasSecondImage: false,
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/select-user");
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-white">
      {/* Skip Button - Absolute positioned on top */}
      <div className="absolute top-8 right-6 z-20">
        <button
          onClick={() => navigate("/select-user")}
          className="text-black/90 hover:text-black transition-colors font-medium text-sm px-4 py-2 bg-gray-200/20 rounded-full backdrop-blur-sm"
        >
          Skip
        </button>
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Images */}
          <div className="absolute inset-0 bg-white">
            {/* Main background image container */}
            <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
              {/* Main background image */}
              <div className="relative w-full h-[60%] min-h-[522px]">
                <img
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  src={slides[currentSlide].backgroundImage1}
                />
                
                {/* Second image (only for first slide) */}
                {slides[currentSlide].hasSecondImage && (
                  <div className="absolute h-[811.888px] left-[-151.05px] top-[-235.01px] w-[616.624px]">
                    <img
                      alt=""
                      className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                      src={slides[currentSlide].backgroundImage2}
                    />
                  </div>
                )}

                {/* Gradient overlay to blend into white bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-b from-transparent via-white/50 to-white" />
              </div>
            </div>

            {/* White rounded container at bottom */}
            <div className="-translate-x-1/2 absolute backdrop-blur-[2.5px] bg-white h-[464px] left-1/2 rounded-tl-[50px] rounded-tr-[50px] shadow-[0px_4px_44px_0px_rgba(0,0,0,0.15)] top-[522px] w-[430.004px]" />
          </div>

          {/* Content in white area */}
          <div className="absolute bottom-0 left-0 right-0 h-[464px] flex flex-col items-center px-6 pt-12 pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center flex-1"
              >
                {/* Heading */}
                <h1 className="text-2xl font-bold mb-4 leading-tight px-4 max-w-[340px]">
                  {slides[currentSlide].title}
                </h1>

                {/* Description */}
                <p className="text-foreground/70 text-[15px] leading-relaxed px-4 max-w-[340px] mb-8">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Section - Fixed */}
            <div className="flex-shrink-0 space-y-6 w-full">
              {/* Pagination Dots */}
              <div className="flex justify-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: currentSlide === index ? "32px" : "8px",
                      background:
                        currentSlide === index
                          ? "var(--vaykae-gradient)"
                          : "rgba(0,0,0,0.2)",
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* CTA Button */}
              <GradientButton fullWidth onClick={nextSlide}>
                {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
              </GradientButton>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}