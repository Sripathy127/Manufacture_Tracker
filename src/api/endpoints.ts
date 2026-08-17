const API_HOST = import.meta.env.VITE_API_HOST || "http://localhost:3000";

export const apiEndpoints = {
  sites: `${API_HOST}/sites`,
  productFamilies: `${API_HOST}/product-families`,
  MRP_Controller: `${API_HOST}/mrp-controllers`,
  batches: `${API_HOST}/batch-summary`,
  batch: (id: string) => `${API_HOST}/batches?batchId=${id}`,
  batchGenealogy: (id: string) => `${API_HOST}/batch-genealogy?batchId=${id}`,
  comment: `${API_HOST}/comment`,
} as const;
