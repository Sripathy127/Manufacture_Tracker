import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BooleanFilterProps {
  value: boolean | null;
  onValueChange: (value: boolean | null) => void;
}

const booleanOptions = [
  { value: "true", label: "True" },
  { value: "false", label: "False" },
];

export function BooleanSingleFilter({
  value,
  onValueChange,
}: BooleanFilterProps) {
  return (
    <Select
      value={value === null ? "" : value.toString()}
      onValueChange={(val) => {
        if (val === "") {
          onValueChange(null);
        } else {
          onValueChange(val === "true");
        }
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select value" />
      </SelectTrigger>
      <SelectContent>
        {booleanOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
