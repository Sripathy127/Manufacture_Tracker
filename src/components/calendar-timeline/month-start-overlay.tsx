import type { MonthStartPosition } from "@/lib/calendar-timeline/overlay-utils";

export function MonthStartOverlay({
  positions,
}: {
  positions: MonthStartPosition[];
}) {
  return positions.map((pos, index) => (
    <div
      key={index}
      className="absolute top-0 -bottom-px pointer-events-none bg-(--color-neutral-light-blue) z-0"
      style={{
        left: `${pos.leftPx}px`,
        width: `${pos.widthPx}px`,
      }}
    />
  ));
}
