import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, FileText, CheckCircle2, X, AlertCircle } from "lucide-react";
import { GradientButton } from "../../components/GradientButton";
import { motion, AnimatePresence } from "motion/react";

interface Document {
  id: string;
  name: string;
  status: "verified" | "pending" | "rejected";
  uploadedDate: string;
  expiryDate?: string;
}

export default function AgencyUpdateDocumentsScreen() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Business License",
      status: "verified",
      uploadedDate: "Jan 15, 2026",
      expiryDate: "Jan 15, 2027",
    },
    {
      id: "2",
      name: "Tax Certificate",
      status: "verified",
      uploadedDate: "Jan 20, 2026",
      expiryDate: "Dec 31, 2026",
    },
    {
      id: "3",
      name: "Insurance Certificate",
      status: "pending",
      uploadedDate: "Mar 10, 2026",
      expiryDate: "Mar 10, 2027",
    },
  ]);

  const requiredDocuments = [
    {
      name: "Business License",
      description: "Valid business registration document",
      required: true,
    },
    {
      name: "Tax Certificate",
      description: "Tax identification number certificate",
      required: true,
    },
    {
      name: "Insurance Certificate",
      description: "Liability insurance documentation",
      required: true,
    },
    {
      name: "Tourism License",
      description: "Tourism authority certification",
      required: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/10 text-green-600";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "rejected":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/agency/app/settings")}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Update Documents</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Verification Status */}
        <div className="p-6">
          <div
            className="p-4 rounded-2xl text-white relative overflow-hidden"
            style={{ background: "var(--vaykae-gradient)" }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Verification Status</span>
              </div>
              <p className="text-white/90 text-sm">
                2 of 3 required documents verified. Complete verification to unlock all features.
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="px-6 pb-6">
          <h2 className="text-lg font-semibold mb-4">Uploaded Documents</h2>
          <div className="space-y-3">
            <AnimatePresence>
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-card rounded-2xl border border-border p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center flex-shrink-0"
                      style={{ color: "var(--vaykae-pink)" }}
                    >
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{doc.name}</h3>
                        <div
                          className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(
                            doc.status
                          )}`}
                        >
                          {getStatusIcon(doc.status)}
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Uploaded: {doc.uploadedDate}
                      </p>
                      {doc.expiryDate && (
                        <p className="text-sm text-muted-foreground">
                          Expires: {doc.expiryDate}
                        </p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <button className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                          View
                        </button>
                        <button className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                          Replace
                        </button>
                        {doc.status === "rejected" && (
                          <button
                            className="text-xs px-3 py-1.5 rounded-lg text-white"
                            style={{ background: "var(--vaykae-gradient)" }}
                          >
                            Resubmit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Required Documents */}
        <div className="px-6 pb-6">
          <h2 className="text-lg font-semibold mb-4">Required Documents</h2>
          <div className="space-y-3">
            {requiredDocuments.map((doc, index) => {
              const uploaded = documents.find((d) => d.name === doc.name);
              return (
                <div
                  key={index}
                  className="bg-card rounded-2xl border border-border p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{doc.name}</h3>
                        {doc.required && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                    </div>
                  </div>

                  {uploaded ? (
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        uploaded.status === "verified" ? "text-green-600" : ""
                      }`}
                    >
                      {getStatusIcon(uploaded.status)}
                      <span>
                        {uploaded.status === "verified"
                          ? "Document verified"
                          : uploaded.status === "pending"
                          ? "Under review"
                          : "Document rejected - resubmit required"}
                      </span>
                    </div>
                  ) : (
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-purple-300 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload Document</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className="px-6 pb-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Upload Guidelines
            </h3>
            <ul className="space-y-1 text-sm text-blue-600">
              <li>• Documents must be clear and readable</li>
              <li>• Accepted formats: PDF, JPG, PNG (max 5MB)</li>
              <li>• Ensure all information is visible</li>
              <li>• Documents must be valid and not expired</li>
              <li>• Processing time: 2-3 business days</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-xl border-t border-border p-4">
        <GradientButton fullWidth onClick={() => {}}>
          <Upload className="w-5 h-5 mr-2" />
          Upload New Document
        </GradientButton>
      </div>
    </div>
  );
}
