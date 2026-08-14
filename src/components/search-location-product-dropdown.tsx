import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiEndpoints } from "@/api/endpoints";
import type { Site, ProductFamily } from "@/entities";
import { SearchableDropdown } from "./searchable-dropdown";
import { useNavigation } from "react-router";
import { productFamilyFactory } from "@/tests/factories/product-family";

type SearchLocationsAndProductsProps = {
  sites: Site[];
  initialValues?: {
    siteIds: string[];
    productFamilyIds: string[];
  };
  onSubmit: (selections: {
    siteIds: string[];
    productFamilyIds?: string[];
  }) => void;
  autoFocus?: boolean;
  className?: string;
};

export function SearchLocationsAndProducts({
  sites,
  initialValues,
  onSubmit,
  className,
}: SearchLocationsAndProductsProps) {
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>(
    initialValues?.siteIds || []
  );
  console.log("rendered");
  const navigation = useNavigation();

  // Query for product families based on selected sites
  const { data: productFamilies, isLoading: isLoadingProductFamilies } =
    useQuery<ProductFamily[]>({
      queryKey: [
        "productFamilies",
        apiEndpoints.productFamilies,
        selectedSiteIds,
      ],
      queryFn: async () => {
        const response = await productFamilyFactory.buildList(5);
        return response;
      },
      enabled: selectedSiteIds.length > 0,
    });

  // Transform sites data to the format expected by the SearchableDropdown
  const siteItems =
    sites?.map((site) => ({
      id: String(site.SiteID),
      name: site.SiteName,
      subtitle: String(site.SiteID),
    })) || [];

  // Transform product families data to the format expected by the SearchableDropdown
  const productFamilyItems =
    productFamilies?.map((pf) => ({
      id: String(pf.ProductFamilyNumber),
      name: pf.ProductFamilyName,
      subtitle: String(pf.ProductFamilyNumber),
    })) || [];

  const handleSubmit = (selections: {
    firstDropdown: string[];
    secondDropdown: string[];
  }) => {
    onSubmit({
      siteIds: selections.firstDropdown,

      productFamilyIds: selections.secondDropdown,
    });
  };

  const firstDropdownConfig = {
    items: siteItems,
    title: "Location",
    placeholder: "Search for a Site ID",
    initialSelections: initialValues?.siteIds || [],
    onChange: setSelectedSiteIds,
  };

  const secondDropdownConfig = {
    items: productFamilyItems,
    title: "Product",
    placeholder: "Search for a family name or ID",
    loading: isLoadingProductFamilies,
    emptyMessage: "Select sites to view product families",
    initialSelections: initialValues?.productFamilyIds || [],
  };

  return (
    <SearchableDropdown
      firstDropdown={firstDropdownConfig}
      secondDropdown={secondDropdownConfig}
      onSubmit={handleSubmit}
      isSubmitting={navigation.state === "loading"}
      autoFocus
      className={className}
    />
  );
}
