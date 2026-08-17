import { Input } from "@/components/ui/input";

interface NumberSingleFilterProps {
  value: number | null;
  onValueChange: (value: number | null) => void;
}

export function NumberSingleFilter({
  value,
  onValueChange,
}: NumberSingleFilterProps) {
  return (
    <Input
      type="number"
      placeholder="Enter value"
      value={value ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        if (val === "" || val === null) {
          onValueChange(null);
        } else {
          const numVal = parseFloat(val);
          onValueChange(isNaN(numVal) ? null : numVal);
        }
      }}
      className="w-full"
    />
  );
}
