import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OperatorOption {
  value: string;
  label: string;
}

interface OperatorSelectorProps {
  operator: string;
  operators: readonly OperatorOption[];
  onOperatorChange: (operator: string) => void;
}

export function OperatorSelector({
  operator,
  operators,
  onOperatorChange,
}: OperatorSelectorProps) {
  return (
    <Select value={operator} onValueChange={onOperatorChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {operators.map((op) => (
          <SelectItem key={op.value} value={op.value}>
            {op.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
