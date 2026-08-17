import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Calendar } from "lucide-react";

export function TimelineEmptyState({
  Title,
  Description,
}: {
  Title?: string;
  Description?: string;
}) {
  return (
    <Empty className="border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Calendar />
        </EmptyMedia>
        <EmptyTitle>{Title ?? "No batches found"}</EmptyTitle>
        <EmptyDescription>
          {Description ??
            "No batches match your current filter criteria. Try adjusting your filters."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
