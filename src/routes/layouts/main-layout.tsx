import { LayoutContainer } from "@/components/layout-container";
import { TopbarContainer } from "@/components/topbar-container";
import { cn } from "@/lib/utils";
import { Outlet, useLoaderData } from "react-router";
import type { Site } from "@/entities";

export function MainLayout() {
  const sites = useLoaderData<Site[]>();
  return (
    <LayoutContainer>
      <TopbarContainer>
        <div>Manufacture Tracker</div>
      </TopbarContainer>
      <main className={cn("flex-1 bg-sky-100 flex flex-col min-h-0")}>
        <Outlet context={{ sites }} />
      </main>
    </LayoutContainer>
  );
}
