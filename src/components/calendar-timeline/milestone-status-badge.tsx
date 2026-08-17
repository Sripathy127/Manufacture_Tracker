import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BatchMilestoneStatus } from "@/entities";
import { milestoneColorMap, milestoneStatusLabelMap } from "./colors-mapping";

export function MilestoneStatusBadge({
  status,
  className,
}: {
  status: BatchMilestoneStatus;
  className?: string;
}) {
  const label = milestoneStatusLabelMap[status] ?? "Unknown";
  const colorClass = milestoneColorMap[status]?.[0] ?? "";
  return (
    <Badge
      className={cn("py-0.5 rounded-md", colorClass, className)}
      role="status"
      aria-label={`Milestone status: ${label}`}
    >
      {label}
    </Badge>
  );
}
