import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/AppHeader";
import { AppSideMenu } from "../components/AppSideMenu";
import { Search, Users, Plus, Briefcase } from "lucide-react";
import { Input } from "../components/ui/input";
import { motion } from "motion/react";

const chats = [
  {
    id: 1,
    type: "friend",
    name: "Emma Watson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    lastMessage: "Thanks for the donation! 🙏",
    time: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    type: "agency",
    name: "Dream Travel Agency",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100",
    lastMessage: "Your itinerary is ready!",
    time: "1h ago",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    type: "group",
    name: "Bali Group Trip 2026",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100",
    lastMessage: "Alex: Who's booking the hotel?",
    time: "3h ago",
    unread: 5,
    members: 5,
  },
  {
    id: 4,
    type: "friend",
    name: "Alex Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    lastMessage: "Check out my new campaign!",
    time: "1d ago",
    unread: 0,
    online: false,
  },
  {
    id: 5,
    type: "agency",
    name: "Wanderlust Travel Co.",
    image: "https://images.unsplash.com/photo-1544367945-4125eb396314?w=100",
    lastMessage: "We have special offers for you",
    time: "2d ago",
    unread: 1,
    online: true,
  },
  {
    id: 6,
    type: "group",
    name: "Tokyo Adventure 2026",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100",
    lastMessage: "Maria: Flight tickets are booked! ✈️",
    time: "3d ago",
    unread: 0,
    members: 4,
  },
];

export default function ChatListScreen() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "friends" | "agencies" | "groups">("all");
  const navigate = useNavigate();

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "friends" && chat.type === "friend") ||
                      (activeTab === "agencies" && chat.type === "agency") ||
                      (activeTab === "groups" && chat.type === "group");
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <AppHeader onMenuClick={() => setSideMenuOpen(true)} />

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-full bg-muted border-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All Chats" },
            { key: "friends", label: "Friends" },
            { key: "agencies", label: "Agencies" },
            { key: "groups", label: "Groups" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "text-white"
                  : "bg-muted text-muted-foreground"
              }`}
              style={activeTab === tab.key ? { background: "var(--vaykae-gradient)" } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="divide-y divide-border">
        {filteredChats.map((chat) => (
          <motion.button
            key={chat.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/app/chat/${chat.id}`)}
            className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors"
          >
            <div className="relative flex-shrink-0">
              <ImageWithFallback
                src={chat.image}
                alt={chat.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              
              {/* Online status for friends and agencies */}
              {(chat.type === "friend" || chat.type === "agency") && chat.online && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
              )}

              {/* Group indicator */}
              {chat.type === "group" && (
                <div 
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "var(--vaykae-gradient)" }}
                >
                  <Users className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Agency indicator */}
              {chat.type === "agency" && (
                <div 
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "var(--vaykae-gradient)" }}
                >
                  <Briefcase className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Unread badge */}
              {chat.unread > 0 && (
                <div
                  className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full flex items-center justify-center text-white text-xs font-medium px-1.5"
                  style={{ background: "var(--vaykae-gradient)" }}
                >
                  {chat.unread > 99 ? "99+" : chat.unread}
                </div>
              )}
            </div>

            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <p className={`font-medium truncate ${chat.unread > 0 ? "text-foreground" : ""}`}>
                    {chat.name}
                  </p>
                  {chat.type === "group" && chat.members && (
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      ({chat.members})
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {chat.time}
                </span>
              </div>
              <p className={`text-sm line-clamp-1 ${
                chat.unread > 0 ? "font-medium text-foreground" : "text-muted-foreground"
              }`}>
                {chat.lastMessage}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Empty state */}
      {filteredChats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium mb-2">No chats found</p>
          <p className="text-sm text-muted-foreground text-center">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Floating Action Button - New Chat */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/app/friends")}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-20"
        style={{
          background: "var(--vaykae-gradient)",
          boxShadow: "0 4px 16px rgba(215, 1, 168, 0.3)",
        }}
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Side Menu */}
      <AppSideMenu isOpen={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
    </div>
  );
}
