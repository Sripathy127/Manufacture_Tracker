import type { BatchFlag, BatchMilestoneStatus, BatchStatus } from "@/entities";

export type BatchColorKey = BatchStatus | BatchFlag;

export const batchStatusLabelMap: Record<BatchColorKey, string> = {
  future: "Not started",
  "in-process": "In process",
  closed: "Closed",
  overdue: "Overdue",
  escalated: "Escalated",
  notStarted: "Delayed start",
};

export const batchColorMap: Record<BatchColorKey, [string, string, string]> = {
  "in-process": ["bg-sky-100", "bg-sky-20", "border-l-sky-100"],
  future: ["bg-gray-800", "bg-gray-400", "border-l-gray-400"],
  closed: ["bg-sea-100", "bg-sea-20", "border-l-sea-100"],
  overdue: ["bg-barn-100", "bg-barn-20", "border-l-red-barn-100"],
  escalated: ["bg-orange-300", "bg-orange-40", "border-l-orange-300"],
  notStarted: ["bg-yellow-100", "bg-yellow-20", "border-l-yellow-100"],
};

export const milestoneStatusLabelMap: Record<BatchMilestoneStatus, string> = {
  "On-Time": "On time",
  Delayed: "Delayed",
};

export type MilestoneKolorKey = BatchMilestoneStatus;

export const milestoneColorMap: Record<
  MilestoneKolorKey,
  [string, string, string]
> = {
  "On-Time": ["bg-grass-100", "bg-grass-20", "border-l-grass-100"],
  Delayed: ["bg-barn-100", "bg-barn-20", "border-l-barn-100"],
};

export const milestoneNameMap: Record<string, string> = {
  manufacture: "Manufacture",
  test: "Test",
  "mfg-br-review": "Mfg BR Review",
  "qa-br-review": "QA BR Review",
  investigation: "Investigation",
  ETS: "Investigation",
};
