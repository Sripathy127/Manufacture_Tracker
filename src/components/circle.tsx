import { cn } from "@/lib/utils";

export function Circle({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-full aspect-square flex items-center justify-center size-4 bg-gray-300",
        className
      )}
    >
      {children}
    </div>
  );
}
