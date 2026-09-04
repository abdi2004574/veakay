import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GradientProgress } from "../components/GradientProgress";
import { GradientButton } from "../components/GradientButton";
import { AppHeader } from "../components/AppHeader";
import { AppSideMenu } from "../components/AppSideMenu";
import { Edit2, Trash2, Plus, Eye, Gift, TrendingUp, Clock, Calendar, MapPin, DollarSign, Users } from "lucide-react";
import { motion } from "motion/react";

interface Campaign {
  id: number;
  destination: string;
  location: string;
  image: string;
  goal: number;
  raised: number;
  status: "active" | "completed" | "draft";
  privacy: "public" | "private";
  giftMode: boolean;
  tripDate: string;
  createdAt: string;
  contributors: number;
  views: number;
}

const myCampaigns: Campaign[] = [
  {
    id: 1,
    destination: "Santorini Dream Vacation",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600",
    goal: 5000,
    raised: 3500,
    status: "active",
    privacy: "public",
    giftMode: true,
    tripDate: "2026-08-15",
    createdAt: "2026-02-10",
    contributors: 42,
    views: 234,
  },
  {
    id: 2,
    destination: "Paris Anniversary Trip",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
    goal: 4500,
    raised: 3200,
    status: "active",
    privacy: "private",
    giftMode: false,
    tripDate: "2026-09-20",
    createdAt: "2026-02-15",
    contributors: 28,
    views: 156,
  },
  {
    id: 3,
    destination: "Bali Yoga Retreat",
    location: "Ubud, Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600",
    goal: 3000,
    raised: 3000,
    status: "completed",
    privacy: "public",
    giftMode: false,
    tripDate: "2026-07-01",
    createdAt: "2026-01-05",
    contributors: 35,
    views: 412,
  },
];

// Gift contributions received
const giftContributions = [
  {
    id: 1,
    campaignId: 1,
    campaignName: "Santorini Dream Vacation",
    contributorName: "Sarah Johnson",
    contributorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    amount: 150,
    date: "2026-03-15",
    message: "Happy Birthday! Hope you have an amazing trip! 🎉",
    occasion: "Birthday",
  },
  {
    id: 2,
    campaignId: 1,
    campaignName: "Santorini Dream Vacation",
    contributorName: "Mike Davis",
    contributorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    amount: 200,
    date: "2026-03-14",
    message: "Wishing you the best graduation gift!",
    occasion: "Graduation",
  },
  {
    id: 3,
    campaignId: 2,
    campaignName: "Paris Anniversary Trip",
    contributorName: "Emma Watson",
    contributorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    amount: 300,
    date: "2026-03-12",
    message: "Happy Anniversary! You two deserve this!",
    occasion: "Anniversary",
  },
];

export default function CampaignsScreen() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"campaigns" | "gifts">("campaigns");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleEdit = (campaignId: number) => {
    navigate(`/app/create-campaign?edit=${campaignId}`);
  };

  const handleDelete = (campaignId: number) => {
    setShowDeleteConfirm(campaignId);
  };

  const confirmDelete = () => {
    // Delete campaign logic here
    setShowDeleteConfirm(null);
  };

  const activeCampaigns = myCampaigns.filter(c => c.status === "active");
  const completedCampaigns = myCampaigns.filter(c => c.status === "completed");

  return (
    <div className="min-h-screen bg-background pb-20" style={{ maxWidth: "430px", margin: "0 auto" }}>
      {/* Header */}
      <AppHeader onMenuClick={() => setSideMenuOpen(true)} />

      {/* Tabs */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex gap-2 p-1 bg-muted rounded-2xl">
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "campaigns"
                ? "text-white shadow-md"
                : "text-muted-foreground"
            }`}
            style={
              activeTab === "campaigns"
                ? { background: "var(--vaykae-gradient)" }
                : {}
            }
          >
            My Campaigns ({myCampaigns.length})
          </button>
          <button
            onClick={() => setActiveTab("gifts")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "gifts"
                ? "text-white shadow-md"
                : "text-muted-foreground"
            }`}
            style={
              activeTab === "gifts"
                ? { background: "var(--vaykae-gradient)" }
                : {}
            }
          >
            <Gift className="w-4 h-4 inline mr-1" />
            Gifts ({giftContributions.length})
          </button>
        </div>
      </div>

      {activeTab === "campaigns" ? (
        <div className="px-4 space-y-6">
          {/* Active Campaigns */}
          {activeCampaigns.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-[var(--vaykae-pink)]" />
                <h2 className="font-bold">Active Campaigns</h2>
              </div>

              <div className="space-y-3">
                {activeCampaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl overflow-hidden bg-card border border-border"
                  >
                    {/* Campaign Image */}
                    <div
                      className="relative cursor-pointer"
                      onClick={() => navigate(`/app/campaign/${campaign.id}`)}
                    >
                      <ImageWithFallback
                        src={campaign.image}
                        alt={campaign.destination}
                        className="w-full aspect-[16/9] object-cover"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold flex items-center gap-1">
                          {campaign.privacy === "public" ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Public
                            </>
                          ) : (
                            "Private"
                          )}
                        </span>
                        {campaign.giftMode && (
                          <span className="px-2 py-1 rounded-full bg-gradient-to-r from-[var(--vaykae-pink)] to-[var(--vaykae-purple)] text-white text-xs font-bold flex items-center gap-1">
                            <Gift className="w-3 h-3" />
                            Gift Mode
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Campaign Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{campaign.destination}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                            <MapPin className="w-3.5 h-3.5" />
                            {campaign.location}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Trip Date: {new Date(campaign.tripDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(campaign.id)}
                            className="w-9 h-9 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(campaign.id)}
                            className="w-9 h-9 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="p-2 rounded-xl bg-muted/50 text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">Contributors</p>
                          <p className="font-bold text-sm flex items-center justify-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {campaign.contributors}
                          </p>
                        </div>
                        <div className="p-2 rounded-xl bg-muted/50 text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">Views</p>
                          <p className="font-bold text-sm flex items-center justify-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {campaign.views}
                          </p>
                        </div>
                        <div className="p-2 rounded-xl bg-muted/50 text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">Progress</p>
                          <p className="font-bold text-sm">
                            {Math.round((campaign.raised / campaign.goal) * 100)}%
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-2">
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
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => navigate(`/app/campaign/${campaign.id}`)}
                        className="w-full h-11 rounded-xl bg-muted hover:bg-muted/70 font-bold transition-colors"
                      >
                        View Campaign Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Campaigns */}
          {completedCampaigns.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-green-600" />
                <h2 className="font-bold">Completed Campaigns</h2>
              </div>

              <div className="space-y-3">
                {completedCampaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl overflow-hidden bg-card border border-green-200"
                  >
                    <div
                      className="relative cursor-pointer"
                      onClick={() => navigate(`/app/campaign/${campaign.id}`)}
                    >
                      <ImageWithFallback
                        src={campaign.image}
                        alt={campaign.destination}
                        className="w-full aspect-[16/9] object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                          ✓ Completed
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold mb-1">{campaign.destination}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {campaign.contributors} contributors • ${campaign.raised.toLocaleString()} raised
                      </p>
                      
                      <GradientButton
                        fullWidth
                        onClick={() => navigate("/app/withdrawal")}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        View Withdrawal Options
                      </GradientButton>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {myCampaigns.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">No campaigns yet</p>
              <p className="text-sm text-muted-foreground">
                Tap the + button to create your first campaign
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Gift Contributions Tab */
        <div className="px-4 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--vaykae-pink)]/10 to-[var(--vaykae-purple)]/10 border border-[var(--vaykae-pink)]/20">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: "var(--vaykae-gradient)" }}
              >
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold">Gift Contributions Received</p>
                <p className="text-sm text-muted-foreground">
                  ${giftContributions.reduce((sum, g) => sum + g.amount, 0).toLocaleString()} total
                </p>
              </div>
            </div>
          </div>

          {giftContributions.map((gift, index) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-start gap-3 mb-3">
                <ImageWithFallback
                  src={gift.contributorImage}
                  alt={gift.contributorName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-bold">{gift.contributorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(gift.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-bold text-[var(--vaykae-pink)]">
                      +${gift.amount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--vaykae-pink)]/10 text-[var(--vaykae-pink)] font-bold">
                      {gift.occasion}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      → {gift.campaignName}
                    </span>
                  </div>
                  {gift.message && (
                    <p className="text-sm bg-muted/50 p-3 rounded-xl italic">
                      "{gift.message}"
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {giftContributions.length === 0 && (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">No gift contributions yet</p>
              <p className="text-sm text-muted-foreground">
                Enable Gift Mode on your campaigns to receive gifts
              </p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-3xl p-6 max-w-sm w-full"
          >
            <h3 className="text-xl font-bold mb-2">Delete Campaign?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this campaign? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 h-12 rounded-2xl border-2 border-border font-bold hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 h-12 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Side Menu */}
      <AppSideMenu isOpen={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />

      {/* Floating Action Button (FAB) */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/app/create-campaign")}
        className="fixed right-6 bottom-24 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl z-40"
        style={{
          background: "var(--vaykae-gradient)",
          boxShadow: "0 8px 24px rgba(119, 0, 198, 0.35), 0 4px 12px rgba(215, 1, 168, 0.25)",
        }}
      >
        <Plus className="w-7 h-7" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}