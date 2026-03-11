import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, HardDrive, Calendar, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import SecurityBadge from "../components/SecurityBadge";

// Simulated file metadata (replace with real API call)
const mockFile = {
  name: "document.pdf",
  size: "2.4 MB",
  uploadDate: "Mar 11, 2026",
};

export default function Download() {
  const { fileId } = useParams();
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleDownload = async () => {
    setVerifying(true);
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 2200));
    setVerifying(false);
    setVerified(true);

    // Simulate file download trigger
    setTimeout(() => {
      const blob = new Blob(["[Encrypted file content — replace with real API]"], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = mockFile.name;
      a.click();
      URL.revokeObjectURL(url);
    }, 300);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
          {/* File info header */}
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-primary/10 p-3 shrink-0">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">{mockFile.name}</h1>
              <div className="mt-1.5 flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <HardDrive className="h-3 w-3" />
                  {mockFile.size}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {mockFile.uploadDate}
                </span>
              </div>
            </div>
          </div>

          <SecurityBadge />

          {/* Password input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Lock className="h-4 w-4 text-primary" />
              Enter password to decrypt
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password (if required)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Decryption password"
            />
          </div>

          {/* Download button */}
          <Button
            className="w-full h-11 glow-green"
            onClick={handleDownload}
            disabled={verifying || verified}
            aria-label="Decrypt and download file"
          >
            {verifying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying integrity...
              </>
            ) : (
              "Decrypt & Download"
            )}
          </Button>

          {/* Verification result */}
          <AnimatePresence>
            {verified && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                File verified using SHA-256 · Integrity confirmed
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
