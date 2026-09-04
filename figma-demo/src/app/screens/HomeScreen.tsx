import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Heart, MessageCircle, Plus, Share2, Sparkles, MapPin, Calendar, Tag, MoreVertical, Edit2, Trash2, User, Settings, HelpCircle, FileText, Wallet, LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GradientProgress } from "../components/GradientProgress";
import { CommentsModal } from "../components/CommentsModal";
import { ShareBottomSheet } from "../components/ShareBottomSheet";
import { AppHeader } from "../components/AppHeader";
import { AppSideMenu } from "../components/AppSideMenu";
import { CreateStoryModal } from "../components/CreateStoryModal";
import { useScrollContext } from "../Root";

interface UserPost {
  id: string;
  type: "user_post";
  user: string;
  userImage: string;
  text: string;
  image?: string;
  location?: string;
  tags?: string[];
  likes: number;
  comments: Comment[];
  shares: number;
  timestamp: Date;
  isOwn: boolean;
  likedBy: string[];
}

interface Comment {
  id: string;
  user: string;
  userImage: string;
  text: string;
  likes: number;
  timestamp: Date;
}

interface Campaign {
  id: number;
  type: "campaign";
  user: string;
  userImage: string;
  destination: string;
  image: string;
  goal: number;
  raised: number;
  donors: number;
  likes: number;
  comments: number;
  description: string;
}

interface AgencyOffer {
  id: string;
  type: "agency";
  agencyName: string;
  agencyLogo: string;
  destination: string;
  image: string;
  discount: string;
  originalPrice: number;
  discountedPrice: number;
  duration: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
}

type FeedItem = UserPost | Campaign | AgencyOffer;

const stories = [
  { id: 1, name: "Your Story", image: null, isAdd: true },
  { id: 2, name: "Emma", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
  { id: 3, name: "Alex", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
  { id: 4, name: "Maria", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
  { id: 5, name: "John", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
];

const agencyOffers: AgencyOffer[] = [
  {
    id: "agency-1",
    type: "agency",
    agencyName: "Wanderlust Travel Co.",
    agencyLogo: "https://images.unsplash.com/photo-1544367945-4125eb396314?w=100",
    destination: "Maldives Paradise",
    image: "https://images.unsplash.com/photo-1727874098383-8538af9d76bb?w=600",
    discount: "30% OFF",
    originalPrice: 3500,
    discountedPrice: 2450,
    duration: "7 Days / 6 Nights",
    rating: 4.9,
    reviews: 156,
    description: "Luxury overwater villa experience with all-inclusive dining and spa treatments",
    features: ["All-inclusive", "5-Star Resort", "Private Transfer"],
  },
  {
    id: "agency-2",
    type: "agency",
    agencyName: "Elite Voyages",
    agencyLogo: "https://images.unsplash.com/photo-1544367945-4125eb396314?w=100",
    destination: "Dubai Luxury Escape",
    image: "https://images.unsplash.com/photo-1768069794857-9306ac167c6e?w=600",
    discount: "25% OFF",
    originalPrice: 2800,
    discountedPrice: 2100,
    duration: "5 Days / 4 Nights",
    rating: 4.8,
    reviews: 203,
    description: "Experience Dubai's finest hotels, desert safari, and Burj Khalifa views",
    features: ["Desert Safari", "Burj Khalifa", "City Tour"],
  },
];

const campaigns: Campaign[] = [
  {
    id: 1,
    type: "campaign",
    user: "Emma Watson",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    destination: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600",
    goal: 5000,
    raised: 3500,
    donors: 42,
    likes: 156,
    comments: 23,
    description: "Dreaming of watching the sunset over the white cliffs of Santorini!",
  },
  {
    id: 2,
    type: "campaign",
    user: "Alex Chen",
    userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    destination: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600",
    goal: 4000,
    raised: 2800,
    donors: 35,
    likes: 203,
    comments: 31,
    description: "Exploring the neon streets and ancient temples of Tokyo 🗾",
  },
  {
    id: 3,
    type: "campaign",
    user: "Maria Garcia",
    userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    destination: "Machu Picchu, Peru",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600",
    goal: 6000,
    raised: 4200,
    donors: 58,
    likes: 287,
    comments: 45,
    description: "A lifelong dream to visit the ancient Incan citadel!",
  },
];

// Sample user posts
const initialUserPosts: UserPost[] = [
  {
    id: "post-1",
    type: "user_post",
    user: "John Traveler",
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    text: "Just booked my flight to Bali! Can't wait to explore the beaches and temples. Any recommendations? 🏝️✈️",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600",
    location: "Planning for Bali, Indonesia",
    tags: ["Bali", "TravelGoals", "BeachLife"],
    likes: 89,
    comments: [],
    shares: 12,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isOwn: true,
    likedBy: [],
  },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [createStoryModalOpen, setCreateStoryModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<UserPost | null>(null);
  const [userPosts, setUserPosts] = useState<UserPost[]>(initialUserPosts);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  
  // Comments modal state
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<string>("");
  
  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharePostId, setSharePostId] = useState<string>("");
  
  // Post options menu
  const [postOptionsOpen, setPostOptionsOpen] = useState<string | null>(null);

  // Combine all feed items
  const allFeedItems: FeedItem[] = [
    ...userPosts,
    campaigns[0],
    agencyOffers[0],
    campaigns[1],
    agencyOffers[1],
    campaigns[2],
  ].sort((a, b) => {
    // Sort by timestamp for user posts, otherwise keep order
    if (a.type === "user_post" && b.type === "user_post") {
      return b.timestamp.getTime() - a.timestamp.getTime();
    }
    return 0;
  });

  const handleCreatePost = (postData: {
    text: string;
    image?: string;
    location?: string;
    tags?: string[];
  }) => {
    const newPost: UserPost = {
      id: `post-${Date.now()}`,
      type: "user_post",
      user: "John Traveler",
      userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      text: postData.text,
      image: postData.image,
      location: postData.location,
      tags: postData.tags,
      likes: 0,
      comments: [],
      shares: 0,
      timestamp: new Date(),
      isOwn: true,
      likedBy: [],
    };
    
    setUserPosts([newPost, ...userPosts]);
    setCreatePostModalOpen(false);
  };

  const handleEditPost = (postData: {
    text: string;
    image?: string;
    location?: string;
    tags?: string[];
  }) => {
    if (!editingPost) return;
    
    setUserPosts(userPosts.map(post => 
      post.id === editingPost.id
        ? {
            ...post,
            text: postData.text,
            image: postData.image,
            location: postData.location,
            tags: postData.tags,
          }
        : post
    ));
    
    setEditingPost(null);
    setCreatePostModalOpen(false);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setUserPosts(userPosts.filter(post => post.id !== postId));
      setPostOptionsOpen(null);
    }
  };

  const toggleLike = (itemId: string | number) => {
    const id = String(itemId);
    setLikedItems((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleOpenComments = (postId: string | number) => {
    setActivePostId(String(postId));
    setCommentsModalOpen(true);
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: "John Traveler",
      userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      text,
      likes: 0,
      timestamp: new Date(),
    };

    setUserPosts(userPosts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    setSharePostId(postId);
    setShareModalOpen(true);
  };

  const openEditModal = (post: UserPost) => {
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
    setPostOptionsOpen(null);
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

  const getActiveComments = () => {
    const post = userPosts.find(p => p.id === activePostId);
    return post?.comments || [];
  };

  const menuItems = [
    { icon: User, label: "My Profile", path: "/app/profile" },
    { icon: Wallet, label: "Withdraw Funds", path: "/app/withdraw" },
    { icon: Settings, label: "Settings", path: "/app/settings" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
    { icon: FileText, label: "Terms & Privacy", path: "/terms" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader onMenuClick={() => setSideMenuOpen(true)} />

      {/* Stories */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="flex gap-3">
          {stories.map((story) => (
            <button 
              key={story.id} 
              className="flex flex-col items-center gap-2 flex-shrink-0"
              onClick={() => {
                if (story.isAdd) {
                  setCreateStoryModalOpen(true);
                } else {
                  navigate(`/story/${story.id}`);
                }
              }}
            >
              <div
                className="w-16 h-16 rounded-full p-0.5 flex items-center justify-center"
                style={{
                  background: story.isAdd ? "var(--muted)" : "var(--vaykae-gradient)",
                }}
              >
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                  {story.isAdd ? (
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  ) : (
                    <ImageWithFallback
                      src={story.image || ""}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              <span className="text-xs max-w-[64px] truncate">
                {story.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Wallet Quick Access */}
      <div className="px-4 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate("/app/wallet")}
          className="p-4 rounded-2xl cursor-pointer relative overflow-hidden"
          style={{ background: "var(--vaykae-gradient)" }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs mb-1 font-medium">Available Balance</p>
              <p className="text-white text-2xl font-bold mb-1">$2,450</p>
              <p className="text-white/70 text-xs">Pending: $2,000</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feed */}
      <div className="pb-20">
        {allFeedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="mb-4 bg-card"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={() => {
                  // Navigate to user profile for campaigns and user posts (not agencies)
                  if (item.type === "campaign") {
                    // Extract userId from user name (in real app, use actual user ID)
                    const userId = item.user.toLowerCase().split(" ")[0];
                    navigate(`/app/user/${userId}`);
                  } else if (item.type === "user_post") {
                    const userId = item.user.toLowerCase().split(" ")[0];
                    navigate(`/app/user/${userId}`);
                  } else if (item.type === "agency") {
                    navigate(`/app/agency/${item.id}`);
                  }
                }}
                className="flex items-center gap-3 flex-1"
              >
                <ImageWithFallback
                  src={
                    item.type === "campaign" 
                      ? item.userImage 
                      : item.type === "agency" 
                      ? item.agencyLogo 
                      : item.userImage
                  }
                  alt={
                    item.type === "campaign" 
                      ? item.user 
                      : item.type === "agency" 
                      ? item.agencyName 
                      : item.user
                  }
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {item.type === "campaign" 
                        ? item.user 
                        : item.type === "agency" 
                        ? item.agencyName 
                        : item.user}
                    </p>
                    {item.type === "agency" && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "var(--vaykae-gradient)" }}>
                        <Sparkles className="w-3 h-3 text-white" />
                        <span className="text-white font-medium">Sponsored</span>
                      </div>
                    )}
                  </div>
                  {item.type === "user_post" ? (
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(item.timestamp)}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {item.type === "campaign" ? item.destination : item.destination}
                    </p>
                  )}
                </div>
              </button>
              
              {/* Options Menu for Own Posts */}
              {item.type === "user_post" && item.isOwn && (
                <div className="relative">
                  <button
                    onClick={() => setPostOptionsOpen(postOptionsOpen === item.id ? null : item.id)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  <AnimatePresence>
                    {postOptionsOpen === item.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 bg-card border border-border rounded-2xl shadow-lg overflow-hidden z-20 min-w-[160px]"
                      >
                        <button
                          onClick={() => openEditModal(item)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="font-medium">Edit Post</span>
                        </button>
                        <button
                          onClick={() => handleDeletePost(item.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-500 transition-colors text-left"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="font-medium">Delete Post</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* User Post Content */}
            {item.type === "user_post" && (
              <div className="px-4 pb-3">
                <p className="mb-3 whitespace-pre-wrap">{item.text}</p>
                
                {/* Location */}
                {item.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                )}
                
                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag) => (
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
            )}

            {/* Image */}
            {(item.type === "user_post" ? item.image : true) && (
              <div className="relative cursor-pointer" onClick={() => {
                if (item.type === "campaign") {
                  navigate(`/app/campaign/${item.id}`);
                } else if (item.type === "agency") {
                  navigate(`/app/agency/${item.id}`);
                }
              }}>
                <ImageWithFallback
                  src={
                    item.type === "user_post" 
                      ? item.image! 
                      : item.image
                  }
                  alt={item.type === "campaign" ? item.destination : item.type === "agency" ? item.destination : "Post image"}
                  className="w-full aspect-[4/3] object-cover"
                />
                {item.type === "agency" && (
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-white font-bold text-sm shadow-lg" style={{ background: "var(--vaykae-gradient)" }}>
                    {item.discount}
                  </div>
                )}
              </div>
            )}

            {/* Campaign/Agency Description */}
            {item.type !== "user_post" && (
              <div className="p-4">
                <p className="mb-3">{item.description}</p>

                {/* Agency Offer Details */}
                {item.type === "agency" ? (
                  <>
                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs"
                        >
                          <Tag className="w-3 h-3" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price & Duration */}
                    <div className="flex items-center justify-between mb-4 p-3 rounded-2xl bg-muted/50">
                      <div>
                        <p className="text-sm text-muted-foreground line-through">
                          ${item.originalPrice.toLocaleString()}
                        </p>
                        <p className="text-2xl font-bold" style={{ background: "var(--vaykae-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                          ${item.discountedPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{item.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm mt-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium">{item.rating}</span>
                          <span className="text-muted-foreground">({item.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Campaign Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">
                          <span className="font-semibold">${item.raised.toLocaleString()}</span> of ${item.goal.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.donors} donors
                        </span>
                      </div>
                      <GradientProgress
                        value={item.raised}
                        max={item.goal}
                        showPercentage={false}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-4 pt-3 border-t border-border">
                <button
                  onClick={() => toggleLike(item.id)}
                  className="flex items-center gap-2 transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      likedItems.includes(String(item.id))
                        ? "fill-[var(--vaykae-pink)] text-[var(--vaykae-pink)]"
                        : "text-foreground"
                    }`}
                  />
                  <span className="text-sm">
                    {(item.type === "user_post" ? item.likes : item.type === "campaign" ? item.likes : item.reviews) + 
                     (likedItems.includes(String(item.id)) ? 1 : 0)}
                  </span>
                </button>
                
                <button 
                  onClick={() => handleOpenComments(item.id)}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-sm">
                    {item.type === "user_post" ? item.comments.length : item.type === "campaign" ? item.comments : 0}
                  </span>
                </button>
                
                <button 
                  onClick={() => handleShare(item.id)}
                  className="flex items-center gap-2 ml-auto"
                >
                  <Share2 className="w-6 h-6" />
                  {item.type === "user_post" && item.shares > 0 && (
                    <span className="text-sm">{item.shares}</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          navigate("/app/create-post");
        }}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-20"
        style={{
          background: "var(--vaykae-gradient)",
          boxShadow: "0 4px 16px rgba(215, 1, 168, 0.3)",
        }}
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Side Menu */}
      <AppSideMenu isOpen={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />

      {/* Modals */}
      <CommentsModal
        isOpen={commentsModalOpen}
        onClose={() => setCommentsModalOpen(false)}
        postId={activePostId}
        comments={getActiveComments()}
        onAddComment={handleAddComment}
      />

      <ShareBottomSheet
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        postId={sharePostId}
      />

      <CreateStoryModal
        isOpen={createStoryModalOpen}
        onClose={() => setCreateStoryModalOpen(false)}
        onSubmit={(storyData) => {
          console.log("Story created:", storyData);
          setCreateStoryModalOpen(false);
        }}
      />
    </div>
  );
}