import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Send, Paperclip, Phone, Video, MoreVertical, X, Image as ImageIcon, FileText, Download, Check, CheckCheck, Users, UserPlus, UserMinus, Camera, Mic } from "lucide-react";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";

type MessageStatus = "sent" | "delivered" | "read";

interface Message {
  id: number;
  sender: "me" | "other" | string;
  text?: string;
  time: string;
  status?: MessageStatus;
  type: "text" | "image" | "document" | "video";
  media?: {
    url: string;
    name?: string;
    size?: string;
  };
  senderName?: string;
  senderImage?: string;
}

// Mock chat data
const chatData: Record<string, {
  type: "friend" | "agency" | "group";
  name: string;
  image: string;
  status?: string;
  members?: { name: string; image: string; }[];
}> = {
  "1": {
    type: "friend",
    name: "Emma Watson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    status: "Online",
  },
  "2": {
    type: "agency",
    name: "Dream Travel Agency",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100",
    status: "Available",
  },
  "3": {
    type: "group",
    name: "Bali Group Trip 2026",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100",
    status: "5 members",
    members: [
      { name: "Emma", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
      { name: "Alex", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
      { name: "Maria", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
      { name: "You", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
    ],
  },
};

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "other",
    text: "Hey! Thanks for checking out my campaign!",
    time: "10:30 AM",
    status: "read",
    type: "text",
  },
  {
    id: 2,
    sender: "me",
    text: "Of course! Your trip to Paris looks amazing!",
    time: "10:32 AM",
    status: "read",
    type: "text",
  },
  {
    id: 3,
    sender: "other",
    text: "Thank you! I've been dreaming about this for years 😊",
    time: "10:33 AM",
    status: "read",
    type: "text",
  },
  {
    id: 4,
    sender: "me",
    type: "image",
    time: "10:34 AM",
    status: "read",
    media: {
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
    },
  },
  {
    id: 5,
    sender: "me",
    text: "I'd love to contribute! What's your favorite spot in Paris?",
    time: "10:35 AM",
    status: "delivered",
    type: "text",
  },
  {
    id: 6,
    sender: "other",
    text: "Definitely the Eiffel Tower at sunset! It's magical ✨",
    time: "10:37 AM",
    status: "sent",
    type: "text",
  },
];

export default function ChatDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [showOptions, setShowOptions] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const chat = chatData[id || "1"] || {
    type: "friend" as const,
    name: "User",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    status: "Online",
  };
  
  const isAgency = chat.type === "agency";
  const isGroup = chat.type === "group";

  const handleSend = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "me",
        text: messageText,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
        type: "text",
      };
      setMessages([...messages, newMessage]);
      setMessageText("");

      // Simulate status updates
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        ));
      }, 1000);

      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg
        ));
      }, 2000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMessage: Message = {
          id: messages.length + 1,
          sender: "me",
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          status: "sent",
          type: "image",
          media: {
            url: reader.result as string,
          },
        };
        setMessages([...messages, newMessage]);
        setShowMediaPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "me",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
        type: "document",
        media: {
          url: "#",
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
        },
      };
      setMessages([...messages, newMessage]);
      setShowMediaPicker(false);
    }
  };

  const getStatusIcon = (status?: MessageStatus) => {
    switch (status) {
      case "sent":
        return <Check className="w-3 h-3" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-[var(--vaykae-pink)]" />;
      default:
        return null;
    }
  };

  const handleAudioCall = () => {
    alert("Audio call feature - Coming soon!");
  };

  const handleVideoCall = () => {
    alert("Video call feature - Coming soon!");
  };

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-background sticky top-0 z-10">
        <div className="flex items-center gap-3 flex-1">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <ImageWithFallback
            src={chat.image}
            alt={chat.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-medium">{chat.name}</p>
            <p className="text-xs text-muted-foreground">{chat.status}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {isAgency && (
            <>
              <button 
                onClick={handleAudioCall}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button 
                onClick={handleVideoCall}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Video className="w-5 h-5" />
              </button>
            </>
          )}
          {isGroup && (
            <button 
              onClick={() => setShowGroupOptions(!showGroupOptions)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Users className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Group Members Panel */}
      <AnimatePresence>
        {showGroupOptions && isGroup && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-border bg-muted/30 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-sm">Group Members</p>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-full bg-card hover:bg-muted transition-colors">
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {chat.members?.map((member, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 flex-shrink-0">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="text-xs">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-2 max-w-[85%] ${message.sender === "me" ? "flex-row-reverse" : ""}`}>
              {/* Avatar for group chats */}
              {isGroup && message.sender !== "me" && (
                <ImageWithFallback
                  src={message.senderImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"}
                  alt={message.senderName || "User"}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}

              <div className="flex flex-col">
                {/* Sender name for group chats */}
                {isGroup && message.sender !== "me" && (
                  <span className="text-xs text-muted-foreground mb-1 px-2">
                    {message.senderName || "Unknown User"}
                  </span>
                )}

                {/* Message bubble */}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.sender === "me"
                      ? "text-white"
                      : "bg-muted"
                  }`}
                  style={
                    message.sender === "me"
                      ? { background: "var(--vaykae-gradient)" }
                      : undefined
                  }
                >
                  {/* Text message */}
                  {message.type === "text" && message.text && (
                    <p className="text-sm">{message.text}</p>
                  )}

                  {/* Image message */}
                  {message.type === "image" && message.media && (
                    <div className="rounded-xl overflow-hidden">
                      <img 
                        src={message.media.url} 
                        alt="Shared image" 
                        className="w-48 h-48 object-cover"
                      />
                    </div>
                  )}

                  {/* Document message */}
                  {message.type === "document" && message.media && (
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        message.sender === "me" ? "bg-white/20" : "bg-muted"
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{message.media.name}</p>
                        <p className={`text-xs ${message.sender === "me" ? "text-white/70" : "text-muted-foreground"}`}>
                          {message.media.size}
                        </p>
                      </div>
                      <button className="flex-shrink-0">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Time and status */}
                  <div
                    className={`flex items-center gap-1 mt-1 text-xs ${
                      message.sender === "me"
                        ? "text-white/70 justify-end"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span>{message.time}</span>
                    {message.sender === "me" && getStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Picker */}
      <AnimatePresence>
        {showMediaPicker && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="border-t border-border bg-card p-4"
          >
            <div className="flex items-center gap-4 justify-around">
              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--vaykae-gradient)" }}>
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium">Photo</span>
              </button>

              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--vaykae-gradient)" }}>
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium">Camera</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--vaykae-gradient)" }}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium">Document</span>
              </button>

              <button
                onClick={() => setShowMediaPicker(false)}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                  <X className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">Close</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowMediaPicker(!showMediaPicker)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 h-12 rounded-full bg-muted border-none"
          />
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all"
            style={{
              background: messageText.trim()
                ? "var(--vaykae-gradient)"
                : "var(--muted)",
              opacity: messageText.trim() ? 1 : 0.5,
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}