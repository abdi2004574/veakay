import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Bell,
  MessageCircle,
  Package,
  DollarSign,
  UserPlus,
  Star,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface Notification {
  id: number;
  type: "message" | "request" | "payment" | "review" | "booking" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: any;
  color: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: "message",
    title: "New Message from Sarah Johnson",
    description: "Hi! I'm interested in the Bali package...",
    time: "5 min ago",
    read: false,
    icon: MessageCircle,
    color: "#D701A8",
  },
  {
    id: 2,
    type: "request",
    title: "New Trip Request",
    description: "Michael Chen requested a quote for Paris tour",
    time: "15 min ago",
    read: false,
    icon: Package,
    color: "#7700C6",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Received",
    description: "$2,500 received for Tokyo Adventure package",
    time: "1 hour ago",
    read: false,
    icon: DollarSign,
    color: "#10B981",
  },
  {
    id: 4,
    type: "review",
    title: "New Review Received",
    description: "Jessica Lee gave you 5 stars for the Dubai trip",
    time: "2 hours ago",
    read: true,
    icon: Star,
    color: "#F59E0B",
  },
  {
    id: 5,
    type: "booking",
    title: "New Booking Confirmed",
    description: "Tom Wilson booked the Maldives Luxury package",
    time: "3 hours ago",
    read: true,
    icon: CheckCircle2,
    color: "#10B981",
  },
  {
    id: 6,
    type: "system",
    title: "Profile Verification Complete",
    description: "Your agency has been verified successfully",
    time: "1 day ago",
    read: true,
    icon: TrendingUp,
    color: "#6366F1",
  },
  {
    id: 7,
    type: "message",
    title: "New Message from David Park",
    description: "Can you provide more details about...",
    time: "2 days ago",
    read: true,
    icon: MessageCircle,
    color: "#D701A8",
  },
  {
    id: 8,
    type: "request",
    title: "New Trip Request",
    description: "Emma Davis requested customization for Greece tour",
    time: "3 days ago",
    read: true,
    icon: Package,
    color: "#7700C6",
  },
];

export default function AgencyNotificationsScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notificationsList, setNotificationsList] = useState(notifications);

  const filteredNotifications =
    filter === "unread"
      ? notificationsList.filter((n) => !n.read)
      : notificationsList;

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotificationsList(
      notificationsList.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotificationsList(notificationsList.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    // Navigate based on notification type
    switch (notification.type) {
      case "message":
        navigate("/agency/app/chat");
        break;
      case "request":
        navigate("/agency/app/requests");
        break;
      case "payment":
        navigate("/agency/app/revenue");
        break;
      case "review":
        navigate("/agency/app/reviews");
        break;
      case "booking":
        navigate("/agency/app/requests");
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/agency/app")} className="p-2 -ml-2">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-semibold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium"
              style={{ color: "var(--vaykae-pink)" }}
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 pb-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === "all"
                ? "text-white"
                : "text-muted-foreground bg-muted/50"
            }`}
            style={
              filter === "all"
                ? { background: "var(--vaykae-gradient)" }
                : {}
            }
          >
            All ({notificationsList.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === "unread"
                ? "text-white"
                : "text-muted-foreground bg-muted/50"
            }`}
            style={
              filter === "unread"
                ? { background: "var(--vaykae-gradient)" }
                : {}
            }
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <Bell className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "unread"
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full p-4 flex gap-3 text-left transition-colors hover:bg-muted/30 ${
                    !notification.read ? "bg-muted/20" : ""
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${notification.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: notification.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold ${!notification.read ? "" : "font-normal"}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background: "var(--vaykae-pink)" }}
                        />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
