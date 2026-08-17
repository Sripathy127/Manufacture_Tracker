import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { Batch, BatchStatus, ResponsiblePerson } from "@/entities";

const generateBatchId = (sequence: number): string => {
  const prefix = faker.string.alpha({ length: 3, casing: "upper" });
  return `${prefix}-${String(sequence).padStart(3, "0")}`;
};

export const batchFactory = Factory.define<Batch>(({ sequence }) => {
  const batchCreationDate = faker.date.recent({ days: 30 });
  const plannedBatchCreationDate = faker.date.soon({
    days: 5,
    refDate: batchCreationDate,
  });
  const batchEndDate = faker.date.soon({
    days: 15,
    refDate: batchCreationDate,
  });
  const plannedBatchEndDate = faker.date.soon({
    days: 15,
    refDate: plannedBatchCreationDate,
  });
  const etsDueDate = faker.date.soon({ days: 20, refDate: batchEndDate });
  const responsiblePerson: ResponsiblePerson[] = [
    {
      Person: faker.person.fullName(),
      PR_ID: `PR-${faker.string.alphanumeric({ length: 5, casing: "upper" })}`,
    },
    {
      Person: faker.person.fullName(),
      PR_ID: `PR-${faker.string.alphanumeric({ length: 5, casing: "upper" })}`,
    },
    {
      Person: faker.person.fullName(),
      PR_ID: `PR-${faker.string.alphanumeric({ length: 5, casing: "upper" })}`,
    },
  ];
  const comments: string[] = [
    faker.lorem.sentence(),
    faker.lorem.sentence(),
    faker.lorem.sentence(),
  ];

  const SLED = faker.date.soon({ days: 365, refDate: batchCreationDate });

  return {
    batchId: `batch-${sequence}`,
    batch: generateBatchId(sequence),
    material: `MAT-${faker.string.alphanumeric({ length: 6, casing: "upper" })}`,
    materialDescription: faker.lorem.words(3),
    plant: faker.location.city(),
    batchCreationDate,
    plannedBatchCreationDate,
    actualBatchEndDate: batchEndDate,
    plannedBatchEndDate,
    etsDueDate,
    status: faker.helpers.arrayElement<BatchStatus>([
      "in-process",
      "future",
      "closed",
    ]),
    batchValue: faker.number.int({ min: 100, max: 100000 }).toString(),
    overdue: faker.helpers.arrayElement(["Y", "N"]),
    etsEscalation: faker.helpers.arrayElement(["Y", "N"]),
    notStarted: faker.helpers.arrayElement(["Y", "N"]),
    leftBound: batchCreationDate,
    rightBound: batchEndDate,
    comments: comments,
    MaterialType: faker.helpers.arrayElement([
      "Type A",
      "Type B",
      "Type C",
      "Type D",
    ]),
    Responsible_Person: responsiblePerson,
    SLED,
  };
});

// Convenience factories for specific batch states
export const inProcessBatchFactory = batchFactory.params({
  status: "in-process",
  overdue: "N",
  etsEscalation: "N",
  notStarted: "N",
});

export const futureBatchFactory = batchFactory.params({
  status: "future",
  overdue: "N",
  etsEscalation: "N",
  notStarted: "Y",
});

export const closedBatchFactory = batchFactory.params({
  status: "closed",
  overdue: "N",
  etsEscalation: "N",
  notStarted: "N",
});

export const overdueBatchFactory = batchFactory.params({
  status: "in-process",
  overdue: "Y",
  etsEscalation: "N",
  notStarted: "N",
});

export const escalatedBatchFactory = batchFactory.params({
  status: "in-process",
  overdue: "N",
  etsEscalation: "Y",
  notStarted: "N",
});

export const fetchMockBatches = (count = 100): Promise<{ data: Batch[] }> => {
  const batches = batchFactory.buildList(count);
  return Promise.resolve({ data: batches });
};
