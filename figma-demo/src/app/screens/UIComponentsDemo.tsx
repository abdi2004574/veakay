import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle, Share2, MessageCircle, Edit, Download } from "lucide-react";
import { BottomSheet } from "../components/BottomSheet";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ActionSheet } from "../components/ActionSheet";
import { ShareModal } from "../components/ShareModal";
import { CommentsModal } from "../components/CommentsModal";

export default function UIComponentsDemo() {
  const navigate = useNavigate();
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);

  const mockComments = [
    {
      id: "1",
      user: "Emma Watson",
      userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      text: "This looks amazing! Can't wait to see more! 🎉",
      likes: 24,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      user: "Alex Chen",
      userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      text: "Great work on this! Keep it up 👏",
      likes: 15,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
  ];

  const handleAddComment = (postId: string, text: string) => {
    console.log("New comment:", { postId, text });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">UI Components Demo</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-lg font-bold mb-3">Bottom Sheets</h2>
          <button
            onClick={() => setBottomSheetOpen(true)}
            className="w-full h-12 rounded-2xl font-medium text-white"
            style={{ background: "var(--vaykae-gradient)" }}
          >
            Open Bottom Sheet
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">Confirmation Dialogs</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConfirmDialogOpen(true)}
              className="h-12 rounded-2xl font-medium bg-muted"
            >
              Confirm
            </button>
            <button
              onClick={() => setWarningDialogOpen(true)}
              className="h-12 rounded-2xl font-medium bg-muted"
            >
              Warning
            </button>
            <button
              onClick={() => setSuccessDialogOpen(true)}
              className="h-12 rounded-2xl font-medium bg-muted"
            >
              Success
            </button>
            <button
              onClick={() => setErrorDialogOpen(true)}
              className="h-12 rounded-2xl font-medium bg-muted"
            >
              Error
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">Action Sheet</h2>
          <button
            onClick={() => setActionSheetOpen(true)}
            className="w-full h-12 rounded-2xl font-medium bg-muted"
          >
            Open Action Sheet
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">Modals</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShareModalOpen(true)}
              className="h-12 rounded-2xl font-medium bg-muted"
            >
              Share Modal
            </button>
            <button
              onClick={() => setCommentsModalOpen(true)}
              className="h-12 rounded-2xl font-medium bg-muted"
            >
              Comments
            </button>
          </div>
        </div>

        <div className="pt-4 pb-8">
          <div className="p-4 rounded-2xl bg-muted">
            <p className="text-sm text-muted-foreground">
              All modals, bottom sheets, and dialogs are constrained to 430px width for mobile-first iOS & Android design.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        title="Bottom Sheet Example"
      >
        <div className="p-4 space-y-4">
          <p className="text-muted-foreground">
            This is a bottom sheet component with iOS/Android mobile styling. It slides up from the bottom with a smooth spring animation.
          </p>
          <div className="space-y-3">
            <button className="w-full h-12 rounded-2xl bg-muted font-medium">
              Option 1
            </button>
            <button className="w-full h-12 rounded-2xl bg-muted font-medium">
              Option 2
            </button>
            <button className="w-full h-12 rounded-2xl bg-muted font-medium">
              Option 3
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={() => console.log("Confirmed!")}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action? This cannot be undone."
        type="confirm"
        confirmText="Yes, Proceed"
        cancelText="Cancel"
      />

      {/* Warning Dialog */}
      <ConfirmDialog
        isOpen={warningDialogOpen}
        onClose={() => setWarningDialogOpen(false)}
        onConfirm={() => console.log("Warning accepted")}
        title="Warning"
        message="This action may have consequences. Please review before continuing."
        type="warning"
        confirmText="I Understand"
        cancelText="Go Back"
      />

      {/* Success Dialog */}
      <ConfirmDialog
        isOpen={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        title="Success!"
        message="Your action has been completed successfully. Everything is working as expected."
        type="success"
        confirmText="Great!"
        showCancel={false}
      />

      {/* Error Dialog */}
      <ConfirmDialog
        isOpen={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        onConfirm={() => console.log("Retry")}
        title="Error Occurred"
        message="Something went wrong. Please try again or contact support if the problem persists."
        type="error"
        confirmText="Try Again"
        cancelText="Cancel"
      />

      {/* Action Sheet */}
      <ActionSheet
        isOpen={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
        title="Choose an action"
        options={[
          {
            label: "Share",
            icon: Share2,
            onClick: () => console.log("Share clicked"),
          },
          {
            label: "Edit",
            icon: Edit,
            onClick: () => console.log("Edit clicked"),
            variant: "primary",
          },
          {
            label: "Download",
            icon: Download,
            onClick: () => console.log("Download clicked"),
          },
          {
            label: "Delete",
            icon: Trash2,
            onClick: () => console.log("Delete clicked"),
            variant: "danger",
          },
        ]}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        postId="demo-post-123"
      />

      {/* Comments Modal */}
      <CommentsModal
        isOpen={commentsModalOpen}
        onClose={() => setCommentsModalOpen(false)}
        postId="demo-post-123"
        comments={mockComments}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
