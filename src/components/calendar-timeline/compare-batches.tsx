import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import type { Batch } from "@/entities";
import { Drawer as DrawerPrimitive } from "vaul";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { TypographyBody2, TypographyH2 } from "../ui/typography";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "../ui/input";
import { useVirtualizer } from "@tanstack/react-virtual";

export function CompareBatches({
  open,
  onOpenChange,
  onClosed,
  containerRef,
  batches,
  compareBatches,
  setCompareBatches,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClosed: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  batches: Batch[];
  compareBatches: Batch[];
  setCompareBatches: (batches: Batch[]) => void;
}) {
  const [bounds, setBounds] = useState({ top: 0, height: 0 });
  const [searchValue, setSearchValue] = useState("");
  const scrollareaRef = useRef<HTMLDivElement>(null);
  const filteredBatches = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return batches;
    return batches.filter((b) => b.batch?.toLowerCase().includes(query));
  }, [batches, searchValue]);

  const onToggleItem = (item: Batch) => {
    const newSelectedBatches = compareBatches.some(
      (cb) => cb.batchId === item.batchId
    )
      ? compareBatches.filter((cb) => cb.batchId !== item.batchId)
      : [...compareBatches, item];

    setCompareBatches(newSelectedBatches);
  };

  const handleReset = () => {
    setCompareBatches([]);
    setSearchValue("");
  };
  const rowVirtualizer = useVirtualizer({
    count: filteredBatches.length,
    getScrollElement: () => scrollareaRef.current,
    estimateSize: () => 80,
    overscan: 20,
  });

  useEffect(() => {
    rowVirtualizer.measure();
    rowVirtualizer.scrollToOffset(0, { align: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredBatches.length]);

  const virtualItems = rowVirtualizer.getVirtualItems();

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

  return (
    <DrawerPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      onAnimationEnd={(open) => {
        if (!open) onClosed();
      }}
      direction="left"
      modal={false}
    >
      <DrawerPrimitive.Content
        className="fixed p-2 left-0 w-108 bg-white border-l rounded-tr-xl border-t flex flex-col z-30 shadow-drawer border-border-tertiary pt-1"
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
        <DrawerPrimitive.Title className="text-xl font-arboria-bold font-bold tracking-tight text-center  px-4 pb-3 mb-2">
          <div>
            <TypographyH2 className="mb-2">Compare Batches</TypographyH2>
            <Input
              placeholder="Search batches..."
              value={searchValue}
              className="mb-2"
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <TypographyBody2 className="text-neutral-dark-gray text-left">
              Selected batches : {compareBatches.length}
            </TypographyBody2>
          </div>
        </DrawerPrimitive.Title>

        <div
          ref={scrollareaRef}
          className="mb-2  overflow-y-auto"
          style={{ maxHeight: `calc(${bounds.height}px - 150px)` }}
        >
          {filteredBatches.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <TypographyBody2 className="text-text-secondary">
                No batches found
              </TypographyBody2>
            </div>
          ) : (
            <div
              style={{
                height: rowVirtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {virtualItems.map((virtualRow) => {
                const b = filteredBatches[virtualRow.index];
                const isSelected = compareBatches.some(
                  (cb) => cb.batchId === b.batchId
                );
                return (
                  <div
                    key={b.batchId}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className={cn(
                      "p-3 hover:bg-orange-60 border-b",
                      isSelected ? "bg-orange-20" : "bg-white"
                    )}
                  >
                    <label className="flex items-center gap-2 rounded cursor-pointer">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleItem(b)}
                        className="border-border-interactive data-[state=checked]:bg-surface-primary data-[state=checked]:border-surface-primary"
                      />
                      <div className="flex justify-center  flex-col gap-1">
                        <TypographyBody2 className=" text-neutral-black font-bold">
                          {b.batch}
                        </TypographyBody2>
                        <TypographyBody2 className="text-neutral-dark-gray">
                          {b.material}
                        </TypographyBody2>
                        <TypographyBody2 className="text-neutral-dark-gray text-ellipsis">
                          {b.materialDescription}
                        </TypographyBody2>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
