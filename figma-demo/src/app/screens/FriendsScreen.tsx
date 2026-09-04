import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Search, Users, Heart, DollarSign, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GradientProgress } from "../components/GradientProgress";
import { GradientButton } from "../components/GradientButton";

interface Friend {
  id: number;
  name: string;
  image: string;
  username: string;
  mutualFriends: number;
  campaigns: {
    id: number;
    destination: string;
    goal: number;
    raised: number;
    endDate: string;
  }[];
}

interface GroupTrip {
  id: number;
  name: string;
  members: number;
  goal: number;
  raised: number;
  image: string;
  type: string;
}

const friends: Friend[] = [
  {
    id: 1,
    name: "Emma Watson",
    username: "@emmawatson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    mutualFriends: 12,
    campaigns: [
      {
        id: 101,
        destination: "Santorini, Greece",
        goal: 5000,
        raised: 3500,
        endDate: "2026-08-15",
      },
      {
        id: 102,
        destination: "Paris, France",
        goal: 3000,
        raised: 1200,
        endDate: "2026-12-20",
      },
    ],
  },
  {
    id: 2,
    name: "Alex Chen",
    username: "@alexchen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    mutualFriends: 8,
    campaigns: [
      {
        id: 201,
        destination: "Tokyo, Japan",
        goal: 4000,
        raised: 2800,
        endDate: "2026-10-05",
      },
    ],
  },
  {
    id: 3,
    name: "Sarah Johnson",
    username: "@sarahj",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    mutualFriends: 15,
    campaigns: [
      {
        id: 301,
        destination: "Bali, Indonesia",
        goal: 3500,
        raised: 2100,
        endDate: "2026-09-10",
      },
    ],
  },
];

const groupTrips: GroupTrip[] = [
  {
    id: 1,
    name: "Bali Bachelor Trip 2026",
    members: 6,
    goal: 12000,
    raised: 8500,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
    type: "Bachelor Trip",
  },
  {
    id: 2,
    name: "Family Reunion - Hawaii",
    members: 10,
    goal: 25000,
    raised: 15000,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
    type: "Family Reunion",
  },
];

export default function FriendsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"friends" | "groups">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContribute = (campaignId: number, friendName: string) => {
    navigate(`/app/campaign/${campaignId}`);
  };

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
            <h1 className="text-lg font-bold">Friends & Group Trips</h1>
          </div>
          <button
            onClick={() => navigate("/app/add-friend")}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{
              background: "var(--vaykae-gradient)",
            }}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-2 pb-3">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === "friends"
                ? "text-white"
                : "text-muted-foreground bg-muted"
            }`}
            style={
              activeTab === "friends"
                ? { background: "var(--vaykae-gradient)" }
                : {}
            }
          >
            <Users className="w-4 h-4 inline mr-2" />
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === "groups"
                ? "text-white"
                : "text-muted-foreground bg-muted"
            }`}
            style={
              activeTab === "groups"
                ? { background: "var(--vaykae-gradient)" }
                : {}
            }
          >
            <Heart className="w-4 h-4 inline mr-2" />
            Group Trips ({groupTrips.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {activeTab === "friends" && (
        <div className="px-4 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-6">
        {activeTab === "friends" ? (
          <div className="space-y-4 pt-2">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="p-4 rounded-2xl bg-card border border-border"
              >
                {/* Friend Header */}
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => navigate(`/app/user/${friend.username.substring(1)}`)}>
                    <ImageWithFallback
                      src={friend.image}
                      alt={friend.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </button>
                  <div className="flex-1" onClick={() => navigate(`/app/user/${friend.username.substring(1)}`)}>
                    <p className="font-bold">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {friend.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {friend.mutualFriends} mutual friends
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/app/chat/${friend.id}`)}
                    className="px-4 py-2 rounded-xl bg-muted text-sm font-medium hover:bg-muted/70 transition-colors"
                  >
                    Message
                  </button>
                </div>

                {/* Campaigns */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 text-[var(--vaykae-pink)]" />
                    <span>Active Campaigns ({friend.campaigns.length})</span>
                  </div>

                  {friend.campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="p-3 rounded-xl bg-muted/50 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {campaign.destination}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ends {new Date(campaign.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleContribute(campaign.id, friend.name)
                          }
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                          style={{
                            background: "var(--vaykae-gradient)",
                          }}
                        >
                          <DollarSign className="w-3 h-3 inline mr-1" />
                          Contribute
                        </button>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold">
                            ${campaign.raised.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">
                            of ${campaign.goal.toLocaleString()}
                          </span>
                        </div>
                        <GradientProgress
                          value={campaign.raised}
                          max={campaign.goal}
                          showPercentage={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredFriends.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No friends found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            {/* Create Group Trip Button */}
            <button
              onClick={() => navigate("/app/group-campaign")}
              className="w-full p-6 rounded-2xl border-2 border-dashed border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{
                    background: "var(--vaykae-gradient)",
                  }}
                >
                  <Plus className="w-6 h-6" />
                </div>
                <p className="font-bold">Create Group Trip</p>
                <p className="text-sm text-muted-foreground">
                  Plan and fund trips with friends & family
                </p>
              </div>
            </button>

            {/* Group Trips List */}
            {groupTrips.map((trip) => (
              <div
                key={trip.id}
                className="rounded-2xl overflow-hidden bg-card border border-border cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/app/group-campaign?id=${trip.id}`)}
              >
                {/* Trip Image */}
                <div className="relative h-40">
                  <ImageWithFallback
                    src={trip.image}
                    alt={trip.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold">
                      {trip.type}
                    </span>
                  </div>
                </div>

                {/* Trip Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold mb-1">{trip.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        <Users className="w-3.5 h-3.5 inline mr-1" />
                        {trip.members} members
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">
                        ${trip.raised.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        of ${trip.goal.toLocaleString()}
                      </span>
                    </div>
                    <GradientProgress
                      value={trip.raised}
                      max={trip.goal}
                      showPercentage={true}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-card rounded-t-3xl w-full max-w-[430px] p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add Friend</h2>
              <button
                onClick={() => setShowAddFriendModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or username..."
                  className="w-full h-12 pl-12 pr-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)]"
                />
              </div>

              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Search for friends to connect with
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}