import { getDefaultBatchDateRange } from "./batch-date-utils";

export const BATCH_LOADING_FILTERS_STORAGE_KEY = "__batch_filter_model_v1";

import type { Site } from "@/entities";

export type BatchLoadingFilters = {
  // Required - needed for API and core functionality
  siteIds: string[];
  productFamilyIds?: string[];
  startDate: string;
  endDate: string;
};

export function getBatchLoadingFiltersFromStorage(): BatchLoadingFilters {
  const filterModelJSON: string | null =
    localStorage.getItem(BATCH_LOADING_FILTERS_STORAGE_KEY) ?? null;

  const defaults = getDefaultBatchLoadingFilters();

  try {
    if (filterModelJSON) {
      const parsed = JSON.parse(filterModelJSON);
      // Merge with defaults to ensure all required fields are present
      return {
        siteIds: parsed.siteIds ?? defaults.siteIds,
        productFamilyIds: parsed.productFamilyIds ?? defaults.productFamilyIds,
        startDate: parsed.startDate ?? defaults.startDate,
        endDate: parsed.endDate ?? defaults.endDate,
      };
    }
  } catch (error) {
    console.log("Error parsing filter model from localStorage", error);
  }

  return defaults;
}

function getDefaultBatchLoadingFilters(): BatchLoadingFilters {
  const { startDate, endDate } = getDefaultBatchDateRange();
  return {
    siteIds: [],
    productFamilyIds: [],
    startDate,
    endDate,
  };
}

export function setBatchLoadingFiltersToStorage(model: BatchLoadingFilters) {
  localStorage.setItem(
    BATCH_LOADING_FILTERS_STORAGE_KEY,
    JSON.stringify(model)
  );
}

export function updateBatchLoadingFilterslWithPermittedSites(
  sites: Site[]
): void {
  if (sites.length === 0) {
    localStorage.removeItem(BATCH_LOADING_FILTERS_STORAGE_KEY);

    return;
  }
  const filterModel = getBatchLoadingFiltersFromStorage();

  if (!filterModel.siteIds || filterModel.siteIds.length === 0) return; // No siteIds to validate

  const validSiteIds = sites.map((site) => String(site.SiteID));
  const filteredSiteIds = filterModel.siteIds.filter((siteId) =>
    validSiteIds.includes(siteId)
  );

  if (filteredSiteIds.length !== filterModel.siteIds.length) {
    const updated: BatchLoadingFilters = {
      ...filterModel,
      siteIds: filteredSiteIds,
      productFamilyIds: [],
    };

    setBatchLoadingFiltersToStorage(updated);
  }
}
