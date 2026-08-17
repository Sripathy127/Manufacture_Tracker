import { Search, X } from "lucide-react";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBatchAllFilterModel } from "@/hooks/use-batch-all-filter-model";

export function NameFilter({
  isActive,
  setIsActive,
  searchValue,
  setSearchValue,
}: {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}) {
  const { setFilter } = useBatchAllFilterModel();

  const [debouncedSearch] = useDebounce(searchValue, 250);

  useEffect(() => {
    if (debouncedSearch) {
      setFilter("batch", { operator: "contains", value: debouncedSearch });
    } else {
      setFilter("batch", null);
    }
  }, [debouncedSearch, setFilter]);

  const handleClear = () => {
    setSearchValue("");
    setIsActive(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (searchValue.trim()) {
        setSearchValue("");
      } else {
        setIsActive(false);
      }
    } else if (e.key === "Enter") {
      e.currentTarget.blur();
      if (!searchValue.trim()) {
        setIsActive(false);
      }
    }
  };

  if (!isActive) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsActive(true)}
        className="flex-1 justify-start gap-2 min-w-39"
        aria-label="Open batch name search"
      >
        <Search className="size-4 text-orange-500" />
        <span className="text-orange-500">Search</span>
      </Button>
    );
  }

  return (
    <div className="relative flex items-center flex-1 max-w-39">
      <Search
        className="absolute left-2 size-4 text-orange-500 pointer-events-none"
        aria-hidden="true"
      />
      <Input
        autoFocus
        type="text"
        placeholder="start typing ..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="px-8 text-sm "
        aria-label="Search batch names"
      />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleClear}
        className="absolute right-1 size-7"
        aria-label="Clear search"
      >
        <X className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
