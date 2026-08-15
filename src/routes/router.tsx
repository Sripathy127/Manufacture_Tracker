import { createBrowserRouter, type LoaderFunction } from "react-router";
import { MainLayout } from "./layouts/main-layout";
import { LandingPage } from "./protected/landing-page";
import type { Site } from "@/entities";
import { apiEndpoints } from "@/api/endpoints";
import { queryClient } from "@/api/react-query-config";
import { siteFactory } from "@/tests/factories/sites";
import { TimelinePage } from "./protected/timeline-page";

const sitesLoader: LoaderFunction = async (): Promise<Site[]> => {
  const sites = await queryClient.fetchQuery<Site[]>({
    queryKey: [apiEndpoints.sites],
    queryFn: async () => {
      const response = await siteFactory.buildList(5);
      return response;
    },
  });

  return sites;
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    loader: sitesLoader,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: "/manufacture-tracker",
        Component: TimelinePage,
      },
    ],
  },
]);
