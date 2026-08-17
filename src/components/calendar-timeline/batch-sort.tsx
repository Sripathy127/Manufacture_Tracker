import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { batchSummaryKeyLabelMap } from "./drawer-key-mapping";
import { ScrollArea } from "../ui/scroll-area";
import { TypographyBody1, TypographyBody2 } from "../ui/typography";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import {
  updateSortModel,
  getSortDirection,
  getSortPosition,
} from "@/lib/batch-sort-utils";
import type {
  BatchSortableFields,
  BatchSortModel,
} from "@/lib/batch-sort-model-store";

type SortBatchesProps = {
  sortModel: BatchSortModel;
  setSortModel: (
    model: BatchSortModel | ((prev: BatchSortModel) => BatchSortModel)
  ) => void;
};

export function SortBatches({ sortModel, setSortModel }: SortBatchesProps) {
  const [open, setOpen] = useState(false);
  const [tempSortModel, setTempSortModel] = useState(sortModel);
  const [debouncedSortModel] = useDebounce(tempSortModel, 300);
  const [shiftKey, setShiftKey] = useState(false);

  // Auto-apply debounced changes
  useEffect(() => {
    if (open) {
      setSortModel(debouncedSortModel);
    }
  }, [debouncedSortModel, open, setSortModel]);

  // Track shift key state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShiftKey(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShiftKey(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Update temp state when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTempSortModel(sortModel);
    }
  };

  const handleToggleChange = (sortBy: BatchSortableFields) => {
    return (value: string) =>
      setTempSortModel((current) =>
        updateSortModel(current, sortBy, value, shiftKey)
      );
  };

  const handleResetToInitial = () => {
    setTempSortModel([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Sort Batches"
          className="relative size-8"
          title="Sort batches"
        >
          <ArrowUpIcon className="size-5 text-orange-100 " />
          {sortModel.length > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-orange-100 text-white size-5 p-0">
              {sortModel.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="p-2 pr-0">
        <DialogHeader className="items-center p-4 rounded-md text-lg font-semibold">
          Select sorting options
        </DialogHeader>
        <ScrollArea className="h-104">
          <ul className="divide-y divide-neutral-lightest-gray  ">
            {Object.entries(batchSummaryKeyLabelMap).map(([key, label]) => {
              const sortBy = key as BatchSortableFields;
              const position = getSortPosition(tempSortModel, sortBy);
              return (
                <li
                  key={key}
                  className="py-2 pl-4 pr-6 justify-between items-center flex gap-3"
                >
                  <TypographyBody1 className="flex-1">{label}</TypographyBody1>
                  <div className="flex items-center gap-2">
                    <div className="w-6 text-center text-sm font-medium ">
                      {position || ""}
                    </div>
                    <ToggleGroup
                      type="single"
                      spacing={2}
                      className="bg-white gap-2 rounded-md "
                      value={getSortDirection(tempSortModel, sortBy) || ""}
                      onValueChange={handleToggleChange(sortBy)}
                    >
                      <ToggleGroupItem
                        value="asc"
                        className="data-[state=on]:bg-orange-100 data-[state=on]:text-white text-orange-100 px-3 py-1 rounded-md cursor-pointer"
                      >
                        <ArrowUpIcon className="size-4  " />
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="desc"
                        className="data-[state=on]:bg-orange-100 data-[state=on]:text-white text-orange-100 px-3 py-1 rounded-md cursor-pointer"
                      >
                        <ArrowDownIcon className="size-4 " />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
        <TypographyBody2 className="px-4 text-muted-foreground mt-4">
          <strong>Tip:</strong> Hold SHIFT while clicking to sort by multiple
          fields
        </TypographyBody2>
        <DialogFooter className="p-4 gap-2">
          <Button variant="outline" onClick={handleResetToInitial}>
            Reset
          </Button>
          <Button
            onClick={() => setOpen(false)}
            className="bg-btn-primary hover:bg-btn-primary-hover active:bg-btn-primary-select"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
