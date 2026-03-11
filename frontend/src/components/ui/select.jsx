import { cn } from "../../lib/utils";

function Select({ value, onValueChange, children, className, ...props }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(
        "flex h-10 w-full appearance-none rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

function SelectItem({ value, children }) {
  return (
    <option value={value} className="bg-card text-foreground">
      {children}
    </option>
  );
}

export { Select, SelectItem };
