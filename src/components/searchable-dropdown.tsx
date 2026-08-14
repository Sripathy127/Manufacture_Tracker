import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { TypographyBody1, TypographyH2 } from "@/components/ui/typography";
import { SearchIcon } from "@/assets/Icons";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CloseIcon } from "@/assets/Icons";
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { useDropdownLogic } from "@/hooks/useDropdownLogic";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect } from "react";

export type DropdownItem = {
  id: string;
  name: string;
  subtitle?: string;
  tertiary?: string;
};

type DropdownConfig = {
  items: DropdownItem[];
  title: string;
  placeholder: string;
  loading?: boolean;
  emptyMessage?: string;
  initialSelections?: string[];
  onChange?: (selectedIds: string[]) => void;
};

type SearchableDropdownProps = {
  firstDropdown: DropdownConfig;
  secondDropdown: DropdownConfig;
  onSubmit: (selections: {
    firstDropdown: string[];
    secondDropdown: string[];
  }) => void;
  isSubmitting: boolean;
  autoFocus?: boolean;
  className?: string;
};

interface DropdownState {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

// Reusable dropdown header component
type DropdownHeaderProps = {
  title: string;
  placeholder: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isActive: boolean;
  onToggle: (focus?: boolean) => void;
  titleClassName?: string;
  // New props for selected items display
  selectedIds: string[];
  allItems: DropdownItem[];
  autoFocus?: boolean;
};

const stopEvents = {
  onPointerDown: (e: React.SyntheticEvent) => e.stopPropagation(),
  onFocus: (e: React.SyntheticEvent) => e.stopPropagation(),
};

const handleKeyDown = (e: React.KeyboardEvent, action?: () => void) => {
  if (e.key === "Enter") {
    e.preventDefault();
    action?.();
  }
};

function DropdownHeader({
  title,
  placeholder,
  searchTerm,
  onSearchChange,
  isActive,
  onToggle,
  titleClassName = "font-medium",
  selectedIds,
  allItems,
  autoFocus,
}: DropdownHeaderProps) {
  // Helper function to generate display value when collapsed
  const getDisplayValue = () => {
    if (isActive) {
      return searchTerm;
    }

    if (selectedIds.length === 0) {
      return "";
    }

    // Find the first selected item
    const firstSelectedItem = allItems.find(
      (item) => item.id === selectedIds[0]
    );
    const firstName = firstSelectedItem?.name || selectedIds[0];

    if (selectedIds.length === 1) {
      return firstName;
    }

    return `${firstName} + ${selectedIds.length - 1}`;
  };

  const displayValue = getDisplayValue();
  const shouldShowPlaceholder = isActive || selectedIds.length === 0;

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex-1">
        <TypographyH2 className={titleClassName}>{title}</TypographyH2>
        <div className="flex flex-row items-center">
          <Input
            placeholder={shouldShowPlaceholder ? placeholder : ""}
            value={displayValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 focus-visible:border-0 font-gotham text-xl w-full"
            readOnly={!isActive && selectedIds.length > 0}
            onClick={() => onToggle(true)}
            {...stopEvents}
            onKeyDown={(e) => handleKeyDown(e, () => onToggle())}
            autoFocus={autoFocus}
            aria-label={`Search ${title.toLowerCase()}`}
            aria-expanded={isActive}
            role="combobox"
            aria-controls={`${title.toLowerCase()}-listbox`}
          />
          {displayValue.length > 0 && isActive && (
            <button
              type="button"
              className="p-2 mr-2 cursor-pointer bg-transparent border-0"
              onClick={() => onSearchChange("")}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, () => onSearchChange(""))}
              {...stopEvents}
              aria-label="Clear search"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        className="cursor-pointer bg-transparent border-0"
        onClick={() => onToggle()}
        aria-label={
          isActive
            ? `Collapse ${title.toLowerCase()} dropdown`
            : `Expand ${title.toLowerCase()} dropdown`
        }
        aria-expanded={isActive}
        {...stopEvents}
      >
        {!isActive ? <ChevronDown /> : <ChevronUp />}
      </button>
    </div>
  );
}

// Virtualized list component for large datasets
function VirtualizedList({
  items,
  selectedIds,
  onToggleItem,
  listclassName,
}: {
  items: DropdownItem[];
  selectedIds: string[];
  onToggleItem: (itemId: string) => void;
  listclassName?: string;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // Estimated height of each item in pixels
    overscan: 10, // Render 10 extra items above/below viewport
  });
  useEffect(() => {
    rowVirtualizer.measure();
    rowVirtualizer.scrollToOffset(0, { align: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  return (
    <div
      ref={parentRef}
      className={cn("overflow-y-auto", listclassName)}
      style={{ maxHeight: "300px" }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          return (
            <div
              key={item.id}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className={cn(
                "p-3 hover:bg-orange-60 border-b border-border-interactive absolute top-0 left-0 w-full",
                selectedIds.includes(item.id) ? "bg-sky-40" : "bg-white"
              )}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <label className="flex items-center gap-2 rounded cursor-pointer">
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={() => onToggleItem(item.id)}
                  className="border-border-interactive data-[state=checked]:bg-surface-primary data-[state=checked]:border-surface-primary"
                />
                <div className="flex flex-col">
                  <TypographyH2 className="text-sm">{item.name}</TypographyH2>
                  {item.subtitle && (
                    <TypographyBody1 className="text-sm">
                      {item.subtitle}
                    </TypographyBody1>
                  )}
                  {item.tertiary && (
                    <TypographyBody1 className="text-sm">
                      {item.tertiary}
                    </TypographyBody1>
                  )}
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Reusable dropdown list component
type DropdownListProps = {
  isActive: boolean;
  items: DropdownItem[];
  selectedIds: string[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  listclassName?: string;
  onToggleItem: (itemId: string) => void;
  onToggleAll: () => void;
  onClose: () => void;
  title?: string;
};

function DropdownList({
  isActive,
  items,
  selectedIds,
  loading = false,
  emptyMessage = "No items available",
  onToggleItem,
  onToggleAll,
  onClose,
  className,
  listclassName,
  title = "",
}: DropdownListProps) {
  if (!isActive) return null;

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <DismissableLayer
      onDismiss={onClose}
      onEscapeKeyDown={onClose}
      onPointerDownOutside={onClose}
    >
      <div
        role="listbox"
        id={`${title.toLowerCase()}-listbox`}
        className={cn(
          " top-full left-0 w-full z-9999 border rounded-lg bg-white  min-h-[200px] max-h-[400px] overflow-hidden shadow-dropdown transform transition-all duration-200 ease-out animate-in slide-in-from-top-2 fade-in-0 mb-4",
          loading ? "opacity-50 pointer-events-none" : "",
          isActive ? "scale-100 opacity-100" : "scale-95 opacity-0",
          className
        )}
        style={{
          transformOrigin: "top center",
        }}
        aria-label={`${title} options`}
      >
        <div
          className={cn(
            "p-3 hover:bg-sky-60",
            isAllSelected ? "bg-sky-40" : "bg-white"
          )}
        >
          <label className="flex items-center gap-2 rounded cursor-pointer">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onToggleAll}
              className="border-border-interactive data-[state=checked]:bg-surface-primary data-[state=checked]:border-surface-primary"
            />
            <span className="text-sm cursor-pointer" onClick={onToggleAll}>
              Select all
            </span>
          </label>
        </div>
        <Separator />
        {loading ? (
          <div className="text-sm text-center py-4">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-center py-4">{emptyMessage}</div>
        ) : (
          <VirtualizedList
            items={items}
            selectedIds={selectedIds}
            onToggleItem={onToggleItem}
            listclassName={listclassName}
          />
        )}
      </div>
    </DismissableLayer>
  );
}

export function SearchableDropdown({
  firstDropdown,
  secondDropdown,
  onSubmit,
  isSubmitting,
  autoFocus,
  className,
}: SearchableDropdownProps) {
  // Use the custom hook for each dropdown
  const secondDropdownState = useDropdownLogic(
    secondDropdown.items,
    secondDropdown.initialSelections,
    secondDropdown.onChange
  );

  const firstDropdownState = useDropdownLogic(
    firstDropdown.items,
    firstDropdown.initialSelections,
    firstDropdown.onChange,
    () => secondDropdownState.reset() // Reset second dropdown when first changes
  );

  const handleSubmit = () => {
    onSubmit({
      firstDropdown: firstDropdownState.selectedIds,
      secondDropdown: secondDropdownState.selectedIds,
    });
  };

  const handleToggle = (dropdownState: DropdownState, focus: boolean) => {
    if (focus) {
      dropdownState.setIsActive(true);
    } else {
      dropdownState.setIsActive(!dropdownState.isActive);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="grid shadow-layered grid-cols-[1fr_auto_1fr_auto] gap-4 bg-bg-primary py-2 pl-8 pr-3 rounded-2xl items-center justify-center border border-neutral-lighter-gray">
        <DropdownHeader
          title={firstDropdown.title}
          placeholder={firstDropdown.placeholder}
          searchTerm={firstDropdownState.searchTerm}
          onSearchChange={firstDropdownState.setSearchTerm}
          isActive={firstDropdownState.isActive}
          onToggle={(focus) => handleToggle(firstDropdownState, focus ?? false)}
          selectedIds={firstDropdownState.selectedIds}
          allItems={firstDropdown.items}
          autoFocus={autoFocus}
        />
        <Separator orientation="vertical" />
        <DropdownHeader
          title={secondDropdown.title}
          placeholder={secondDropdown.placeholder}
          searchTerm={secondDropdownState.searchTerm}
          onSearchChange={secondDropdownState.setSearchTerm}
          isActive={secondDropdownState.isActive}
          onToggle={(focus) =>
            handleToggle(secondDropdownState, focus ?? false)
          }
          titleClassName="text-black"
          selectedIds={secondDropdownState.selectedIds}
          allItems={secondDropdown.items}
        />
        <button
          className="items-center justify-center p-3 rounded-xl cursor-pointer bg-btn-primary hover:bg-btn-primary-hover active:bg-btn-primary-select"
          onClick={handleSubmit}
          disabled={isSubmitting}
          aria-label="Submit search"
        >
          <SearchIcon />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 items-start mt-2 z-9999">
        <div className="relative">
          <DropdownList
            isActive={firstDropdownState.isActive}
            items={firstDropdownState.filteredItems}
            selectedIds={firstDropdownState.selectedIds}
            onToggleItem={firstDropdownState.toggleItem}
            onToggleAll={firstDropdownState.toggleAll}
            onClose={firstDropdownState.closeDropdown}
            className={className}
            listclassName={"max-h-[350px] "}
            title={firstDropdown.title}
          />
        </div>
        <div className="relative">
          <DropdownList
            isActive={secondDropdownState.isActive}
            items={secondDropdownState.filteredItems}
            selectedIds={secondDropdownState.selectedIds}
            loading={secondDropdown.loading}
            emptyMessage={
              secondDropdown.emptyMessage ||
              "Select items from the first dropdown to view options"
            }
            onToggleItem={secondDropdownState.toggleItem}
            onToggleAll={secondDropdownState.toggleAll}
            onClose={secondDropdownState.closeDropdown}
            className={className}
            listclassName={"max-h-[300px] "}
            title={secondDropdown.title}
          />
        </div>
      </div>
    </div>
  );
}
