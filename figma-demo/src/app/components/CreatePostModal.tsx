import { useState, useRef, useEffect } from "react";
import { X, Image as ImageIcon, MapPin, Tag } from "lucide-react";
import { GradientButton } from "./GradientButton";
import { Input } from "./ui/input";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: {
    text: string;
    image?: string;
    location?: string;
    tags?: string[];
  }) => void;
  editPost?: {
    id: string;
    text: string;
    image?: string;
    location?: string;
    tags?: string[];
  } | null;
}

export function CreatePostModal({ isOpen, onClose, onSubmit, editPost }: CreatePostModalProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [location, setLocation] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update state when editPost changes
  useEffect(() => {
    if (editPost && isOpen) {
      setText(editPost.text);
      setImage(editPost.image);
      setLocation(editPost.location || "");
      setTags(editPost.tags || []);
    } else if (!isOpen) {
      // Reset when modal closes
      setText("");
      setImage(undefined);
      setLocation("");
      setTags([]);
      setTagInput("");
    }
  }, [editPost, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit({
        text: text.trim(),
        image,
        location: location.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setText("");
    setImage(undefined);
    setLocation("");
    setTags([]);
    setTagInput("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">{editPost ? "Edit Post" : "Create Post"}</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Text Input */}
          <textarea
            placeholder="What's on your mind? Share your travel thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background focus:outline-none focus:border-[var(--vaykae-pink)] resize-none transition-colors mb-4"
          />

          {/* Image Preview */}
          {image && (
            <div className="relative mb-4 rounded-2xl overflow-hidden">
              <img src={image} alt="Upload preview" className="w-full h-48 object-cover" />
              <button
                onClick={() => setImage(undefined)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location (Optional)
            </label>
            <Input
              type="text"
              placeholder="Add a location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 rounded-2xl bg-input-background"
            />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-sm mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="h-12 rounded-2xl bg-input-background flex-1"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 rounded-2xl border border-[var(--vaykae-pink)] text-[var(--vaykae-pink)] hover:bg-[var(--vaykae-pink)]/10 transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload Button */}
          {!image && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12 rounded-2xl border-2 border-dashed border-border hover:border-[var(--vaykae-pink)] transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Add Photo</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <GradientButton fullWidth onClick={handleSubmit} disabled={!text.trim()}>
            {editPost ? "Update Post" : "Post"}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}