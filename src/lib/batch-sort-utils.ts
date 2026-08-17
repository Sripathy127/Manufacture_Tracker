import type {
  BatchSortModel,
  BatchSortableFields,
  SortDirection,
} from "./batch-sort-model-store";

export function updateSortModel(
  current: BatchSortModel,
  sortBy: BatchSortableFields,
  value: string,
  shiftKey = false
): BatchSortModel {
  const existingIndex = current.findIndex((s) => s.sortBy === sortBy);

  // If value is empty (untoggled), remove the sort
  if (!value) {
    return current.filter((s) => s.sortBy !== sortBy);
  }

  const sortDirection = value as SortDirection;

  // If field already exists, update it in place (preserve position and other sorts)
  if (existingIndex >= 0) {
    return current.map((s) =>
      s.sortBy === sortBy ? { sortBy, sortDirection } : s
    );
  }

  // If shift key not pressed and adding a NEW field, replace all sorts
  if (!shiftKey) {
    return [{ sortBy, sortDirection }];
  }

  // Otherwise add new sort at the end (shift key pressed, new field)
  return [...current, { sortBy, sortDirection }];
}

export function getSortDirection(
  sortModel: BatchSortModel,
  sortBy: BatchSortableFields
): SortDirection | undefined {
  const sort = sortModel.find((s) => s.sortBy === sortBy);
  return sort?.sortDirection;
}

export function getSortPosition(
  sortModel: BatchSortModel,
  sortBy: BatchSortableFields
): number | null {
  // Don't show position if there's only one sort model
  if (sortModel.length <= 1) {
    return null;
  }

  const index = sortModel.findIndex((s) => s.sortBy === sortBy);
  return index >= 0 ? index + 1 : null;
}
