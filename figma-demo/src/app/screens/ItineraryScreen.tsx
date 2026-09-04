import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Filter, Star } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Input } from "../components/ui/input";

const packages = [
  {
    id: 1,
    agency: "Dream Travel Co.",
    destination: "Bali Paradise Package",
    price: 2500,
    duration: "7 days",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600",
    affordable: true,
  },
  {
    id: 2,
    agency: "Global Adventures",
    destination: "Tokyo Explorer",
    price: 3200,
    duration: "10 days",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600",
    affordable: false,
  },
  {
    id: 3,
    agency: "Luxury Escapes",
    destination: "Santorini Sunset",
    price: 4500,
    duration: "5 days",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600",
    affordable: true,
  },
];

export default function ItineraryScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl">Browse Packages</h1>
        </div>

        <div className="relative">
          <Input
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-12 h-12 rounded-2xl bg-input-background"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <Filter className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Affordable Suggestions */}
      <div className="px-4 py-4">
        <div
          className="p-4 rounded-2xl mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(218, 1, 166, 0.1) 0%, rgba(118, 0, 197, 0.1) 100%)",
          }}
        >
          <h2 className="font-medium mb-1">✨ Trips You Can Afford</h2>
          <p className="text-sm text-muted-foreground">
            Based on your current fundraising progress
          </p>
        </div>

        <div className="space-y-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-2xl overflow-hidden bg-card border border-border cursor-pointer"
              onClick={() => navigate(`/app/agency/${pkg.id}`)}
            >
              <div className="relative">
                <ImageWithFallback
                  src={pkg.image}
                  alt={pkg.destination}
                  className="w-full aspect-[16/9] object-cover"
                />
                {pkg.affordable && (
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs"
                    style={{
                      background: "var(--veakey-gradient)",
                    }}
                  >
                    You can afford this!
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium mb-1">{pkg.destination}</h3>
                    <p className="text-sm text-muted-foreground">{pkg.agency}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{pkg.duration}</span>
                  </div>
                  <p className="text-xl font-semibold">${pkg.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
