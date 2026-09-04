import { useNavigate } from "react-router";
import { ArrowLeft, Heart, DollarSign, MessageCircle, Award } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "donation",
    icon: DollarSign,
    title: "New Donation!",
    message: "Sarah Johnson donated $50 to your Paris campaign",
    time: "5m ago",
    unread: true,
  },
  {
    id: 2,
    type: "milestone",
    icon: Award,
    title: "Milestone Reached!",
    message: "Your campaign reached 50% of its goal! 🎉",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    type: "message",
    icon: MessageCircle,
    title: "New Message",
    message: "Emma Watson sent you a message",
    time: "2h ago",
    unread: false,
  },
  {
    id: 4,
    type: "like",
    icon: Heart,
    title: "New Like",
    message: "Alex Chen liked your campaign",
    time: "1d ago",
    unread: false,
  },
];

export default function NotificationsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl">Notifications</h1>
        </div>
      </div>

      <div className="divide-y divide-border">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          return (
            <button
              key={notif.id}
              className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors ${
                notif.unread ? "bg-muted/30" : ""
              }`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{
                  background: "var(--veakey-gradient)",
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium mb-1">{notif.title}</p>
                <p className="text-sm text-muted-foreground mb-1">{notif.message}</p>
                <span className="text-xs text-muted-foreground">{notif.time}</span>
              </div>
              {notif.unread && (
                <div className="w-2 h-2 rounded-full bg-[var(--veakey-pink)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
