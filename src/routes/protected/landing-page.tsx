import { SearchLocationsAndProducts } from "@/components/search-location-product-dropdown";
import { useOutletContext } from "react-router";
import type { Site } from "@/entities";

type OutletContext = {
  sites: Site[];
};

export function LandingPage() {
  const { sites } = useOutletContext<OutletContext>();

  const handleSubmit = (selections: {
    siteIds: string[];
    productFamilyIds?: string[];
  }) => {
    console.log("Selected Site IDs:", selections.siteIds);
    console.log(
      "Selected Product Family IDs:",
      selections.productFamilyIds || []
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-30">
      <div className="text-4xl font-bold text-black">Track your Batches</div>

      <SearchLocationsAndProducts
        sites={sites}
        onSubmit={handleSubmit}
        initialValues={{
          siteIds: [],
          productFamilyIds: [],
        }}
      />
    </div>
  );
}
