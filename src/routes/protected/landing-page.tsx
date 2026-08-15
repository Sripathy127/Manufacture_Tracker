import { SearchLocationsAndProducts } from "@/components/search-location-product-dropdown";
import { useOutletContext } from "react-router";
import type { Site } from "@/entities";
import { useNavigate } from "react-router";
import { useBatchLoadingFilters } from "@/hooks/use-batch-filter-model";

type OutletContext = {
  sites: Site[];
};

export function LandingPage() {
  const { sites } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const { filterModel, setSitesProductsMRPFiltersValue } =
    useBatchLoadingFilters();

  const handleSubmit = (filters: {
    siteIds: string[];
    productFamilyIds?: string[];
  }) => {
    setSitesProductsMRPFiltersValue({
      ...filters,
      productFamilyIds: filters.productFamilyIds ?? [],
    });
    navigate("/manufacture-tracker");
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-30">
      <div className="text-4xl font-bold text-black">Track your Batches</div>

      <SearchLocationsAndProducts
        sites={sites}
        onSubmit={handleSubmit}
        initialValues={{
          siteIds: filterModel.siteIds,
          productFamilyIds: filterModel.productFamilyIds ?? [],
        }}
        autoFocus={true}
      />
    </div>
  );
}
