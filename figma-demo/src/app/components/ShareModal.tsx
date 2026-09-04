import { X, Check, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

interface Friend {
  id: string;
  name: string;
  image: string;
}

export function ShareModal({ isOpen, onClose, postId }: ShareModalProps) {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [shareOnProfile, setShareOnProfile] = useState(false);
  const [shared, setShared] = useState(false);
  
  if (!isOpen) return null;

  // Mock friends data - replace with actual data
  const friends: Friend[] = [
    { id: "1", name: "Emma", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
    { id: "2", name: "Alex", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
    { id: "3", name: "Maria", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
    { id: "4", name: "John", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
    { id: "5", name: "Sarah", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" },
    { id: "6", name: "Mike", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100" },
    { id: "7", name: "Lisa", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100" },
    { id: "8", name: "David", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100" },
  ];

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleShare = () => {
    if (selectedFriends.length === 0 && !shareOnProfile) {
      return;
    }
    
    console.log("Sharing post:", postId);
    console.log("Selected friends:", selectedFriends);
    console.log("Share on profile:", shareOnProfile);
    
    setShared(true);
    setTimeout(() => {
      setShared(false);
      setSelectedFriends([]);
      setShareOnProfile(false);
      onClose();
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end" 
      onClick={onClose}
      style={{ maxWidth: "430px", margin: "0 auto", left: 0, right: 0 }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-t-3xl w-full overflow-hidden shadow-2xl max-h-[80vh]"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-lg font-bold">Share Post</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(80vh - 180px)" }}>
          {shared ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--vaykae-gradient)" }}>
                <Check className="w-10 h-10 text-white" />
              </div>
              <p className="text-lg font-bold">Shared Successfully!</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedFriends.length > 0 && shareOnProfile
                  ? `Shared with ${selectedFriends.length} friend${selectedFriends.length > 1 ? 's' : ''} and on your profile`
                  : selectedFriends.length > 0
                  ? `Shared with ${selectedFriends.length} friend${selectedFriends.length > 1 ? 's' : ''}`
                  : "Shared on your profile"}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Friends List */}
              <div className="px-4 pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Share with Friends</h3>
                <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
                  {friends.map((friend) => {
                    const isSelected = selectedFriends.includes(friend.id);
                    return (
                      <button
                        key={friend.id}
                        onClick={() => toggleFriend(friend.id)}
                        className="flex flex-col items-center gap-2 flex-shrink-0 relative"
                      >
                        <div className="relative">
                          <div 
                            className={`w-16 h-16 rounded-full border-4 transition-all ${
                              isSelected 
                                ? "border-[var(--vaykae-pink)] scale-95" 
                                : "border-transparent"
                            }`}
                          >
                            <ImageWithFallback
                              src={friend.image}
                              alt={friend.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ background: "var(--vaykae-gradient)" }}
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <span className={`text-xs font-medium max-w-[70px] truncate ${
                          isSelected ? "text-[var(--vaykae-pink)]" : ""
                        }`}>
                          {friend.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Share on Profile */}
              <div className="px-4 pt-4 pb-4">
                <button
                  onClick={() => setShareOnProfile(!shareOnProfile)}
                  className={`w-full py-4 px-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    shareOnProfile
                      ? "border-[var(--vaykae-pink)] bg-[var(--vaykae-pink)]/10"
                      : "border-border bg-muted/50"
                  }`}
                >
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      shareOnProfile 
                        ? "scale-110" 
                        : ""
                    }`}
                    style={shareOnProfile ? { background: "var(--vaykae-gradient)" } : { background: "var(--muted)" }}
                  >
                    {shareOnProfile ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-bold ${shareOnProfile ? "text-[var(--vaykae-pink)]" : ""}`}>
                      Share on Your Profile
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Post will appear on your timeline
                    </p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer - Share Button */}
        {!shared && (
          <div className="p-4 border-t border-border">
            <button
              onClick={handleShare}
              disabled={selectedFriends.length === 0 && !shareOnProfile}
              className="w-full h-12 rounded-full font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--vaykae-gradient)" }}
            >
              {selectedFriends.length > 0 || shareOnProfile
                ? `Share ${selectedFriends.length > 0 ? `with ${selectedFriends.length} friend${selectedFriends.length > 1 ? 's' : ''}` : ''}${selectedFriends.length > 0 && shareOnProfile ? ' & ' : ''}${shareOnProfile ? 'on profile' : ''}`
                : "Select friends or profile"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}