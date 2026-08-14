import { useState } from "react";
import { useDebounce } from "use-debounce";
import type { DropdownItem } from "../components/searchable-dropdown";

// Reusable hook for dropdown state and logic
export function useDropdownLogic(
  items: DropdownItem[],
  initialSelections?: string[],
  onChange?: (selectedIds: string[]) => void,
  resetOnChange?: () => void
) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelections ?? []
  );

  const [isActive, setIsActive] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchTerm, 400);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase?.().includes(debouncedSearch.toLowerCase()) ||
      item.id.toLowerCase?.().includes(debouncedSearch.toLowerCase()) ||
      item.subtitle?.toLowerCase?.().includes(debouncedSearch.toLowerCase())
  );

  const toggleItem = (itemId: string) => {
    const newSelectedIds = selectedIds.includes(itemId)
      ? selectedIds.filter((id) => id !== itemId)
      : [...selectedIds, itemId];

    setSelectedIds(newSelectedIds);
    onChange?.(newSelectedIds);
    resetOnChange?.();
  };

  const toggleAll = () => {
    const newSelectedIds =
      selectedIds.length === filteredItems.length
        ? []
        : filteredItems.map((item) => item.id);

    setSelectedIds(newSelectedIds);
    onChange?.(newSelectedIds);
    resetOnChange?.();
  };

  const reset = () => {
    setSelectedIds([]);
  };

  const closeDropdown = () => {
    setIsActive(false);
  };
  return {
    selectedIds,
    isActive,
    setIsActive,
    searchTerm,
    setSearchTerm,
    filteredItems,
    toggleItem,
    toggleAll,
    reset,
    closeDropdown,
  };
}
