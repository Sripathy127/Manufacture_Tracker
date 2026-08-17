//   return selectOptions ? (
//     <Select
//       value={value.length > 0 ? value[0] : ""}
//       onValueChange={(val) => onValueChange([val])}
//     >
//       <SelectTrigger className="w-full">
//         <SelectValue placeholder="Select value" />
//       </SelectTrigger>
//       <SelectContent>
//         {selectOptions.map((option) => (
//           <SelectItem key={option.value} value={option.value}>
//             {option.label}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Highlight } from "@/lib/highlight-text";

type SelectOption =
  string | { readonly value: string; readonly label?: string };

interface StringMultipleFilterProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  isMultiSelect?: boolean;
  selectOptions?: ReadonlyArray<SelectOption>;
}

const getValue = (o: SelectOption) => (typeof o === "string" ? o : o.value);
const getLabel = (o: SelectOption) =>
  typeof o === "string" ? o : (o.label ?? o.value);

export function StringMultipleFilter({
  value,
  onValueChange,
  selectOptions,
  isMultiSelect,
}: StringMultipleFilterProps) {
  const [inputValue, setInputValue] = useState(value.join(", "));
  const [open, setOpen] = useState(false);
  const [searchDropdownValue, setSearchDropdownValue] = useState("");

  const handleBlur = () => {
    const values = inputValue
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    onValueChange(values);
  };

  const handleToggleValue = (val: string) => {
    if (value.includes(val)) onValueChange(value.filter((v) => v !== val));
    else onValueChange([...value, val]);
  };

  const q = searchDropdownValue.trim().toLowerCase();
  const hasOptions = (selectOptions?.length ?? 0) > 0;

  const filteredOptions = useMemo(() => {
    if (!hasOptions || !selectOptions) return [];
    if (q === "") return [...selectOptions];
    return selectOptions.filter((o) => getLabel(o).toLowerCase().includes(q));
  }, [selectOptions, q, hasOptions]);

  // Multi-select with checkboxes ONLY when dropdown=true AND options exist
  if (hasOptions && isMultiSelect) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {value.length > 0 ? `${value.length} selected` : "Select values..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-2" align="start">
          <Input
            type="text"
            placeholder="Search..."
            value={searchDropdownValue}
            onChange={(e) => setSearchDropdownValue(e.target.value)}
          />

          <div className="flex flex-col gap-1 h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-2 text-sm text-neutral-500">
                No results found
              </div>
            ) : (
              filteredOptions.map((o) => {
                const v = getValue(o);
                const label = getLabel(o);

                return (
                  <label
                    key={v}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-100 cursor-pointer"
                  >
                    <Checkbox
                      checked={value.includes(v)}
                      onCheckedChange={() => handleToggleValue(v)}
                    />
                    <span className="text-sm">
                      <Highlight text={label} query={searchDropdownValue} />
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  if (hasOptions && !isMultiSelect) {
    const selected = value[0]
      ? selectOptions!.find((o) => getValue(o) === value[0])
      : undefined;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {value[0]
              ? selected
                ? getLabel(selected)
                : value[0]
              : "Select value..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2" align="start">
          <Input
            type="text"
            placeholder="Search..."
            value={searchDropdownValue}
            onChange={(e) => setSearchDropdownValue(e.target.value)}
          />
          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto mt-2">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-2 text-sm text-neutral-500">
                No results found
              </div>
            ) : (
              filteredOptions.map((o) => {
                const v = getValue(o);
                const label = getLabel(o);
                return (
                  <button
                    key={v}
                    type="button"
                    className={`text-left px-2 py-1.5 rounded-md hover:bg-neutral-100 text-sm ${
                      value[0] === v ? "bg-neutral-100" : ""
                    }`}
                    onClick={() => {
                      onValueChange([v]);
                      setOpen(false);
                    }}
                  >
                    <Highlight text={label} query={searchDropdownValue} />
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // If options exist but dropdown=false => keep input field (no dropdown)
  return (
    <Input
      type="text"
      placeholder="Enter values (comma-separated)"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
      className="w-full"
    />
  );
}
