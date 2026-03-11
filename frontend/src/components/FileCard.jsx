import { FileText, Calendar, HardDrive, Download } from "lucide-react";
import { Button } from "./ui/button";
import SecurityBadge from "./SecurityBadge";
import { cn } from "../lib/utils";

export default function FileCard({
  fileName = "document.pdf",
  fileSize = "2.4 MB",
  uploadDate = "Just now",
  onDownload,
  className,
}) {
  return (
    <div
      className={cn(
        "gradient-card rounded-xl border border-border p-5 space-y-4 transition-all duration-200 hover:border-primary/30 hover:glow-green",
        className
      )}
    >
      {/* File header */}
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{fileName}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <HardDrive className="h-3 w-3" />
              {fileSize}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {uploadDate}
            </span>
          </div>
        </div>
      </div>

      {/* Security badge */}
      <SecurityBadge />

      {/* Download button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={onDownload}
        aria-label={`Download ${fileName}`}
      >
        <Download className="h-4 w-4 mr-2" />
        Download File
      </Button>
    </div>
  );
}
