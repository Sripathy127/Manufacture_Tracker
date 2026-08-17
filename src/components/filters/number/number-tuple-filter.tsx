import { Input } from "@/components/ui/input";

interface NumberTupleFilterProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
}

export function NumberTupleFilter({
  value,
  onValueChange,
}: NumberTupleFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="Min"
        value={value[0]}
        onChange={(e) => {
          const min = parseFloat(e.target.value) || 0;
          onValueChange([min, value[1]]);
        }}
        className="flex-1"
      />
      <span className="text-muted-foreground">-</span>
      <Input
        type="number"
        placeholder="Max"
        value={value[1]}
        onChange={(e) => {
          const max = parseFloat(e.target.value) || 0;
          onValueChange([value[0], max]);
        }}
        className="flex-1"
      />
    </div>
  );
}
