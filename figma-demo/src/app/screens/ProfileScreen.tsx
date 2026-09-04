import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Settings, MapPin, Award, Heart, Star, ChevronRight, Plane, Wallet, Mail, Phone, Calendar, User as UserIcon, MessageCircle, Users, Share2, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GradientButton } from "../components/GradientButton";
import { AppHeader } from "../components/AppHeader";
import { AppSideMenu } from "../components/AppSideMenu";
import { ShareBottomSheet } from "../components/ShareBottomSheet";
import { CommentsModal } from "../components/CommentsModal";
import { AnimatePresence, motion } from "motion/react";
import { useScrollContext } from "../Root";

const tripPhotos = [
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300",
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300",
];

const preferences = ["Adventure", "Beach", "Cultural", "Solo", "Luxury", "Mountains"];

const initialUserPosts = [
  {
    id: "post-1",
    user: "John Traveler",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
    text: "Dreaming of tropical paradises 🌴🌊 Who else wants to escape to the Maldives?",
    location: "Maldives",
    tags: ["TravelGoals", "Paradise", "Maldives"],
    likes: 234,
    comments: [],
    shares: 5,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "post-2",
    user: "John Traveler",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    text: "Mountain therapy 🏔️ The best views come after the hardest climbs!",
    location: "Swiss Alps, Switzerland",
    tags: ["Mountains", "Adventure", "Nature"],
    likes: 189,
    comments: [],
    shares: 3,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "post-3",
    user: "John Traveler",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400",
    text: "Exploring hidden gems in Paris 🇫🇷✨ Best croissants ever!",
    location: "Paris, France",
    tags: ["Paris", "Foodie", "Europe"],
    likes: 312,
    comments: [],
    shares: 8,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "post-4",
    user: "John Traveler",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400",
    text: "Sunset chasing in Santorini 🌅 This is what dreams are made of!",
    location: "Santorini, Greece",
    tags: ["Sunset", "Greece", "Santorini"],
    likes: 445,
    comments: [],
    shares: 12,
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
];

const previousTrips = [
  {
    id: 1,
    destination: "Santorini Dreams",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400",
    startDate: "2024-06-15",
    endDate: "2024-06-25",
    travelers: 2,
    description: "Amazing honeymoon trip with breathtaking sunsets"
  },
  {
    id: 2,
    destination: "Alpine Adventure",
    location: "Swiss Alps, Switzerland",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    startDate: "2024-03-10",
    endDate: "2024-03-20",
    travelers: 1,
    description: "Solo hiking trip through the mountains"
  },
  {
    id: 3,
    destination: "Tokyo Explorer",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
    startDate: "2023-11-05",
    endDate: "2023-11-15",
    travelers: 3,
    description: "Cultural immersion with friends in the land of the rising sun"
  },
  {
    id: 4,
    destination: "Bali Bliss",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
    startDate: "2023-08-20",
    endDate: "2023-09-05",
    travelers: 4,
    description: "Family vacation filled with beaches, temples, and relaxation"
  },
];

export default function ProfileScreen() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "posts" | "trips">("about");
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [userPosts, setUserPosts] = useState(initialUserPosts);
  const [postOptionsOpen, setPostOptionsOpen] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharePostId, setSharePostId] = useState("");
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [activePostId, setActivePostId] = useState("");
  
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const { setHideNav } = useScrollContext();

  // Auto-hide navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const currentScrollY = scrollContainerRef.current.scrollTop;
      
      if (currentScrollY > prevScrollY && currentScrollY > 50) {
        // Scrolling down
        setHideNav(true);
      } else if (currentScrollY < prevScrollY) {
        // Scrolling up
        setHideNav(false);
      }
      
      setPrevScrollY(currentScrollY);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [prevScrollY, setHideNav]);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleDeletePost = (postId: string) => {
    setUserPosts(userPosts.filter(post => post.id !== postId));
    setPostOptionsOpen(null);
  };

  const handleEditPost = (postId: string) => {
    const post = userPosts.find(p => p.id === postId);
    if (post) {
      navigate("/app/create-post", {
        state: {
          editPost: {
            id: post.id,
            text: post.text,
            image: post.image,
            location: post.location,
            tags: post.tags,
          },
        },
      });
    }
    setPostOptionsOpen(null);
  };

  const handleShare = (postId: string) => {
    setSharePostId(postId);
    setShareModalOpen(true);
  };

  const handleOpenComments = (postId: string) => {
    setActivePostId(postId);
    setCommentsModalOpen(true);
  };

  const handleAddComment = (postId: string, commentText: string) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      user: "John Traveler",
      userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
      text: commentText,
      likes: 0,
      timestamp: new Date(),
    };

    setUserPosts(userPosts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
  };

  const getActiveComments = () => {
    const post = userPosts.find(p => p.id === activePostId);
    return post?.comments || [];
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-background flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0">
        <AppHeader onMenuClick={() => setSideMenuOpen(true)} />
      </div>

      {/* Scrollable Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="relative">
          <div
            className="h-32"
            style={{
              background: "var(--vaykae-gradient)",
            }}
          />

          <button
            onClick={() => navigate("/app/settings")}
            className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white hover:bg-black/30 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div className="px-4 -mt-16 pb-4">
            <div className="relative w-32 h-32 mb-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-background"
              />
              <div
                className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--vaykae-gradient)",
                  boxShadow: "0 4px 16px rgba(215, 1, 168, 0.3)",
                }}
              >
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-1">John Traveler</h1>
            <p className="text-muted-foreground mb-4">@johntraveler</p>

            <div className="flex items-center gap-2 mb-6">
              <div
                className="px-4 py-2 rounded-full text-white text-sm font-medium"
                style={{
                  background: "var(--vaykae-gradient)",
                }}
              >
                🏅 Dreamer Badge
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-card border border-border">
              <div className="text-center">
                <p className="text-2xl font-bold mb-1">5</p>
                <p className="text-sm text-muted-foreground">Campaigns</p>
              </div>
              <div className="text-center border-l border-r border-border">
                <p className="text-2xl font-bold mb-1">{previousTrips.length}</p>
                <p className="text-sm text-muted-foreground">Trips</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold mb-1">{userPosts.length}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <GradientButton
              fullWidth
              onClick={() => navigate("/app/edit-profile")}
              className="mb-6"
            >
              Edit Profile
            </GradientButton>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border z-10">
          <div className="flex px-4">
            <button
              onClick={() => setActiveTab("about")}
              className="flex-1 py-4 text-sm font-bold relative transition-colors"
              style={
                activeTab === "about"
                  ? { color: "var(--vaykae-pink)" }
                  : { color: "var(--muted-foreground)" }
              }
            >
              About
              {activeTab === "about" && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "var(--vaykae-gradient)" }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className="flex-1 py-4 text-sm font-bold relative transition-colors"
              style={
                activeTab === "posts"
                  ? { color: "var(--vaykae-pink)" }
                  : { color: "var(--muted-foreground)" }
              }
            >
              Posts
              {activeTab === "posts" && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "var(--vaykae-gradient)" }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("trips")}
              className="flex-1 py-4 text-sm font-bold relative transition-colors"
              style={
                activeTab === "trips"
                  ? { color: "var(--vaykae-pink)" }
                  : { color: "var(--muted-foreground)" }
              }
            >
              Trips
              {activeTab === "trips" && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "var(--vaykae-gradient)" }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-6">
          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-6">
              {/* Profile Information */}
              <div className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="font-bold mb-4">Profile Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium truncate">john@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">+1 234 567 8900</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium">New York, USA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">June 15, 1995</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="font-medium">Male</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="font-bold mb-3">About</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Travel enthusiast | Dream chaser | Adventure seeker 🌍✈️
                </p>
              </div>

              {/* Travel Preferences */}
              <div className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="font-bold mb-3">Travel Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.map((pref) => (
                    <div
                      key={pref}
                      className="px-4 py-2 rounded-full bg-gradient-to-br from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20 text-sm font-medium"
                    >
                      {pref}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <button
                onClick={() => navigate("/app/my-reviews")}
                className="w-full p-4 rounded-2xl bg-card border border-border hover:border-[var(--vaykae-pink)]/30 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--vaykae-gradient)" }}
                  >
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-bold">My Reviews</p>
                    <p className="text-xs text-muted-foreground">View and manage agency reviews</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-[var(--vaykae-pink)] flex-shrink-0">3 Reviews</div>
              </button>

              <button
                onClick={() => navigate("/app/wallet")}
                className="w-full p-4 rounded-2xl bg-card border border-border hover:border-[var(--vaykae-pink)]/30 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--vaykae-gradient)" }}
                  >
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-bold">Wallet & Payments</p>
                    <p className="text-xs text-muted-foreground">Manage funds and withdrawals</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-[var(--vaykae-pink)] flex-shrink-0">$2,450</div>
              </button>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div className="-mx-4">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="mb-4 bg-card"
                  >
                    {/* Post Header */}
                    <div className="flex items-center gap-3 px-4 py-3">
                      <ImageWithFallback
                        src={post.userImage}
                        alt={post.user}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{post.user}</p>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(post.timestamp)}</p>
                      </div>
                      
                      {/* Three Dots Menu */}
                      <div className="relative">
                        <button 
                          onClick={() => setPostOptionsOpen(postOptionsOpen === post.id ? null : post.id)}
                          className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        <AnimatePresence>
                          {postOptionsOpen === post.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-full mt-1 bg-card border border-border rounded-2xl shadow-lg overflow-hidden z-20 min-w-[160px]"
                            >
                              <button
                                onClick={() => handleEditPost(post.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                              >
                                <Edit2 className="w-4 h-4" />
                                <span className="font-medium">Edit Post</span>
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-500 transition-colors text-left"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="font-medium">Delete Post</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Post Text Content */}
                    <div className="px-4 pb-3">
                      <p className="mb-3 whitespace-pre-wrap">{post.text}</p>
                      
                      {/* Location */}
                      {post.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{post.location}</span>
                        </div>
                      )}
                      
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2.5 py-1 rounded-full bg-muted text-[var(--vaykae-pink)] font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Image */}
                    <div className="relative">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.text}
                        className="w-full aspect-[4/3] object-cover"
                      />
                    </div>

                    {/* Post Actions */}
                    <div className="px-4 pb-4">
                      <div className="flex items-center gap-4 pt-3 border-t border-border">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center gap-2 transition-colors"
                        >
                          <Heart
                            className={`w-6 h-6 ${
                              likedPosts.includes(post.id)
                                ? "fill-[var(--vaykae-pink)] text-[var(--vaykae-pink)]"
                                : "text-foreground"
                            }`}
                          />
                          <span className="text-sm">
                            {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                          </span>
                        </button>
                        
                        <button 
                          onClick={() => handleOpenComments(post.id)}
                          className="flex items-center gap-2"
                        >
                          <MessageCircle className="w-6 h-6" />
                          <span className="text-sm">{post.comments.length}</span>
                        </button>
                        
                        <button 
                          onClick={() => handleShare(post.id)}
                          className="flex items-center gap-2 ml-auto"
                        >
                          <Share2 className="w-6 h-6" />
                          {post.shares > 0 && (
                            <span className="text-sm">{post.shares}</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold mb-2">No Posts Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your travel stories and inspire others!
                  </p>
                  <GradientButton onClick={() => navigate("/app/create-post")}>
                    Create Your First Post
                  </GradientButton>
                </div>
              )}
            </div>
          )}

          {/* Trips Tab */}
          {activeTab === "trips" && (
            <div className="space-y-4">
              {previousTrips.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">
                      {previousTrips.length} {previousTrips.length === 1 ? "Trip" : "Trips"} Completed
                    </h3>
                    <button
                      onClick={() => navigate("/app/trips")}
                      className="text-sm font-bold text-[var(--vaykae-pink)] flex items-center gap-1"
                    >
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {previousTrips.map((trip) => (
                    <div
                      key={trip.id}
                      onClick={() => navigate(`/app/trip/${trip.id}`)}
                      className="rounded-2xl overflow-hidden bg-card border border-border cursor-pointer hover:border-[var(--vaykae-pink)]/30 transition-all"
                    >
                      {/* Trip Image */}
                      <div className="relative h-48">
                        <ImageWithFallback
                          src={trip.image}
                          alt={trip.destination}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        {/* Trip Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-bold text-lg mb-1">{trip.destination}</h3>
                          <p className="text-sm opacity-90 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {trip.location}
                          </p>
                        </div>
                      </div>
                      
                      {/* Trip Details */}
                      <div className="p-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{trip.travelers} {trip.travelers === 1 ? "person" : "people"}</span>
                          </div>
                        </div>
                        {trip.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {trip.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Plane className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold mb-2">No Trips Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start adding your travel memories!
                  </p>
                  <GradientButton onClick={() => navigate("/app/edit-profile")}>
                    Add Your First Trip
                  </GradientButton>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Side Menu */}
      <AppSideMenu
        isOpen={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
      />

      {/* Share Bottom Sheet */}
      <ShareBottomSheet
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        postId={sharePostId}
      />

      {/* Comments Modal */}
      <CommentsModal
        isOpen={commentsModalOpen}
        onClose={() => setCommentsModalOpen(false)}
        postId={activePostId}
        comments={getActiveComments()}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
