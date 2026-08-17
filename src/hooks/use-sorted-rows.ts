import type { SortModel, SortDirection } from "@/lib/batch-sort-model-store";
import { useMemo } from "react";

function compareValues<T>(a: T, b: T, direction: SortDirection): number {
  if (a === b) return 0;

  // Handle null/undefined - always place at the end
  if (a == null) return 1;
  if (b == null) return -1;

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    const diff = a.getTime() - b.getTime();
    return direction === "asc" ? diff : -diff;
  }

  // Handle strings and numbers
  const comparison = a < b ? -1 : 1;
  return direction === "asc" ? comparison : -comparison;
}

export function useSortedRows<T>(
  rows: T[],
  sortModels: SortModel<keyof T>[]
): T[] {
  return useMemo(() => {
    if (sortModels.length === 0) return rows;

    return [...rows].sort((a, b) => {
      for (const { sortBy, sortDirection } of sortModels) {
        const comparison = compareValues(a[sortBy], b[sortBy], sortDirection);
        if (comparison !== 0) return comparison;
      }
      return 0;
    });
  }, [rows, sortModels]);
}
