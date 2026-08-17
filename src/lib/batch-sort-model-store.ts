import type { Batch } from "@/entities";

export const BATCH_SORT_MODEL_STORAGE_KEY = "__batch_sort_model_v1";

export type SortDirection = "asc" | "desc";

export type SortModel<T> = {
  sortBy: T;
  sortDirection: SortDirection;
};

export type BatchSortableFields = keyof Batch;

export type BatchSortModel = SortModel<BatchSortableFields>[];

export function getBatchSortModelFromStorage(): BatchSortModel {
  const sortModelJSON: string | null =
    localStorage.getItem(BATCH_SORT_MODEL_STORAGE_KEY) ?? null;
  if (sortModelJSON) {
    try {
      const parsed: BatchSortModel = JSON.parse(sortModelJSON);
      return parsed;
    } catch (error) {
      console.log("Error parsing sort model from localStorage", error);
    }
  }
  return [];
}

export function setBatchSortModelToStorage(model: BatchSortModel): void {
  try {
    const modelJSON = JSON.stringify(model);
    localStorage.setItem(BATCH_SORT_MODEL_STORAGE_KEY, modelJSON);
  } catch (error) {
    console.log("Error saving sort model to localStorage", error);
  }
}
