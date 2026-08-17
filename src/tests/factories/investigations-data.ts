import { type InvestigationBatchesDetails } from "@/entities";
import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

type InvestigationBatchesDetailsFactoryParams = {
  status?: string;
};

export const investigationBatchesDetailsFactory = Factory.define<
  InvestigationBatchesDetails,
  InvestigationBatchesDetailsFactoryParams
>(({ sequence, transientParams }) => {
  const { status } = transientParams || {};
  return {
    batchId: `batch-${sequence}`,
    batch: `BATCH-${faker.string.alphanumeric({ length: 6, casing: "upper" })}`,
    material: `MAT-${faker.string.alphanumeric({ length: 6, casing: "upper" })}`,
    plant: faker.location.city(),
    PR_ID: faker.string.alphanumeric({ length: 8, casing: "upper" }),
    TitleShortDescription: faker.lorem.sentence(),
    PrState: status || faker.helpers.arrayElement(["Open", "Closed"]),
    OriginalDueDate: faker.date.future(),
    DueDate: faker.date.future(),
    DateOpened: faker.date.past(),
    DateClosed: faker.date.past(),
    RecordType: faker.helpers.arrayElement(["Type1", "Type2", "Type3"]),
  };
});
