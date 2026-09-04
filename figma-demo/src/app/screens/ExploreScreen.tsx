import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, Filter, TrendingUp, X, Map, Compass, DollarSign, Sparkles, Building2, Award } from "lucide-react";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GradientProgress } from "../components/GradientProgress";
import { AppHeader } from "../components/AppHeader";
import { AppSideMenu } from "../components/AppSideMenu";
import { GradientButton } from "../components/GradientButton";
import { motion } from "motion/react";

interface Campaign {
  id: number;
  destination: string;
  location: string;
  country: string;
  image: string;
  goal: number;
  raised: number;
  category: string;
  distance?: number;
  lat: number;
  lng: number;
  creator: string;
  creatorImage: string;
}

const trendingDestinations = [
  { name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600", campaigns: 42 },
  { name: "Paris, France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600", campaigns: 38 },
  { name: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600", campaigns: 35 },
  { name: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600", campaigns: 28 },
  { name: "New York, USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600", campaigns: 45 },
];

const allCampaigns: Campaign[] = [
  {
    id: 1,
    destination: "Iceland Road Trip",
    location: "Reykjavik",
    country: "Iceland",
    image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=600",
    goal: 7000,
    raised: 5600,
    category: "Adventure",
    distance: 2.5,
    lat: 64.1466,
    lng: -21.9426,
    creator: "Emma Watson",
    creatorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  },
  {
    id: 2,
    destination: "African Safari",
    location: "Serengeti",
    country: "Tanzania",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600",
    goal: 8500,
    raised: 6200,
    category: "Wildlife",
    distance: 5.8,
    lat: -2.3333,
    lng: 34.8333,
    creator: "Alex Chen",
    creatorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  },
  {
    id: 3,
    destination: "European Backpacking",
    location: "Rome",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600",
    goal: 4500,
    raised: 3800,
    category: "Backpacking",
    distance: 1.2,
    lat: 41.9028,
    lng: 12.4964,
    creator: "Sarah Johnson",
    creatorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
  },
  {
    id: 4,
    destination: "Bali Yoga Retreat",
    location: "Ubud",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600",
    goal: 3000,
    raised: 2400,
    category: "Wellness",
    distance: 0.8,
    lat: -8.5069,
    lng: 115.2625,
    creator: "Maya Patel",
    creatorImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100",
  },
  {
    id: 5,
    destination: "Caribbean Beach Escape",
    location: "Cancun",
    country: "Mexico",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600",
    goal: 5500,
    raised: 4200,
    category: "Beach",
    distance: 3.1,
    lat: 21.1619,
    lng: -86.8515,
    creator: "John Smith",
    creatorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  },
  {
    id: 6,
    destination: "Mount Kilimanjaro Trek",
    location: "Moshi",
    country: "Tanzania",
    image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600",
    goal: 6000,
    raised: 1800,
    category: "Adventure",
    distance: 5.5,
    lat: -3.0674,
    lng: 37.3556,
    creator: "David Lee",
    creatorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  },
  {
    id: 7,
    destination: "Amsterdam City Break",
    location: "Amsterdam",
    country: "Netherlands",
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600",
    goal: 2500,
    raised: 2100,
    category: "City",
    distance: 1.8,
    lat: 52.3676,
    lng: 4.9041,
    creator: "Lisa Brown",
    creatorImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100",
  },
  {
    id: 8,
    destination: "New Zealand Adventure",
    location: "Queenstown",
    country: "New Zealand",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600",
    goal: 9000,
    raised: 7200,
    category: "Adventure",
    distance: 8.2,
    lat: -45.0312,
    lng: 168.6626,
    creator: "Chris Wilson",
    creatorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
  },
];

const agencyOffers = [
  {
    id: 1,
    name: "Wanderlust Travels",
    logo: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100",
    rating: 4.8,
    trips: 350,
    offer: "Save 25% on all Asia packages this month!",
    specialty: "Adventure Tours",
  },
  {
    id: 2,
    name: "Elite Escapes",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100",
    rating: 4.9,
    trips: 280,
    offer: "Exclusive European luxury tours - Book now!",
    specialty: "Luxury Travel",
  },
  {
    id: 3,
    name: "Global Adventures Co.",
    logo: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100",
    rating: 4.7,
    trips: 420,
    offer: "Group discounts available for 5+ travelers",
    specialty: "Group Travel",
  },
];

const tripTypes = [
  "All",
  "Adventure",
  "Beach",
  "City",
  "Wildlife",
  "Wellness",
  "Backpacking",
  "Luxury",
  "Family",
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [selectedTripType, setSelectedTripType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [fundingProgress, setFundingProgress] = useState("all");
  const navigate = useNavigate();

  // Filter campaigns
  const filteredCampaigns = allCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTripType =
      selectedTripType === "All" || campaign.category === selectedTripType;

    const matchesLocation =
      !selectedLocation ||
      campaign.country.toLowerCase().includes(selectedLocation.toLowerCase());

    const progress = (campaign.raised / campaign.goal) * 100;
    const matchesFunding =
      fundingProgress === "all" ||
      (fundingProgress === "high" && progress >= 75) ||
      (fundingProgress === "medium" && progress >= 25 && progress < 75) ||
      (fundingProgress === "low" && progress < 25);

    return matchesSearch && matchesTripType && matchesLocation && matchesFunding;
  });

  const nearbyCampaigns = allCampaigns
    .filter((c) => c.distance && c.distance <= 5)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const clearFilters = () => {
    setSelectedTripType("All");
    setSelectedLocation("");
    setFundingProgress("all");
  };

  const activeFilterCount = [
    selectedTripType !== "All",
    selectedLocation !== "",
    fundingProgress !== "all",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background pb-20" style={{ maxWidth: "430px", margin: "0 auto" }}>
      {/* Header */}
      <AppHeader onMenuClick={() => setSideMenuOpen(true)} />

      {/* Search Bar */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Input
            placeholder="Search destinations, campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-12 rounded-2xl bg-input-background border border-border"
          />
          <button
            onClick={() => setShowFilters(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Filter className="w-5 h-5 text-muted-foreground" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--vaykae-pink)] text-white text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Trip Type Filter Chips */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {tripTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedTripType(type)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
                selectedTripType === type
                  ? "text-white shadow-md"
                  : "bg-muted text-muted-foreground"
              }`}
              style={
                selectedTripType === type
                  ? { background: "var(--vaykae-gradient)" }
                  : {}
              }
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Map View Toggle */}
      <div className="px-4 pb-3">
        <button
          onClick={() => setShowMapView(!showMapView)}
          className={`w-full h-11 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all ${
            showMapView ? "text-white" : "border-2 text-[var(--vaykae-pink)]"
          }`}
          style={
            showMapView
              ? { background: "var(--vaykae-gradient)", border: "none" }
              : { borderColor: "var(--vaykae-pink)" }
          }
        >
          <Map className="w-4 h-4" />
          {showMapView ? "Show List View" : "Show Map View"}
        </button>
      </div>

      {showMapView ? (
        /* Map View */
        <div className="px-4 pb-6">
          <div className="relative w-full h-[400px] bg-muted rounded-2xl overflow-hidden border border-border">
            {/* Simple Map Representation */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100">
              {/* Map Grid Lines */}
              <svg className="w-full h-full opacity-20">
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="gray"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Campaign Pins */}
              {filteredCampaigns.map((campaign, index) => {
                // Simple positioning based on lat/lng (simplified)
                const x = ((campaign.lng + 180) / 360) * 100;
                const y = ((90 - campaign.lat) / 180) * 100;

                return (
                  <motion.div
                    key={campaign.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="absolute cursor-pointer group"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => navigate(`/app/campaign/${campaign.id}`)}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-full">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                        style={{ background: "var(--vaykae-gradient)" }}
                      >
                        <MapPin className="w-4 h-4 text-white fill-white" />
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-white rounded-lg shadow-lg p-2 whitespace-nowrap text-xs font-medium">
                          {campaign.destination}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
              <p className="text-xs font-bold mb-1">
                {filteredCampaigns.length} campaigns
              </p>
              <p className="text-xs text-muted-foreground">Click pins to view</p>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-6 pb-6">
          {/* Nearby Campaigns */}
          {nearbyCampaigns.length > 0 && (
            <div className="px-4">
              <div className="flex items-center gap-2 mb-4">
                <Compass className="w-5 h-5 text-[var(--vaykae-pink)]" />
                <h2 className="font-bold">Near You</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {nearbyCampaigns.length}
                </span>
              </div>

              <div className="overflow-x-auto -mx-4 px-4">
                <div className="flex gap-3 pb-2">
                  {nearbyCampaigns.map((campaign, index) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex-shrink-0 w-64 rounded-2xl overflow-hidden bg-card border border-border cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/app/campaign/${campaign.id}`)}
                    >
                      <div className="relative">
                        <ImageWithFallback
                          src={campaign.image}
                          alt={campaign.destination}
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {campaign.distance} mi
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-sm mb-1 line-clamp-1">
                          {campaign.destination}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {campaign.location}, {campaign.country}
                        </p>
                        <div className="mb-2">
                          <GradientProgress
                            value={campaign.raised}
                            max={campaign.goal}
                            showPercentage={false}
                          />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold">
                            ${campaign.raised.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">
                            of ${campaign.goal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Trending Destinations */}
          <div className="px-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[var(--vaykae-pink)]" />
              <h2 className="font-bold">Trending Destinations</h2>
            </div>

            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex gap-3 pb-2">
                {trendingDestinations.map((dest, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-40 rounded-2xl overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/app/explore/${dest.name}`)}
                  >
                    <ImageWithFallback
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-28 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3">
                      <div className="flex items-center gap-1 text-white mb-1">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs font-bold line-clamp-1">
                          {dest.name}
                        </span>
                      </div>
                      <span className="text-xs text-white/80">
                        {dest.campaigns} campaigns
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Campaigns */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--vaykae-pink)]" />
                <h2 className="font-bold">
                  {selectedTripType !== "All"
                    ? `${selectedTripType} Campaigns`
                    : "Popular Campaigns"}
                </h2>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {filteredCampaigns.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl overflow-hidden bg-card border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/app/campaign/${campaign.id}`)}
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={campaign.image}
                      alt={campaign.destination}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full text-white font-bold"
                        style={{ background: "var(--vaykae-gradient)" }}
                      >
                        {campaign.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm mb-1 line-clamp-1">
                      {campaign.destination}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {campaign.location}, {campaign.country}
                    </p>
                    <div className="mb-2">
                      <GradientProgress
                        value={campaign.raised}
                        max={campaign.goal}
                        showPercentage={false}
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <ImageWithFallback
                        src={campaign.creatorImage}
                        alt={campaign.creator}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {campaign.creator}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">
                        ${campaign.raised.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        {Math.round((campaign.raised / campaign.goal) * 100)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <Compass className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No campaigns found</p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[var(--vaykae-pink)] font-bold"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Agency Offers */}
          <div className="px-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-[var(--vaykae-pink)]" />
              <h2 className="font-bold">Featured Agencies</h2>
            </div>

            <div className="space-y-3">
              {agencyOffers.map((agency, index) => (
                <motion.div
                  key={agency.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-2xl bg-card border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/app/agency/${agency.id}`)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <ImageWithFallback
                      src={agency.logo}
                      alt={agency.name}
                      className="w-14 h-14 rounded-xl object-cover border border-border"
                    />
                    <div className="flex-1">
                      <p className="font-bold mb-1">{agency.name}</p>
                      <p className="text-xs text-muted-foreground mb-1">
                        {agency.specialty}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-yellow-500" />
                          <span>{agency.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{agency.trips}+ trips</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20">
                    <p className="text-sm font-medium text-[var(--vaykae-pink)]">
                      {agency.offer}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-card rounded-t-3xl w-full max-w-[430px] p-6 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-bold mb-3">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Filter by country or city..."
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:border-[var(--vaykae-pink)] transition-colors"
                  />
                </div>
              </div>

              {/* Trip Type Filter */}
              <div>
                <label className="block text-sm font-bold mb-3">Trip Type</label>
                <div className="flex flex-wrap gap-2">
                  {tripTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedTripType(type)}
                      className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                        selectedTripType === type
                          ? "text-white shadow-md"
                          : "bg-muted text-muted-foreground"
                      }`}
                      style={
                        selectedTripType === type
                          ? { background: "var(--vaykae-gradient)" }
                          : {}
                      }
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Funding Progress Filter */}
              <div>
                <label className="block text-sm font-bold mb-3">
                  Funding Progress
                </label>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Campaigns", icon: Sparkles },
                    { value: "high", label: "75%+ Funded", icon: TrendingUp },
                    { value: "medium", label: "25-75% Funded", icon: DollarSign },
                    { value: "low", label: "Just Started (<25%)", icon: Compass },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFundingProgress(option.value)}
                      className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                        fundingProgress === option.value
                          ? "bg-gradient-to-r from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border-2 border-[var(--vaykae-pink)]"
                          : "bg-muted border-2 border-transparent"
                      }`}
                    >
                      <option.icon
                        className={`w-5 h-5 ${
                          fundingProgress === option.value
                            ? "text-[var(--vaykae-pink)]"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          fundingProgress === option.value
                            ? "text-[var(--vaykae-pink)]"
                            : "text-foreground"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={clearFilters}
                  className="flex-1 h-12 rounded-2xl border-2 border-border font-bold hover:bg-muted transition-colors"
                >
                  Clear All
                </button>
                <GradientButton
                  onClick={() => setShowFilters(false)}
                  className="flex-1"
                >
                  Apply Filters
                </GradientButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Side Menu */}
      <AppSideMenu isOpen={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
    </div>
  );
}
