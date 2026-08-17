import type { Batch } from "@/entities";

export type FilterPred<T> = (item: T) => boolean;

export function combineFilters<T>(
  filters: Array<FilterPred<T>>
): FilterPred<T> {
  if (filters.length === 0) return () => true;

  return (item: T) => {
    for (let i = 0; i < filters.length; i++) {
      if (!filters[i](item)) return false;
    }
    return true;
  };
}

// Aggregation function for status counts
export function aggregateBatchesByStatus(
  batches: Batch[]
): Record<string, number> {
  return batches.reduce(
    (acc, batch) => {
      acc[batch.status] = (acc[batch.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

// Aggregation function for flag counts
export function aggregateBatchesByFlags(
  batches: Batch[]
): Record<string, number> {
  return batches.reduce(
    (acc, batch) => {
      if (batch.etsEscalation === "T")
        acc["escalated"] = (acc["escalated"] || 0) + 1;
      if (batch.overdue === "T") acc["overdue"] = (acc["overdue"] || 0) + 1;
      if (batch.notStarted === "T")
        acc["notStarted"] = (acc["notStarted"] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}
