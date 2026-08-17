import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { batchStatus } from "@/entities";
import { Circle } from "@/components/circle";
import { batchColorMap } from "./colors-mapping";
import { cn } from "@/lib/utils";
import { TypographyH2, TypographyH5 } from "../ui/typography";
import { batchStatusLabelMap } from "@/components/calendar-timeline/colors-mapping";
import { useBatchAllFilterModel } from "@/hooks/use-batch-all-filter-model";

export function StatusFilter({
  counts,
  className,
}: {
  counts: Record<string, number>;
  className?: string;
}) {
  const { filterModel, setFilter } = useBatchAllFilterModel();

  // Extract value from filter
  const value =
    filterModel.status?.operator === "isIn" &&
    Array.isArray(filterModel.status.value)
      ? filterModel.status.value
      : [];

  // Handler to update filter
  const handleValueChange = (statuses: string[]) => {
    if (statuses.length > 0) {
      setFilter("status", { operator: "isIn", value: statuses });
    } else {
      setFilter("status", null);
    }
  };

  return (
    <ToggleGroup
      type="multiple"
      value={value}
      onValueChange={handleValueChange}
      spacing={2}
      className={cn("flex gap-3", className)}
    >
      <TypographyH2 className="text-sm text-gray-600 mr-19">
        Status:
      </TypographyH2>
      {batchStatus.map((status) => (
        <ToggleGroupItem
          key={status}
          value={status}
          className="data-[state=on]:bg-orange-20 border border-orange-100 cursor-pointer flex pl-4 pr-8 gap-2 items-center w-[200px]"
          aria-label={`Filter by ${batchStatusLabelMap[status]} status: ${counts[status] || 0} batches`}
        >
          <Circle className={cn("size-[18px] ", batchColorMap[status][1])}>
            <Circle className={cn("size-3", batchColorMap[status][0])} />
          </Circle>
          <TypographyH5 className="text-sm">
            {counts[status] || 0} {batchStatusLabelMap[status]}
          </TypographyH5>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
