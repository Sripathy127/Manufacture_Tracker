import type { FutureOverlayPosition } from "@/lib/calendar-timeline/overlay-utils";

export function FutureOverlay({
  position,
  children,
}: {
  position: FutureOverlayPosition;
  children?: React.ReactNode;
}) {
  if (!position) {
    return null;
  }

  return (
    <div
      className="absolute top-0 -bottom-px bg-gray-400/40 border-l-2 border-(--color-orange-100) z-10 pointer-events-none"
      style={{
        left: `${position.leftPx}px`,
        width: `${position.widthPx}px`,
      }}
    >
      {children}
    </div>
  );
}
