import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, Image as ImageIcon, MapPin, Tag, X } from "lucide-react";
import { GradientButton } from "../components/GradientButton";
import { Input } from "../components/ui/input";

interface LocationState {
  editPost?: {
    id: string;
    text: string;
    image?: string;
    location?: string;
    tags?: string[];
  };
}

export default function CreatePostScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const editPost = state?.editPost;

  const [text, setText] = useState(editPost?.text || "");
  const [image, setImage] = useState<string | undefined>(editPost?.image);
  const [locationText, setLocationText] = useState(editPost?.location || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(editPost?.tags || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const postData = {
        text: text.trim(),
        image,
        location: locationText.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        editPostId: editPost?.id,
      };
      
      // Navigate back with post data
      navigate("/app/home", { state: { newPost: postData } });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background" style={{ maxWidth: "430px", margin: "0 auto" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">{editPost ? "Edit Post" : "Create Post"}</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-20">
        {/* Text Input */}
        <textarea
          placeholder="What's on your mind? Share your travel thoughts..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-2xl border border-border bg-input-background focus:outline-none focus:border-[var(--vaykae-pink)] resize-none transition-colors mb-4"
          autoFocus
        />

        {/* Image Preview */}
        {image && (
          <div className="relative mb-4 rounded-2xl overflow-hidden">
            <img src={image} alt="Upload preview" className="w-full h-60 object-cover" />
            <button
              onClick={() => setImage(undefined)}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm mb-2 text-muted-foreground font-medium">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location (Optional)
          </label>
          <Input
            type="text"
            placeholder="Add a location..."
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            className="h-12 rounded-2xl bg-input-background"
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-sm mb-2 text-muted-foreground font-medium">
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
              className="px-5 py-2 rounded-2xl border-2 border-[var(--vaykae-pink)] text-[var(--vaykae-pink)] font-bold hover:bg-[var(--vaykae-pink)]/10 transition-colors"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-sm font-medium"
                >
                  <span>#{tag}</span>
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
            className="w-full h-14 rounded-2xl border-2 border-dashed border-border hover:border-[var(--vaykae-pink)] transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground font-medium"
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

      {/* Footer - Fixed Post Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border" style={{ maxWidth: "430px", margin: "0 auto" }}>
        <GradientButton fullWidth onClick={handleSubmit} disabled={!text.trim()}>
          {editPost ? "Update Post" : "Post"}
        </GradientButton>
      </div>
    </div>
  );
}
