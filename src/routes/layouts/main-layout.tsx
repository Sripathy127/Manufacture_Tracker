import { LayoutContainer } from "@/components/layout-container";
import { TopbarContainer } from "@/components/topbar-container";
import { cn } from "@/lib/utils";
import { Outlet, useLoaderData, useLocation } from "react-router";
import type { Site } from "@/entities";
import { SearchLocationsAndProducts } from "@/components/search-location-product-dropdown";
import { useBatchLoadingFilters } from "@/hooks/use-batch-filter-model";

export function MainLayout() {
  const sites = useLoaderData<Site[]>();
  const path = useLocation().pathname;
  const { filterModel, setSitesProductsMRPFiltersValue } =
    useBatchLoadingFilters();

  const isRoot = path === "/";
  const handleSubmit = (selections: {
    siteIds: string[];
    productFamilyIds?: string[];
    mrpControllerIds?: string[];
    secondaryFilterType: "ProductFamily" | "MRPController";
  }) => {
    setSitesProductsMRPFiltersValue({
      ...selections,
      productFamilyIds: selections.productFamilyIds ?? [],
    });
  };

  return (
    <LayoutContainer>
      <TopbarContainer>
        <div
          className={cn(
            "flex items-center justify-between",
            isRoot ? "p-8" : "px-8 pt-3 pb-2.5"
          )}
        >
          <div>Manufacture Tracker</div>

          {!isRoot && (
            <SearchLocationsAndProducts
              sites={sites}
              onSubmit={handleSubmit}
              initialValues={{
                siteIds: filterModel.siteIds ?? [],
                productFamilyIds: filterModel.productFamilyIds ?? [],
              }}
              className="absolute"
            />
          )}
          <div className="border border-black rounded-full h-10 w-10 border-2"></div>
        </div>
      </TopbarContainer>
      <main className={cn("flex-1 bg-sky-100 flex flex-col min-h-0")}>
        <Outlet context={{ sites }} />
      </main>
    </LayoutContainer>
  );
}
