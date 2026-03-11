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

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      setProgress(i);
    }

    const fileId = Math.random().toString(36).substring(2, 11);
    navigate(`/share/${fileId}`, {
      state: {
        fileName: file.name,
        fileSize: formatSize(file.size),
        expiry,
        downloadLimit,
        passwordProtected: usePassword,
      },
    });
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
                <SelectItem value="custom">Custom</SelectItem>
              </Select>
            </div>

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
