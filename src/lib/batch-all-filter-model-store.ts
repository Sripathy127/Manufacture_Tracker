import type { BatchAllFilterModel } from "./filter-model/config";

export const BATCH_ALL_FILTER_MODEL_STORAGE_KEY = "__batch_all_filter_model_v1";

export function getBatchAllFilterModelFromStorage(): BatchAllFilterModel {
  const filterModelJSON = localStorage.getItem(
    BATCH_ALL_FILTER_MODEL_STORAGE_KEY
  );

  if (!filterModelJSON) {
    return {};
  }

  try {
    return JSON.parse(filterModelJSON, (_key, value) => {
      // Revive Date objects during parse
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    console.error("Error parsing batch filter model from localStorage:", error);
    return {};
  }
}

export function setBatchAllFilterModelToStorage(
  model: BatchAllFilterModel
): void {
  localStorage.setItem(
    BATCH_ALL_FILTER_MODEL_STORAGE_KEY,
    JSON.stringify(model)
  );
}
