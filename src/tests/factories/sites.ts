import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { Site } from "@/entities";

export const siteFactory = Factory.define<Site>(({ sequence }) => ({
  SiteID: sequence,
  SiteName: faker.location.city(),
}));
