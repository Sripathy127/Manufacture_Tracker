import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { BatchMilestone, BatchMilestoneType } from "@/entities";
import { BatchMilestoneTypes, BatchMilestoneStatus } from "@/entities";

type BatchMilestoneFactoryParams = {
  rangeStart?: Date;
  rangeEnd?: Date;
};

export const BatchMilestoneFactory = Factory.define<
  BatchMilestone,
  BatchMilestoneFactoryParams
>(({ sequence, transientParams }) => {
  const rangeStart =
    transientParams.rangeStart || faker.date.recent({ days: 30 });
  const rangeEnd =
    transientParams.rangeEnd ||
    faker.date.soon({ days: 30, refDate: rangeStart });

  const leftbound = faker.date.between({ from: rangeStart, to: rangeEnd });
  const rightbound = faker.date.between({ from: leftbound, to: rangeEnd });
  const actual_start = leftbound;
  const actual_end = rightbound;
  const planned_start = leftbound;
  const planned_end = rightbound;
  const milestoneType = faker.helpers.arrayElement<BatchMilestoneType>([
    ...BatchMilestoneTypes,
  ]);

  return {
    milestoneId: `m-${sequence}`,
    milestoneType,
    leftbound,
    rightbound,
    actual_start,
    actual_end,
    planned_start,
    planned_end,
    status: faker.helpers.arrayElement([...BatchMilestoneStatus]),
  };
});
