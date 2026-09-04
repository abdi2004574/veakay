import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { AgencyHeader } from "../../components/AgencyHeader";
import { AgencySideMenu } from "../../components/AgencySideMenu";
import { useAgencyScrollContext } from "../../AgencyRoot";
import { useState } from "react";

const chats = [
  {
    id: 1,
    travelerName: "Sarah Johnson",
    travelerImage: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    lastMessage: "Thanks! Looking forward to the trip",
    time: "2:30 PM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    travelerName: "Mike Chen",
    travelerImage: "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    lastMessage: "Can we adjust the itinerary?",
    time: "1:15 PM",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    travelerName: "Emily Davis",
    travelerImage: "https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    lastMessage: "Perfect! We'll take this package",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    travelerName: "James Wilson",
    travelerImage: "https://images.unsplash.com/photo-1543132220-7bc04a0e790a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    lastMessage: "What's included in the premium tier?",
    time: "Yesterday",
    unread: 1,
    online: false,
  },
];

export default function AgencyChatListScreen() {
  const navigate = useNavigate();
  const { hideNav, setHideNav } = useAgencyScrollContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.travelerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <AgencyHeader onMenuClick={() => setMenuOpen(true)} hidden={hideNav} />

      {/* Side Menu */}
      <AgencySideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Page Title & Search */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl mb-4">Messages</h1>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search conversations..."
              className="pl-12 h-12 rounded-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Chat List */}
        <div>
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => navigate(`/agency/app/chat/${chat.id}`)}
              className="w-full p-4 border-b border-border hover:bg-muted/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={chat.travelerImage}
                      alt={chat.travelerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="truncate">{chat.travelerName}</h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate flex-1">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 ml-2"
                        style={{ background: "var(--veakey-gradient)" }}
                      >
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}