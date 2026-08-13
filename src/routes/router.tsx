import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/main-layout";
import { LandingPage } from "./protected/landing-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
    ],
  },
]);
