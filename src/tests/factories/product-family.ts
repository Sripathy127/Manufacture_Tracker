import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { ProductFamily } from "@/entities";

export const productFamilyFactory = Factory.define<ProductFamily>(
  ({ sequence }) => ({
    ProductFamilyNumber: 100 + sequence,
    ProductFamilyName: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
  })
);
