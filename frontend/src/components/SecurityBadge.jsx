import { Shield } from "lucide-react";
import { cn } from "../lib/utils";

export default function SecurityBadge({ label = "AES-256 Encrypted", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary",
        className
      )}
      aria-label={label}
    >
      <Shield className="h-3 w-3" />
      {label}
    </span>
  );
}
