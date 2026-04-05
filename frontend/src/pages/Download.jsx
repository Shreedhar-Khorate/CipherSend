import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, HardDrive, Calendar, Lock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import SecurityBadge from "../components/SecurityBadge";

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / (1024 ** 2)).toFixed(1)} MB`;
  return `${(bytes / (1024 ** 3)).toFixed(1)} GB`;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeRemaining(expiryTime) {
  const expiry = new Date(expiryTime);
  const now = new Date();
  const diffMs = expiry - now;
  
  if (diffMs <= 0) {
    return { expired: true, text: "Expired" };
  }
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return { expired: false, text: `${days}d remaining` };
  }
  
  if (hours > 0) {
    return { expired: false, text: `${hours}h ${minutes}m remaining` };
  }
  
  return { expired: false, text: `${minutes}m remaining` };
}

export default function Download() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [verified, setVerified] = useState(false);

  // Fetch file metadata on load
  useEffect(() => {
    const fetchFileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
        const response = await fetch(`${apiBaseUrl}/files/${fileId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("File not found");
          } else if (response.status === 410) {
            throw new Error("File has expired");
          } else if (response.status === 403) {
            throw new Error("Download limit reached");
          }
          throw new Error("Failed to fetch file information");
        }

        const data = await response.json();
        setFileData(data);
        
        // Check if file is expired or limit reached immediately
        const expiryDate = new Date(data.expiry_time);
        const now = new Date();
        
        if (now > expiryDate) {
          setError("File has expired");
          setFileData(null);
          return;
        }
        
        if (data.downloads >= data.download_limit) {
          setError("Download limit reached");
          setFileData(null);
          return;
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFileData();
  }, [fileId]);

  const handleDownload = async () => {
    if (!fileData) return;
    
    setDownloading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
      
      const headers = {
        "X-File-Password": password || "",
      };

      const response = await fetch(`${apiBaseUrl}/download/${fileId}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error("Incorrect password");
        } else if (response.status === 403) {
          throw new Error("Download limit reached");
        } else if (response.status === 410) {
          throw new Error("File has expired");
        }
        throw new Error(error.detail || "Download failed");
      }

      setDownloading(false);
      setVerified(true);

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("content-disposition");
      let filename = fileData.file_name;
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      // Download the file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert(`Download failed: ${err.message}`);
      setDownloading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading file information...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold">{error}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {error === "File not found"
                ? "The file you're looking for doesn't exist."
                : error === "File has expired"
                ? "This file has expired and is no longer available."
                : error === "Download limit reached"
                ? "This file has reached its maximum download limit."
                : "Unable to retrieve file information."}
            </p>
          </div>
          <Button onClick={() => navigate("/")} variant="outline">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // Show download page
  if (!fileData) return null;

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
              <h1 className="text-lg font-bold">{fileData.file_name}</h1>
              <div className="mt-1.5 flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <HardDrive className="h-3 w-3" />
                  {formatFileSize(fileData.file_size)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(fileData.expiry_time)}
                </span>
              </div>
            </div>
          </div>

          <SecurityBadge />

          {/* Download stats */}
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>Downloads: {fileData.downloads}/{fileData.download_limit}</p>
            <p>Downloads remaining: {fileData.download_limit - fileData.downloads}</p>
            <p>Expires: {formatDate(fileData.expiry_time)}</p>
            <p className={getTimeRemaining(fileData.expiry_time).expired ? "text-destructive font-semibold" : "text-primary font-semibold"}>
              ⏱️ {getTimeRemaining(fileData.expiry_time).text}
            </p>
          </div>

          {/* Warning if about to exceed limit */}
          {fileData.download_limit - fileData.downloads === 1 && (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-700 dark:text-yellow-400">
              ⚠️ This is the last download available for this file
            </div>
          )}

          {/* Warning if expiring soon */}
          {(() => {
            const hours = Math.floor((new Date(fileData.expiry_time) - new Date()) / (1000 * 60 * 60));
            return hours > 0 && hours < 2 ? (
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-700 dark:text-yellow-400">
                ⚠️ File will expire in less than 2 hours
              </div>
            ) : null;
          })()}

          {/* Password input - only show if password protected */}
          {fileData.password_protected && (
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
                placeholder="Password required"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Decryption password"
              />
            </div>
          )}

          {/* Download button */}
          <Button
            className="w-full h-11 glow-green"
            onClick={handleDownload}
            disabled={
              downloading || 
              verified || 
              (fileData.password_protected && !password) ||
              getTimeRemaining(fileData.expiry_time).expired ||
              fileData.downloads >= fileData.download_limit
            }
            aria-label="Decrypt and download file"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying integrity...
              </>
            ) : getTimeRemaining(fileData.expiry_time).expired ? (
              "File has expired"
            ) : fileData.downloads >= fileData.download_limit ? (
              "Download limit reached"
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
