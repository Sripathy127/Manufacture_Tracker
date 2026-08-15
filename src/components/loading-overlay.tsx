import { useEffect, useState } from "react";
import { Spinner } from "@/components/dot-spinner";
import { cn } from "@/lib/utils";

export function LoadingOverlay({
  delay = 0,
  className,
}: {
  delay?: number;
  className?: string;
}) {
  const [shouldShow, setShouldShow] = useState(delay === 0);

  useEffect(() => {
    if (delay == 0) return;
    const timer = setTimeout(() => {
      setShouldShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute inset-0 bg-black/30 flex items-center justify-center z-300",
        className
      )}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-4">
        <Spinner />
        <span className="text-lg font-medium">Loading...</span>
      </div>
    </div>
  );
}
