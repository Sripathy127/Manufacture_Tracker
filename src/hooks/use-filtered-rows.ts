import {
  combineFilters,
  type FilterPred,
} from "@/lib/calendar-timeline/filter-utils";
import { useMemo } from "react";

export function useFilteredRows<T>(
  rows: T[],
  activeFilters: Array<FilterPred<T>>
) {
  const combined = useMemo(
    () => combineFilters(activeFilters),
    [activeFilters]
  );

  return useMemo(() => rows.filter(combined), [rows, combined]);
}
