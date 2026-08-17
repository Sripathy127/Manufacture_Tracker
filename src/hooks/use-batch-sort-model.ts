import useLocalStorageState from "use-local-storage-state";
import {
  BATCH_SORT_MODEL_STORAGE_KEY,
  type BatchSortModel,
  type BatchSortableFields,
  type SortDirection,
  getBatchSortModelFromStorage,
} from "@/lib/batch-sort-model-store";

export function useBatchSortModel() {
  const [sortModel, setSortModel] = useLocalStorageState<BatchSortModel>(
    BATCH_SORT_MODEL_STORAGE_KEY,
    {
      defaultValue: getBatchSortModelFromStorage(),
    }
  );

  const addSortModel = (
    sortBy: BatchSortableFields,
    sortDirection: SortDirection = "asc"
  ) => {
    setSortModel((current) => [
      ...current.filter((s) => s.sortBy !== sortBy),
      { sortBy, sortDirection },
    ]);
  };

  const removeSortModel = (sortBy: BatchSortableFields) => {
    setSortModel((current) => current.filter((s) => s.sortBy !== sortBy));
  };

  const clearSortModel = () => {
    setSortModel([]);
  };

  const toggleSortDirection = (sortBy: BatchSortableFields) => {
    setSortModel((current) => {
      const existing = current.find((s) => s.sortBy === sortBy);
      if (!existing) {
        return [...current, { sortBy, sortDirection: "asc" }];
      }
      return current.map((s) =>
        s.sortBy === sortBy
          ? { ...s, sortDirection: s.sortDirection === "asc" ? "desc" : "asc" }
          : s
      );
    });
  };

  return {
    sortModel,
    setSortModel,
    addSortModel,
    removeSortModel,
    clearSortModel,
    toggleSortDirection,
  };
}
