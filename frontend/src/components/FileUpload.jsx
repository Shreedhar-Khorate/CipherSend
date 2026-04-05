import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Select, SelectItem } from "./ui/select";
import { Progress } from "./ui/progress";
import { cn } from "../lib/utils";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [expiry, setExpiry] = useState("24h");
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("12:00");
  const [downloadLimit, setDownloadLimit] = useState(10);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  // Get today's date in YYYY-MM-DD format for minimum date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const convertExpiryToHours = (expiryStr, date, time) => {
    switch (expiryStr) {
      case "24h":
        return 24;
      case "7d":
        return 168; // 7 * 24
      case "custom":
        if (!date || !time) {
          // Fallback to 24 hours if custom date/time not set
          return 24;
        }
        // Parse custom date and time
        const expiryDateTime = new Date(`${date}T${time}:00`);
        const now = new Date();
        const diffMs = expiryDateTime - now;
        const hours = Math.ceil(diffMs / (1000 * 60 * 60));
        // Ensure at least 1 hour and max 8760 hours (1 year)
        return Math.max(1, Math.min(hours, 8760));
      default:
        return 24;
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    // Validate custom expiry if selected
    if (expiry === "custom" && (!customDate || !customTime)) {
      alert("Please select a date and time for custom expiry");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Get API base URL from environment
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

      // Create FormData with file and options
      const formData = new FormData();
      formData.append("file", file);
      formData.append("expiry_hours", String(convertExpiryToHours(expiry, customDate, customTime)));
      formData.append("download_limit", String(downloadLimit));
      
      if (usePassword && password) {
        formData.append("password", password);
      }

      // Show progress
      setProgress(10);

      // Upload to backend
      const response = await fetch(`${apiBaseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      setProgress(75);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Upload failed");
      }

      const data = await response.json();
      setProgress(100);

      // Navigate to share page with real file_id from backend
      navigate(`/share/${data.file_id}`, {
        state: {
          fileName: file.name,
          fileSize: formatSize(file.size),
          expiry,
          downloadLimit,
          passwordProtected: usePassword,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-primary glow-green scale-[1.01] bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        )}
        aria-label="File upload dropzone"
      >
        <input {...getInputProps()} />
        <motion.div
          animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">
              {isDragActive ? "Drop your file here" : "Drag & drop your file"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
        </motion.div>
      </div>

      {/* File preview */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
              <div className="rounded-full bg-primary/10 p-2 shrink-0">
                <File className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatSize(file.size)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setUploading(false);
                  setProgress(0);
                }}
                aria-label="Remove file"
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security options */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Security Options
            </h3>

            {/* Password toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">
                Password protect
              </label>
              <Switch
                checked={usePassword}
                onCheckedChange={setUsePassword}
                aria-label="Toggle password protection"
              />
            </div>

            <AnimatePresence>
              {usePassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="File password"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expiration */}
            <div className="space-y-1.5">
              <label className="text-sm text-foreground">Expiration</label>
              <Select value={expiry} onValueChange={setExpiry}>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="custom">Custom Date & Time</SelectItem>
              </Select>
            </div>

            {/* Custom date and time picker */}
            <AnimatePresence>
              {expiry === "custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-3 pt-2"
                >
                  <div className="space-y-1.5">
                    <label className="text-sm text-foreground">
                      Expiry Date
                    </label>
                    <Input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      min={getTodayDate()}
                      aria-label="Expiry date"
                      className="focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-foreground">
                      Expiry Time
                    </label>
                    <Input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      aria-label="Expiry time"
                      className="focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {customDate && (
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                      <p className="text-xs text-foreground/80">
                        ⏱️ File will expire on <strong>{new Date(`${customDate}T${customTime}`).toLocaleString()}</strong>
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Download limit */}
            <div className="space-y-1.5">
              <label className="text-sm text-foreground">Download limit</label>
              <Input
                type="number"
                min={1}
                value={downloadLimit}
                onChange={(e) => setDownloadLimit(Number(e.target.value))}
                aria-label="Download limit"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload progress */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Encrypting &amp; uploading...
              </span>
              <span className="font-mono text-primary">{progress}%</span>
            </div>
            <Progress value={progress} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload button */}
      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full h-12 text-base glow-green"
        aria-label="Encrypt and upload file"
      >
        <Lock className="h-5 w-5 mr-2" />
        Encrypt &amp; Upload File
      </Button>
    </div>
  );
}
