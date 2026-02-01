import { cn } from "@/lib/utils";

export function NavShortcut({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "ms-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
