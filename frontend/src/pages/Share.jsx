import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Link2, Mail, QrCode } from "lucide-react";
import { Button } from "../components/ui/button";
import CopyLinkButton from "../components/CopyLinkButton";
import SecurityBadge from "../components/SecurityBadge";

export default function Share() {
  const { fileId } = useParams();
  const { state } = useLocation();
  const [showQR, setShowQR] = useState(false);

  const shareLink = `${window.location.origin}/download/${fileId}`;
  const fileName = state?.fileName ?? "uploaded-file";

  const handleEmail = () => {
    const subject = encodeURIComponent("Secure file shared via CipherSend");
    const body = encodeURIComponent(
      `I've shared a file with you securely:\n\n${shareLink}\n\nThis link will expire soon.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="space-y-8">
          {/* Success animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 200, damping: 15 }}
            className="flex justify-center"
          >
            <div className="rounded-full bg-primary/10 p-5 glow-green">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-6 text-center"
          >
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                File Uploaded Successfully!
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{fileName}</span> is
                ready to share.
              </p>
            </div>

            {/* Link display card */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3 text-left">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                Secure Share Link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 rounded-md bg-muted px-3 py-2">
                  <p className="text-xs font-mono text-muted-foreground truncate">
                    {shareLink}
                  </p>
                </div>
                <CopyLinkButton link={shareLink} />
              </div>
            </div>

            {/* Share options */}
            <div className="flex flex-wrap justify-center gap-3">
              <CopyLinkButton link={shareLink} />
              <Button
                variant="outline"
                size="sm"
                onClick={handleEmail}
                aria-label="Share via email"
              >
                <Mail className="h-4 w-4 mr-1.5" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQR((v) => !v)}
                aria-label="Toggle QR code"
              >
                <QrCode className="h-4 w-4 mr-1.5" />
                QR Code
              </Button>
            </div>

            {/* QR Code panel */}
            {showQR && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-border bg-card p-6 flex flex-col items-center gap-3"
              >
                <QrCode className="h-24 w-24 text-primary opacity-60" />
                <p className="text-xs text-muted-foreground">
                  QR Code generation requires a QR library integration.
                </p>
              </motion.div>
            )}

            {/* Security badges */}
            <div className="flex flex-wrap justify-center gap-2">
              <SecurityBadge label="AES-256 Encrypted" />
              <SecurityBadge label="SHA-256 Verified" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
