import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MapPin, Calendar, Heart, MessageCircle, UserPlus, UserCheck, Users, TrendingUp, Image as ImageIcon } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GradientProgress } from "../components/GradientProgress";
import { GradientButton } from "../components/GradientButton";

interface Campaign {
  id: number;
  destination: string;
  image: string;
  goal: number;
  raised: number;
  donors: number;
  endDate: string;
  description: string;
}

interface TripCard {
  id: number;
  destination: string;
  image: string;
  date: string;
}

interface UserPost {
  id: string;
  text: string;
  image?: string;
  location?: string;
  tags?: string[];
  likes: number;
  comments: number;
  timestamp: Date;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  location: string;
  joinedDate: string;
  stats: {
    campaigns: number;
    trips: number;
    friends: number;
  };
  isFriend: boolean;
  mutualFriends: number;
  campaigns: Campaign[];
  previousTrips: TripCard[];
  posts: UserPost[];
}

// Mock data - in real app, fetch based on userId
const mockUsers: Record<string, UserProfile> = {
  "emma": {
    id: "emma",
    name: "Emma Watson",
    username: "@emmawatson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    bio: "Travel enthusiast ✈️ | Exploring the world one destination at a time 🌍 | Beach lover 🏖️",
    location: "London, UK",
    joinedDate: "Jan 2025",
    stats: {
      campaigns: 3,
      trips: 12,
      friends: 234,
    },
    isFriend: false,
    mutualFriends: 12,
    campaigns: [
      {
        id: 101,
        destination: "Santorini, Greece",
        image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600",
        goal: 5000,
        raised: 3500,
        donors: 42,
        endDate: "2026-08-15",
        description: "Dreaming of watching the sunset over the white cliffs of Santorini!",
      },
      {
        id: 102,
        destination: "Paris, France",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
        goal: 3000,
        raised: 1200,
        donors: 18,
        endDate: "2026-12-20",
        description: "City of lights and love! Can't wait to visit the Eiffel Tower.",
      },
    ],
    previousTrips: [
      {
        id: 1,
        destination: "Tokyo, Japan",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
        date: "March 2025",
      },
      {
        id: 2,
        destination: "Bali, Indonesia",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
        date: "December 2024",
      },
    ],
    posts: [
      {
        id: "post1",
        text: "Just landed in Tokyo! 🚀 Exploring the neon lights and ancient temples. #Tokyo #Travel",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
        location: "Tokyo, Japan",
        tags: ["Tokyo", "Travel"],
        likes: 150,
        comments: 23,
        timestamp: new Date("2025-03-01T10:00:00Z"),
      },
      {
        id: "post2",
        text: "Visited the Eiffel Tower in Paris! 🇫🇷 It was breathtaking. #Paris #EiffelTower",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
        location: "Paris, France",
        tags: ["Paris", "EiffelTower"],
        likes: 120,
        comments: 18,
        timestamp: new Date("2025-12-20T14:00:00Z"),
      },
    ],
  },
  "alex": {
    id: "alex",
    name: "Alex Chen",
    username: "@alexchen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "Adventure seeker 🏔️ | Photography lover 📸 | Making memories around the globe",
    location: "San Francisco, USA",
    joinedDate: "March 2025",
    stats: {
      campaigns: 2,
      trips: 8,
      friends: 156,
    },
    isFriend: true,
    mutualFriends: 8,
    campaigns: [
      {
        id: 201,
        destination: "Tokyo, Japan",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600",
        goal: 4000,
        raised: 2800,
        donors: 35,
        endDate: "2026-10-05",
        description: "Exploring the neon streets and ancient temples of Tokyo 🗾",
      },
    ],
    previousTrips: [
      {
        id: 3,
        destination: "New York City",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400",
        date: "February 2025",
      },
    ],
    posts: [
      {
        id: "post3",
        text: "Exploring the neon lights of Tokyo! 🚀 #Tokyo #Neon",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
        location: "Tokyo, Japan",
        tags: ["Tokyo", "Neon"],
        likes: 100,
        comments: 15,
        timestamp: new Date("2025-02-15T09:00:00Z"),
      },
    ],
  },
  "maria": {
    id: "maria",
    name: "Maria Garcia",
    username: "@mariag",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    bio: "Wanderlust soul 🌟 | Food & culture explorer 🍜 | Living my best life abroad",
    location: "Barcelona, Spain",
    joinedDate: "February 2025",
    stats: {
      campaigns: 2,
      trips: 15,
      friends: 389,
    },
    isFriend: false,
    mutualFriends: 15,
    campaigns: [
      {
        id: 301,
        destination: "Machu Picchu, Peru",
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600",
        goal: 6000,
        raised: 4200,
        donors: 58,
        endDate: "2026-09-10",
        description: "A lifelong dream to visit the ancient Incan citadel!",
      },
    ],
    previousTrips: [
      {
        id: 4,
        destination: "Rome, Italy",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400",
        date: "January 2025",
      },
    ],
    posts: [
      {
        id: "post4",
        text: "Visited Machu Picchu! 🇵🇪 It was an incredible experience. #MachuPicchu #Travel",
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400",
        location: "Machu Picchu, Peru",
        tags: ["MachuPicchu", "Travel"],
        likes: 200,
        comments: 30,
        timestamp: new Date("2025-01-10T12:00:00Z"),
      },
    ],
  },
  "john": {
    id: "john",
    name: "John Traveler",
    username: "@johntrav",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    bio: "Digital nomad 💻 | Beach enthusiast 🌊 | Always planning the next adventure",
    location: "Miami, USA",
    joinedDate: "April 2025",
    stats: {
      campaigns: 1,
      trips: 6,
      friends: 98,
    },
    isFriend: false,
    mutualFriends: 5,
    campaigns: [],
    previousTrips: [
      {
        id: 5,
        destination: "Cancun, Mexico",
        image: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=400",
        date: "November 2024",
      },
    ],
    posts: [
      {
        id: "post5",
        text: "Relaxing on the beach in Cancun! 🌞 #Cancun #BeachLife",
        image: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=400",
        location: "Cancun, Mexico",
        tags: ["Cancun", "BeachLife"],
        likes: 80,
        comments: 10,
        timestamp: new Date("2024-11-25T16:00:00Z"),
      },
    ],
  },
};

export default function UserProfileViewScreen() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState<"campaigns" | "trips" | "posts">("campaigns");
  
  // Get user profile
  const userProfile = userId ? mockUsers[userId] : null;
  const [isFriend, setIsFriend] = useState(userProfile?.isFriend || false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">User not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 rounded-xl bg-muted"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleAddFriend = () => {
    setFriendRequestSent(true);
    // In real app: send friend request API call
  };

  const handleMessage = () => {
    navigate(`/app/chat/${userId}`);
  };

  const handleContribute = (campaignId: number) => {
    navigate(`/app/campaign/${campaignId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-6" style={{ maxWidth: "430px", margin: "0 auto" }}>
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">{userProfile.username}</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-start gap-4 mb-4">
          <ImageWithFallback
            src={userProfile.image}
            alt={userProfile.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">{userProfile.name}</h2>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span>{userProfile.location}</span>
            </div>
            {userProfile.mutualFriends > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{userProfile.mutualFriends} mutual friends</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm mb-4">{userProfile.bio}</p>

        {/* Stats */}
        <div className="flex items-center justify-around p-4 rounded-2xl bg-muted/50 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{userProfile.stats.campaigns}</p>
            <p className="text-xs text-muted-foreground">Campaigns</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold">{userProfile.stats.trips}</p>
            <p className="text-xs text-muted-foreground">Trips</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold">{userProfile.stats.friends}</p>
            <p className="text-xs text-muted-foreground">Friends</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isFriend ? (
            <>
              <GradientButton
                onClick={handleMessage}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Message
              </GradientButton>
              <button
                className="px-6 py-3 rounded-xl bg-muted font-medium hover:bg-muted/70 transition-colors"
              >
                <UserCheck className="w-5 h-5" />
              </button>
            </>
          ) : friendRequestSent ? (
            <button
              disabled
              className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-medium"
            >
              Friend Request Sent
            </button>
          ) : (
            <GradientButton
              onClick={handleAddFriend}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Friend
            </GradientButton>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-4 border-b border-border">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`flex-1 py-3 font-medium transition-all relative ${
            activeTab === "campaigns"
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Campaigns ({userProfile.campaigns.length})
          {activeTab === "campaigns" && (
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
              style={{ background: "var(--vaykae-gradient)" }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("trips")}
          className={`flex-1 py-3 font-medium transition-all relative ${
            activeTab === "trips"
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Trips ({userProfile.previousTrips.length})
          {activeTab === "trips" && (
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
              style={{ background: "var(--vaykae-gradient)" }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-3 font-medium transition-all relative ${
            activeTab === "posts"
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
        >
          <ImageIcon className="w-4 h-4 inline mr-2" />
          Posts ({userProfile.posts.length})
          {activeTab === "posts" && (
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
              style={{ background: "var(--vaykae-gradient)" }}
            />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === "campaigns" ? (
          <div className="space-y-4">
            {userProfile.campaigns.length > 0 ? (
              userProfile.campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="rounded-2xl overflow-hidden bg-card border border-border"
                >
                  {/* Campaign Image */}
                  <div className="relative h-48 cursor-pointer" onClick={() => handleContribute(campaign.id)}>
                    <ImageWithFallback
                      src={campaign.image}
                      alt={campaign.destination}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Campaign Info */}
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{campaign.destination}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {campaign.description}
                    </p>

                    {/* End Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>Ends {new Date(campaign.endDate).toLocaleDateString()}</span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
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
                      <p className="text-xs text-muted-foreground">
                        {campaign.donors} donors
                      </p>
                    </div>

                    {/* Contribute Button */}
                    <GradientButton
                      onClick={() => handleContribute(campaign.id)}
                      className="w-full"
                    >
                      Contribute Now
                    </GradientButton>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No active campaigns yet</p>
              </div>
            )}
          </div>
        ) : activeTab === "trips" ? (
          <div className="grid grid-cols-2 gap-3">
            {userProfile.previousTrips.map((trip) => (
              <div
                key={trip.id}
                className="rounded-2xl overflow-hidden bg-card border border-border"
              >
                <div className="relative h-32">
                  <ImageWithFallback
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm mb-1">{trip.destination}</p>
                  <p className="text-xs text-muted-foreground">{trip.date}</p>
                </div>
              </div>
            ))}
            {userProfile.previousTrips.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No trips yet</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {userProfile.posts.length > 0 ? (
              userProfile.posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl overflow-hidden bg-card border border-border"
                >
                  {/* Post Image */}
                  {post.image && (
                    <div className="relative h-48 cursor-pointer">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.text}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Post Info */}
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(post.timestamp).toLocaleDateString()} - {new Date(post.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="text-sm mb-3">{post.text}</p>

                    {/* Location */}
                    {post.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{post.location}</span>
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="bg-muted/50 px-2 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Likes and Comments */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes} likes</span>
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments} comments</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No posts yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}