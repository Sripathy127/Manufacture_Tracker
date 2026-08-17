import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StringSingleFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  selectOptions?: ReadonlyArray<{
    readonly value: string;
    readonly label: string;
  }>;
}

export function StringSingleFilter({
  value,
  onValueChange,
  selectOptions,
}: StringSingleFilterProps) {
  return selectOptions ? (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select value" />
      </SelectTrigger>
      <SelectContent>
        {selectOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <Input
      type="text"
      placeholder="Enter value"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full"
    />
  );
}
