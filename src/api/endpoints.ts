const API_HOST = import.meta.env.VITE_API_HOST || "http://localhost:3000";

export const apiEndpoints = {
  sites: `${API_HOST}/sites`,
  productFamilies: `${API_HOST}/product-families`,
};
