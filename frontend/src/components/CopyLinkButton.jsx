import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";

export default function CopyLinkButton({ link }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      aria-label={copied ? "Link copied" : "Copy link to clipboard"}
      className="shrink-0"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-1.5 text-primary" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-1.5" />
          Copy
        </>
      )}
    </Button>
  );
}
