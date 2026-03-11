import { cn } from "../../lib/utils";
import { X } from "lucide-react";

function Toast({ id, title, description, variant = "default", onDismiss }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all",
        variant === "destructive"
          ? "border-destructive/50 bg-destructive text-destructive-foreground"
          : "border-border bg-card text-foreground"
      )}
      role="alert"
    >
      <div className="flex-1 space-y-1">
        {title && <p className="text-sm font-semibold leading-snug">{title}</p>}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export { Toast };
