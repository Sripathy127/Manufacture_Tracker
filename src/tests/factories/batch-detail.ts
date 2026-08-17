import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { Batch, BatchDetail } from "@/entities";
import { BatchMilestoneFactory } from "./batch-milestone";
import { investigationBatchesDetailsFactory as InvestigationsDropdown } from "./investigations-data";
const generateBatchId = (sequence: number): string => {
  const prefix = faker.string.alpha({ length: 3, casing: "upper" });
  return `${prefix}-${String(sequence).padStart(3, "0")}`;
};

const generateBatchnames = (sequence: number): string[] => {
  const count = faker.number.int({ min: 2, max: 8 });
  return Array.from({ length: count }, (_, i) => {
    const prefix = faker.string.alpha({ length: 3, casing: "upper" });
    return `${prefix}-${String(sequence - (i + 1)).padStart(3, "0")}`;
  });
};

type BatchDetailFactoryParams = {
  rangeStart?: Date;
  rangeEnd?: Date;
};

export const batchDetailFactory = Factory.define<
  BatchDetail,
  BatchDetailFactoryParams
>(({ sequence, transientParams }) => {
  const hasPrevBatch = faker.datatype.boolean();
  const hasNextBatch = faker.datatype.boolean();

  // Build milestones ensuring each type appears at most once
  // Required types: manufacture, mfg-br-review, qa-br-review
  // Optional types: test, investigation
  const requiredTypes = ["Manufacturing", "Testing", "Investigation"] as const;

  const milestoneTypes = [
    ...requiredTypes,
    // ...(faker.datatype.boolean() ? (["Testing"] as const) : []),
    // ...(faker.datatype.boolean() ? (["Investigation"] as const) : []),
  ];

  const milestones = milestoneTypes.map((type) =>
    BatchMilestoneFactory.build(
      { milestoneType: type },
      {
        transient: {
          rangeStart: transientParams.rangeStart,
          rangeEnd: transientParams.rangeEnd,
        },
      }
    )
  );

  const etsOpenCount = faker.number.int({ min: 0, max: 5 });
  const etsClosedCount = faker.number.int({ min: 0, max: 10 });
  const openEtsList =
    etsOpenCount > 0
      ? InvestigationsDropdown.buildList(
          etsOpenCount,
          {},
          {
            transient: {
              status: "Open",
            },
          }
        )
      : null;
  const closedEtsList =
    etsClosedCount > 0
      ? InvestigationsDropdown.buildList(
          etsClosedCount,
          {},
          {
            transient: {
              status: "Closed",
            },
          }
        )
      : null;

  const defaultRangeStart =
    transientParams.rangeStart ??
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const defaultRangeEnd =
    transientParams.rangeEnd ??
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const shipped_on = faker.date.between({
    from: defaultRangeStart,
    to: defaultRangeEnd,
  });
  const shipped_to = faker.location.city();
  const shipped_quantity = faker.number.int({ min: 1, max: 100000 });
  const quantity_ordered = faker.number.int({ min: 1, max: 100000 });
  const units = faker.helpers.arrayElement(["kg", "lbs", "VL"]);
  return {
    batchId: `batch-${sequence}`,
    batch: generateBatchId(sequence),
    previousBatch: hasPrevBatch ? generateBatchnames(sequence - 1) : [],
    nextBatch: hasNextBatch ? generateBatchnames(sequence + 1) : [],
    etsOpenCount: etsOpenCount,
    etsClosedCount: etsClosedCount,
    etsOpen: openEtsList,
    etsClosed: closedEtsList,
    originalinvestigationdate: faker.date.between({
      from: defaultRangeStart,
      to: defaultRangeStart,
    }),
    currentinvestigationdate: faker.date.between({
      from: defaultRangeEnd,
      to: defaultRangeEnd,
    }),
    milestones,
    shipped_on,
    shipped_to,
    shipped_quantity,
    quantity_ordered,
    units,
  };
});

export function createBatchDetailFromRequest(
  endpoint: string,
  batch: Batch,
  partialBatchDetail?: Partial<BatchDetail>
): Promise<BatchDetail> {
  // Extract batch ID from endpoint URL (e.g., "http://localhost:3000/batch/123")
  const batchId = endpoint.split("/batch/")[1];

  // Use the batch's leftBound and rightBound as the date range for milestones
  const rangeStart = batch.leftBound;
  const rangeEnd = batch.rightBound;

  const batchDetail = batchDetailFactory.build(
    {
      batchId: batch?.batchId ?? `batch-${batchId}`,
      batch: partialBatchDetail?.batch ?? batch.batch,
    },
    { transient: { rangeStart, rangeEnd } }
  );

  const merged: BatchDetail = {
    ...batchDetail,
    ...partialBatchDetail,

    // milestones: batchDetail.milestones,

    etsOpenCount: partialBatchDetail?.etsOpenCount ?? batchDetail.etsOpenCount,
    etsClosedCount:
      partialBatchDetail?.etsClosedCount ?? batchDetail.etsClosedCount,
    originalinvestigationdate: batchDetail.originalinvestigationdate,
    currentinvestigationdate: batchDetail.currentinvestigationdate,
  };

  return Promise.resolve(merged);
}
