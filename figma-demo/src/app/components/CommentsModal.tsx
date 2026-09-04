import { useState } from "react";
import { X, Send, Heart } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Comment {
  id: string;
  user: string;
  userImage: string;
  text: string;
  likes: number;
  timestamp: Date;
  isLiked?: boolean;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, text: string) => void;
}

export function CommentsModal({ isOpen, onClose, postId, comments, onAddComment }: CommentsModalProps) {
  const [commentText, setCommentText] = useState("");
  const [likedComments, setLikedComments] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (commentText.trim()) {
      onAddComment(postId, commentText.trim());
      setCommentText("");
    }
  };

  const toggleLikeComment = (commentId: string) => {
    setLikedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
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
    return `${days}d ago`;
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
        className="bg-card rounded-t-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-lg font-bold">Comments</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-4">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No comments yet</p>
              <p className="text-sm text-muted-foreground mt-1">Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <ImageWithFallback
                    src={comment.userImage}
                    alt={comment.user}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-muted rounded-2xl px-4 py-2.5">
                      <p className="font-medium text-sm mb-1">{comment.user}</p>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 px-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(comment.timestamp)}
                      </span>
                      <button
                        onClick={() => toggleLikeComment(comment.id)}
                        className="flex items-center gap-1 text-xs transition-colors"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            likedComments.includes(comment.id)
                              ? "fill-[var(--vaykae-pink)] text-[var(--vaykae-pink)]"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className={likedComments.includes(comment.id) ? "text-[var(--vaykae-pink)]" : "text-muted-foreground"}>
                          {comment.likes + (likedComments.includes(comment.id) ? 1 : 0)}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border sticky bottom-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium">You</span>
            </div>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              className="flex-1 h-10 px-4 rounded-full border border-border bg-input-background focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
            />
            <button
              onClick={handleSubmit}
              disabled={!commentText.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30"
              style={{ background: "var(--vaykae-gradient)" }}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}