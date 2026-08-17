import * as React from "react";
import {
  format,
  isValid,
  addDays,
  addMonths,
  startOfMonth,
  subMonths,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange, Matcher } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface RangeDatePickerProps {
  startDate?: Date;
  endDate?: Date;
  onSelect?: (range: DateRange | undefined) => void;
  className?: string;
}

const pickerStartMonth = new Date(2017, 0);

export function RangeDatePicker({
  startDate,
  endDate,
  onSelect,
  className,
}: RangeDatePickerProps) {
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    // Only set range if both dates are valid
    if (startDate && endDate && isValid(startDate) && isValid(endDate)) {
      return { from: startDate, to: endDate };
    }
    return undefined;
  });
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(
    range
  );
  const [open, setOpen] = React.useState(false);

  // Update tempRange when popover opens
  React.useEffect(() => {
    if (open) {
      setTempRange(range);
    }
  }, [open, range]);

  const handleApply = () => {
    if (tempRange?.from && tempRange?.to) {
      setRange(tempRange);
      onSelect?.(tempRange);
      setOpen(false);
    }
  };

  const handleClear = () => {
    setTempRange(undefined);
  };

  const getDisabledDates = (): Matcher[] => {
    const { from, to } = tempRange ?? {};
    const afterSixMonths: Matcher = {
      after: addMonths(startOfMonth(new Date()), 6),
    };
    let disabled: Matcher[] = [];
    if (from && !to) {
      disabled = [{ before: from }, { after: from, before: addDays(from, 5) }];
    }
    if (from && to) {
      disabled = [{ before: from }, { after: to }];
    }
    return [...disabled, afterSixMonths];
  };
  const formatDateRange = () => {
    if (range?.from) {
      if (range.to) {
        return (
          <>
            <span>{format(range.from, "MMM d")}</span>
            {" - "}
            <span>{format(range.to, "MMM d")}</span>
          </>
        );
      }
      return format(range.from, "MMM d");
    }
    return <span>Pick a date range</span>;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          data-empty={!range?.from}
          className={cn(
            "data-[empty=true]:text-muted-foreground justify-start text-left font-normal cursor-pointer",
            className
          )}
        >
          <CalendarIcon />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          min={5}
          max={365}
          selected={tempRange}
          onSelect={setTempRange}
          numberOfMonths={3}
          startMonth={pickerStartMonth}
          defaultMonth={subMonths(new Date(), 1)}
          disabled={getDisabledDates()}
        />
        <div className="flex gap-2 p-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="flex-1"
          >
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={!tempRange?.from || !tempRange?.to}
            className="flex-1 bg-btn-primary hover:bg-btn-primary-hover active:bg-btn-primary-select"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
