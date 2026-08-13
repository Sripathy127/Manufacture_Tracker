import { LayoutContainer } from "@/components/layout-container";
import { TopbarContainer } from "@/components/topbar-container";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router";

export function MainLayout() {
  return (
    <LayoutContainer>
      <TopbarContainer>
        <div>Manufacture Tracker</div>
      </TopbarContainer>
      <main
        className={cn("flex-1 bg-neutral-blue flex flex-col min-h-0")}
      >
        <Outlet />
      </main>
    </LayoutContainer>
  );
}
