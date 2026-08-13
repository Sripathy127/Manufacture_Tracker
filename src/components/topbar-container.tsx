import { cn } from "@/lib/utils";

export function TopbarContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full sticky bg-white top-0 border-b z-40 p-2",
        className
      )}
    >
      {children}
    </div>
  );
}
