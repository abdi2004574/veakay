import { useState, useRef } from "react";
import { X, Camera, Image as ImageIcon, Type, Smile, Palette, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (story: {
    image: string;
    text?: string;
    backgroundColor?: string;
  }) => void;
}

type StoryMode = "choose" | "camera" | "edit";

export function CreateStoryModal({ isOpen, onClose, onSubmit }: CreateStoryModalProps) {
  const [mode, setMode] = useState<StoryMode>("choose");
  const [image, setImage] = useState<string>("");
  const [text, setText] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#D701A8");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textSize, setTextSize] = useState<"small" | "medium" | "large">("medium");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const backgroundColors = [
    { color: "#D701A8", name: "Magenta" },
    { color: "#7700C6", name: "Purple" },
    { color: "#FF6B6B", name: "Coral" },
    { color: "#4ECDC4", name: "Turquoise" },
    { color: "#45B7D1", name: "Sky Blue" },
    { color: "#FFA07A", name: "Salmon" },
    { color: "#98D8C8", name: "Mint" },
    { color: "#F7DC6F", name: "Yellow" },
    { color: "#1A1A1A", name: "Black" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setMode("edit");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextStory = () => {
    setImage("");
    setMode("edit");
  };

  const handleSubmit = () => {
    if (image || text) {
      onSubmit({
        image,
        text: text || undefined,
        backgroundColor: !image ? backgroundColor : undefined,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setImage("");
    setText("");
    setMode("choose");
    setBackgroundColor("#D701A8");
    setTextSize("medium");
    onClose();
  };

  const handleBack = () => {
    if (mode === "edit") {
      setMode("choose");
      setImage("");
      setText("");
    } else {
      handleClose();
    }
  };

  const textSizeClass = {
    small: "text-xl",
    medium: "text-3xl",
    large: "text-5xl",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex flex-col"
        style={{ maxWidth: "430px", margin: "0 auto", left: 0, right: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm relative z-10">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors"
          >
            {mode === "choose" ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <ArrowLeft className="w-6 h-6 text-white" />
            )}
          </button>
          <h2 className="text-lg font-bold text-white absolute left-1/2 -translate-x-1/2">
            {mode === "choose" ? "Create Story" : "Edit Story"}
          </h2>
          {mode === "edit" && (
            <button
              onClick={handleSubmit}
              disabled={!image && !text}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: (!image && !text) ? "rgba(255,255,255,0.2)" : "var(--vaykae-gradient)",
              }}
            >
              <Check className="w-6 h-6 text-white" />
            </button>
          )}
          {mode === "choose" && <div className="w-10" />}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {mode === "choose" ? (
            <motion.div
              key="choose"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center px-6 py-8"
              style={{ background: "linear-gradient(135deg, #D701A8 0%, #7700C6 100%)" }}
            >
              <div className="w-full max-w-md space-y-4">
                <p className="text-white/90 text-center text-lg mb-8 font-medium">
                  Choose how to create your story
                </p>
                
                {/* Camera Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full py-5 px-6 rounded-3xl bg-white hover:bg-white/90 transition-colors flex items-center gap-4 shadow-xl"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--vaykae-gradient)" }}>
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-lg">Take Photo</p>
                    <p className="text-sm text-muted-foreground">Capture a moment</p>
                  </div>
                </motion.button>
                
                {/* Gallery Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-5 px-6 rounded-3xl bg-white hover:bg-white/90 transition-colors flex items-center gap-4 shadow-xl"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--vaykae-gradient)" }}>
                    <ImageIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-lg">Choose Photo</p>
                    <p className="text-sm text-muted-foreground">From your gallery</p>
                  </div>
                </motion.button>
                
                {/* Text Story Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTextStory}
                  className="w-full py-5 px-6 rounded-3xl bg-white hover:bg-white/90 transition-colors flex items-center gap-4 shadow-xl"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--vaykae-gradient)" }}>
                    <Type className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-lg">Text Story</p>
                    <p className="text-sm text-muted-foreground">Share your thoughts</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 relative flex items-center justify-center"
              style={{ backgroundColor: !image ? backgroundColor : 'black' }}
            >
              {image ? (
                <>
                  <img src={image} alt="Story" className="max-w-full max-h-full object-contain" />
                  {text && (
                    <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
                      <p 
                        className={`text-center font-bold break-words max-w-full ${textSizeClass[textSize]}`}
                        style={{ 
                          color: textColor,
                          textShadow: "3px 3px 12px rgba(0,0,0,0.7), -1px -1px 2px rgba(0,0,0,0.5)"
                        }}
                      >
                        {text}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full max-w-md px-8">
                  <textarea
                    placeholder="Type your story..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    autoFocus
                    maxLength={150}
                    className={`w-full bg-transparent text-white ${textSizeClass[textSize]} font-bold text-center placeholder:text-white/40 focus:outline-none resize-none`}
                    rows={6}
                  />
                  <p className="text-center text-white/60 text-sm mt-4">
                    {text.length}/150
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tools - Only show in edit mode */}
        {mode === "edit" && (
          <div className="bg-black/90 backdrop-blur-sm p-4 space-y-4">
            {/* Text Input */}
            {image && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add text..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={50}
                  className="flex-1 h-12 px-4 rounded-full bg-white/20 text-white placeholder:text-white/50 focus:outline-none backdrop-blur-sm"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTextSize(textSize === "small" ? "medium" : textSize === "medium" ? "large" : "small")}
                    className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Type className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Color Picker - Only for text stories */}
            {!image && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-5 h-5 text-white" />
                  <span className="text-white text-sm font-medium">Background</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 px-1">
                  {backgroundColors.map((bg) => (
                    <button
                      key={bg.color}
                      onClick={() => setBackgroundColor(bg.color)}
                      className={`flex-shrink-0 flex flex-col items-center gap-2 transition-transform ${
                        backgroundColor === bg.color ? "scale-110" : ""
                      }`}
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl border-4 transition-all ${
                          backgroundColor === bg.color ? "border-white shadow-lg" : "border-transparent"
                        }`}
                        style={{ backgroundColor: bg.color }}
                      />
                      {backgroundColor === bg.color && (
                        <span className="text-white text-xs font-medium">{bg.name}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!image && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Type className="w-5 h-5 text-white" />
                  <span className="text-white text-sm font-medium">Text Size</span>
                </div>
                <div className="flex gap-2">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setTextSize(size)}
                      className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
                        textSize === size
                          ? "text-white"
                          : "bg-white/20 text-white/70"
                      }`}
                      style={textSize === size ? { background: "var(--vaykae-gradient)" } : {}}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hidden Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
        />
      </motion.div>
    </AnimatePresence>
  );
}