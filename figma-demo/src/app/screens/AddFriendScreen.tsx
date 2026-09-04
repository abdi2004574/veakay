import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, UserPlus, UserCheck, Users, X } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GradientButton } from "../components/GradientButton";

interface User {
  id: string;
  name: string;
  username: string;
  image: string;
  location: string;
  mutualFriends: number;
  isFriend: boolean;
  requestSent: boolean;
  requestReceived: boolean;
}

interface FriendRequest {
  id: string;
  user: User;
  timestamp: Date;
}

const suggestedUsers: User[] = [
  {
    id: "sarah",
    name: "Sarah Johnson",
    username: "@sarahj",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    location: "New York, USA",
    mutualFriends: 15,
    isFriend: false,
    requestSent: false,
    requestReceived: false,
  },
  {
    id: "mike",
    name: "Mike Rodriguez",
    username: "@miker",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    location: "Miami, USA",
    mutualFriends: 8,
    isFriend: false,
    requestSent: false,
    requestReceived: false,
  },
  {
    id: "lisa",
    name: "Lisa Chen",
    username: "@lisac",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    location: "Los Angeles, USA",
    mutualFriends: 12,
    isFriend: false,
    requestSent: false,
    requestReceived: false,
  },
  {
    id: "david",
    name: "David Kim",
    username: "@davidk",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    location: "San Francisco, USA",
    mutualFriends: 6,
    isFriend: false,
    requestSent: false,
    requestReceived: false,
  },
];

const mockFriendRequests: FriendRequest[] = [
  {
    id: "req-1",
    user: {
      id: "anna",
      name: "Anna Martinez",
      username: "@annam",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
      location: "Barcelona, Spain",
      mutualFriends: 23,
      isFriend: false,
      requestSent: false,
      requestReceived: true,
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "req-2",
    user: {
      id: "james",
      name: "James Wilson",
      username: "@jamesw",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
      location: "London, UK",
      mutualFriends: 18,
      isFriend: false,
      requestSent: false,
      requestReceived: true,
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
];

export default function AddFriendScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"search" | "requests">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>(suggestedUsers);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(mockFriendRequests);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // In real app: API call to search users
      const results = suggestedUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFriend = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, requestSent: true } : user
      )
    );
    setSearchResults(
      searchResults.map((user) =>
        user.id === userId ? { ...user, requestSent: true } : user
      )
    );
    // In real app: API call to send friend request
  };

  const handleAcceptRequest = (requestId: string) => {
    setFriendRequests(friendRequests.filter((req) => req.id !== requestId));
    // In real app: API call to accept friend request
  };

  const handleDeclineRequest = (requestId: string) => {
    setFriendRequests(friendRequests.filter((req) => req.id !== requestId));
    // In real app: API call to decline friend request
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/app/user/${userId}`);
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const displayUsers = searchQuery ? searchResults : users;
  const pendingRequestsCount = friendRequests.length;

  return (
    <div className="min-h-screen bg-background" style={{ maxWidth: "430px", margin: "0 auto" }}>
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Add Friends</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-2 pb-3">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === "search"
                ? "text-white"
                : "text-muted-foreground bg-muted"
            }`}
            style={
              activeTab === "search"
                ? { background: "var(--vaykae-gradient)" }
                : {}
            }
          >
            <Search className="w-4 h-4 inline mr-2" />
            Find Friends
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-all relative ${
              activeTab === "requests"
                ? "text-white"
                : "text-muted-foreground bg-muted"
            }`}
            style={
              activeTab === "requests"
                ? { background: "var(--vaykae-gradient)" }
                : {}
            }
          >
            <Users className="w-4 h-4 inline mr-2" />
            Requests
            {pendingRequestsCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold"
                style={{ background: "var(--vaykae-gradient)" }}
              >
                {pendingRequestsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {activeTab === "search" && (
        <div className="px-4 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-6">
        {activeTab === "search" ? (
          <div className="space-y-4 pt-2">
            {!searchQuery && (
              <div className="mb-4">
                <h2 className="text-sm font-bold text-muted-foreground mb-3">
                  SUGGESTED FOR YOU
                </h2>
              </div>
            )}

            {displayUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-2xl bg-card border border-border flex items-center gap-3"
              >
                <button onClick={() => handleViewProfile(user.id)}>
                  <ImageWithFallback
                    src={user.image}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </button>
                <div className="flex-1 min-w-0" onClick={() => handleViewProfile(user.id)}>
                  <p className="font-bold truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.username}
                  </p>
                  {user.mutualFriends > 0 && (
                    <p className="text-xs text-muted-foreground">
                      <Users className="w-3 h-3 inline mr-1" />
                      {user.mutualFriends} mutual friends
                    </p>
                  )}
                </div>
                {user.isFriend ? (
                  <button
                    className="px-4 py-2 rounded-xl bg-muted text-sm font-medium flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    Friends
                  </button>
                ) : user.requestSent ? (
                  <button
                    disabled
                    className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium"
                  >
                    Sent
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddFriend(user.id)}
                    className="px-4 py-2 rounded-xl text-white text-sm font-bold flex items-center gap-2"
                    style={{ background: "var(--vaykae-gradient)" }}
                  >
                    <UserPlus className="w-4 h-4" />
                    Add
                  </button>
                )}
              </div>
            ))}

            {displayUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No users found" : "No suggestions available"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            {friendRequests.length > 0 ? (
              friendRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <button onClick={() => handleViewProfile(request.user.id)}>
                      <ImageWithFallback
                        src={request.user.image}
                        alt={request.user.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold">{request.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.user.username}
                      </p>
                      {request.user.mutualFriends > 0 && (
                        <p className="text-xs text-muted-foreground">
                          <Users className="w-3 h-3 inline mr-1" />
                          {request.user.mutualFriends} mutual friends
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(request.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <GradientButton
                      onClick={() => handleAcceptRequest(request.id)}
                      className="flex-1"
                    >
                      <UserCheck className="w-4 h-4 inline mr-2" />
                      Accept
                    </GradientButton>
                    <button
                      onClick={() => handleDeclineRequest(request.id)}
                      className="flex-1 py-3 rounded-xl bg-muted font-medium hover:bg-muted/70 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No pending requests</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Friend requests will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
