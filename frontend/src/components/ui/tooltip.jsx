import { cn } from "../../lib/utils";

function TooltipProvider({ children }) {
  return children;
}

function Tooltip({ children, className }) {
  return (
    <div className={cn("relative group inline-block", className)}>
      {children}
    </div>
  );
}

function TooltipTrigger({ children }) {
  return children;
}

function TooltipContent({ children, className }) {
  return (
    <div
      className={cn(
        "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-secondary border border-border text-foreground text-xs px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
