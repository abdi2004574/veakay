import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// Story data - in a real app this would come from an API
const allStories = [
  {
    userId: 2,
    userName: "Emma",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    stories: [
      {
        id: 1,
        type: "image" as const,
        content: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
        timestamp: "2h ago",
      },
      {
        id: 2,
        type: "image" as const,
        content: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800",
        timestamp: "3h ago",
      },
    ],
  },
  {
    userId: 3,
    userName: "Alex",
    userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    stories: [
      {
        id: 3,
        type: "image" as const,
        content: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        timestamp: "5h ago",
      },
    ],
  },
  {
    userId: 4,
    userName: "Maria",
    userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    stories: [
      {
        id: 4,
        type: "image" as const,
        content: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
        timestamp: "8h ago",
      },
      {
        id: 5,
        type: "image" as const,
        content: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800",
        timestamp: "10h ago",
      },
      {
        id: 6,
        type: "image" as const,
        content: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
        timestamp: "12h ago",
      },
    ],
  },
  {
    userId: 5,
    userName: "John",
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    stories: [
      {
        id: 7,
        type: "image" as const,
        content: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
        timestamp: "15h ago",
      },
    ],
  },
];

export default function StoryScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const STORY_DURATION = 5000; // 5 seconds per story

  // Find initial user
  useEffect(() => {
    if (id) {
      const userIndex = allStories.findIndex((u) => u.userId === parseInt(id));
      if (userIndex !== -1) {
        setCurrentUserIndex(userIndex);
      }
    }
  }, [id]);

  const currentUser = allStories[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];

  // Progress animation
  useEffect(() => {
    if (!currentStory || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / (STORY_DURATION / 100));
        if (next >= 100) {
          handleNext();
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStory, isPaused, currentStoryIndex, currentUserIndex]);

  const handleNext = () => {
    setProgress(0);
    if (currentStoryIndex < currentUser.stories.length - 1) {
      // Next story of same user
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentUserIndex < allStories.length - 1) {
      // Next user
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      // End of all stories
      navigate("/app");
    }
  };

  const handlePrevious = () => {
    setProgress(0);
    if (currentStoryIndex > 0) {
      // Previous story of same user
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentUserIndex > 0) {
      // Previous user
      const prevUserIndex = currentUserIndex - 1;
      setCurrentUserIndex(prevUserIndex);
      setCurrentStoryIndex(allStories[prevUserIndex].stories.length - 1);
    }
  };

  const handleClose = () => {
    navigate("/app");
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 3) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  if (!currentUser || !currentStory) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Story Content */}
      <div className="relative w-full h-full max-w-md mx-auto">
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
          {currentUser.stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all"
                style={{
                  width:
                    idx < currentStoryIndex
                      ? "100%"
                      : idx === currentStoryIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-4 px-4 pb-20 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageWithFallback
                src={currentUser.userImage}
                alt={currentUser.userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              <div>
                <p className="text-white font-medium">{currentUser.userName}</p>
                <p className="text-white/70 text-xs">{currentStory.timestamp}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story Image/Video */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentUserIndex}-${currentStoryIndex}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            onClick={handleTap}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <ImageWithFallback
              src={currentStory.content}
              alt="Story"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Areas (invisible but clickable) */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3 h-full" onClick={handlePrevious} />
          <div className="w-1/3 h-full" />
          <div className="w-1/3 h-full" onClick={handleNext} />
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-8 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Send message"
              className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-white placeholder:text-white/50 outline-none focus:border-white/50"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "var(--veakey-gradient)" }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Heart className="w-5 h-5 text-white" />
            </button>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "var(--veakey-gradient)" }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Navigation Arrows (for desktop) */}
        {currentUserIndex > 0 || currentStoryIndex > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : null}

        {currentUserIndex < allStories.length - 1 ||
        currentStoryIndex < currentUser.stories.length - 1 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        ) : null}
      </div>
    </div>
  );
}