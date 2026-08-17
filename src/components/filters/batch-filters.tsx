import type { BatchAllFilterModel } from "../../lib/filter-model/config";
import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { Drawer as DrawerPrimitive } from "vaul";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import {
  batchFilters,
  getDefaultOperatorForType,
  fieldOptionsResolver,
} from "../../lib/filter-model/config";
import type { FilterFieldConfig } from "@/lib/filter-model/types";
import { CollapsibleField } from "./collapsible-field";
import { ScrollArea } from "../ui/scroll-area";
import type { Batch } from "@/entities";

export function BatchFilters({
  open,
  onOpenChange,
  filterModel,
  setFilterModel,
  containerRef,
  batches,
  unfilteredBatches,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterModel: BatchAllFilterModel;
  setFilterModel: (model: BatchAllFilterModel) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  batches: Batch[];
  unfilteredBatches: Batch[];
}) {
  const [tempFilterModel, setTempFilterModel] = useState(filterModel);
  const [debouncedFilterModel] = useDebounce(tempFilterModel, 300);
  const isInitialOpenRef = useRef(false);
  const [bounds, setBounds] = useState({ top: 0, height: 0 });

  const resolvedOptionsMap = useMemo(() => {
    const map: Partial<Record<keyof BatchAllFilterModel, string[]>> = {};

    for (const [fieldKey, resolver] of Object.entries(fieldOptionsResolver)) {
      map[fieldKey as keyof BatchAllFilterModel] = resolver(unfilteredBatches);
    }

    return map;
  }, [unfilteredBatches]);

  useLayoutEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setBounds({ top: rect.top, height: rect.height });
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds, true); // Capture phase to catch all scrolls

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds, true);
    };
  }, [containerRef]);

  useEffect(() => {
    if (open && !isInitialOpenRef.current) {
      setFilterModel(debouncedFilterModel);
    }
    // Reset flag after first render when open
    if (open && isInitialOpenRef.current) {
      isInitialOpenRef.current = false;
    }
  }, [debouncedFilterModel, open, setFilterModel]);

  const handleReset = () => {
    setTempFilterModel({});
  };

  const handleFilterChange = <K extends keyof BatchAllFilterModel>(
    fieldKey: K,
    filter: BatchAllFilterModel[K] | undefined
  ) => {
    if (filter === undefined) {
      // Remove filter
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [fieldKey]: _, ...rest } = tempFilterModel;
      setTempFilterModel(rest as BatchAllFilterModel);
    } else {
      // Add or update filter
      setTempFilterModel({
        ...tempFilterModel,
        [fieldKey]: filter,
      });
    }
  };
  return (
    <DrawerPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      direction="left"
      modal={false}
    >
      <DrawerPrimitive.Content
        className="fixed p-2 left-0 w-108 bg-white border-l rounded-xl border-t h-full flex flex-col z-30 shadow-drawer border-border-tertiary pt-2"
        style={{
          top: `${bounds.top}px`,
          height: `${bounds.height}px`,
        }}
      >
        <DrawerPrimitive.Close asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="close drawer"
            className="cursor-pointer ml-auto mr-2"
          >
            <XIcon className="size-5 " />
          </Button>
        </DrawerPrimitive.Close>
        <DrawerPrimitive.Title className=" px-4 ">
          <div className=" flex flex-row gap-2 items-center">
            Filters
            <span className="text-neutral-dark-gray text-sm font-regular ">
              {batches.length} batches
            </span>
          </div>
        </DrawerPrimitive.Title>
        <ScrollArea
          className={` mt-4 mb-2`}
          style={{
            maxHeight: `calc(${bounds.height}px - 150px)`,
          }}
        >
          <ul className="divide-y divide-neutral-lightest-gray  ">
            {Object.entries(batchFilters)
              .filter(
                ([, fieldConfig]) =>
                  (fieldConfig as FilterFieldConfig).displayInModal !== false
              )
              .map(([key, fieldConfig]) => {
                const fieldKey = key as keyof BatchAllFilterModel;
                const currentFilter = tempFilterModel[fieldKey];

                const currentOperator =
                  currentFilter?.operator ??
                  getDefaultOperatorForType(fieldConfig.valueType);

                return (
                  <li
                    key={key}
                    className="py-5 pl-4 pr-6 flex items-center gap-3"
                  >
                    <CollapsibleField
                      fieldConfig={fieldConfig}
                      currentOperator={currentOperator}
                      currentFilter={currentFilter}
                      fieldKey={fieldKey}
                      handleFilterChange={handleFilterChange}
                      resolvedOptions={resolvedOptionsMap[fieldKey]} //  undefined for fields without a resolver
                    />
                  </li>
                );
              })}
          </ul>
        </ScrollArea>
        <div className="flex flex-row gap-2 mt-auto mb-4">
          <Button
            variant={"default"}
            className="flex flex-1 bg-orange-100 hover:bg-orange-200 text-white"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            variant={"default"}
            className="flex flex-1 bg-white border border-orange-100 text-orange-100 hover:bg-orange-60 hover:text-white "
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Root>
  );
}
