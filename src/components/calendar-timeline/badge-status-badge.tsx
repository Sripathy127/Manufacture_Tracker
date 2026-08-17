import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Batch } from "@/entities";
import { batchColorMap, batchStatusLabelMap } from "./colors-mapping";

export function BatchStatusBadge({
  status,
  className,
}: {
  status: Batch["status"];
  className?: string;
}) {
  const label = batchStatusLabelMap[status] ?? "Not started";
  const colorClass = batchColorMap[status]?.[0] ?? "";
  return (
    <Badge
      className={cn("py-1 rounded-md", colorClass, className)}
      role="status"
      aria-label={`Batch status: ${label}`}
    >
      {label}
    </Badge>
  );
}
