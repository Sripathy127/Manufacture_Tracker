export type Site = {
  SiteID: number;
  SiteName: string;
};

export type ProductFamily = {
  ProductFamilyNumber: number;
  ProductFamilyName: string;
};

export type MRP_Controller = {
  MaterialNumber: string;
  MRPController: string;
  MaterialDescription: string;
};

export type Batch = {
  batchId: string;
  batch: string;
  materialDescription: string;
  material: string;
  plant: string;
  batchCreationDate: Date;
  plannedBatchCreationDate: Date;
  actualBatchEndDate: Date;
  plannedBatchEndDate: Date;
  batchValue: string;
  SLED: Date;
  etsDueDate: Date;
  status: BatchStatus;
  overdue: string;
  etsEscalation: string;
  notStarted: string;
  leftBound: Date;
  rightBound: Date;
  MaterialType: string;
  Responsible_Person: ResponsiblePerson[];
  comments: string[];
};

export type RawNode = {
  BatchID: string;
  BatchName: string;
  Section: BatchNodeType;
};

export type RawEdge = {
  source: string;
  target: string;
};

export type GenealogyGraphData = {
  rawNodes: RawNode[];
  rawEdges: RawEdge[];
  startDate: Date;
  endDate: Date;
  Batches: Batch[];
};

export const batchNodeTypes = ["previous", "current", "next"] as const;
export type BatchNodeType = (typeof batchNodeTypes)[number];

export const batchStatus = ["in-process", "future", "closed"] as const;

export type BatchStatus = (typeof batchStatus)[number];

export const batchFlag = ["escalated", "overdue", "notStarted"] as const;

export type BatchFlag = (typeof batchFlag)[number];

export type ResponsiblePerson = {
  Person: string;
  PR_ID: string;
};

export const BatchMilestoneTypes = [
  "Manufacturing",
  "Testing",
  "Investigation",
] as const;

export type BatchMilestoneType = (typeof BatchMilestoneTypes)[number];

export const BatchMilestoneStatus = ["On-Time", "Delayed"] as const;

export type BatchMilestoneStatus = (typeof BatchMilestoneStatus)[number];

export type BatchMilestone = {
  milestoneId: string;
  milestoneType: BatchMilestoneType;
  planned_start: Date;
  planned_end: Date;
  actual_start: Date;
  actual_end: Date;
  leftbound: Date;
  rightbound: Date;
  status: BatchMilestoneStatus;
  testing_done?: boolean;
};

export type InvestigationBatchesDetails = {
  batchId: string;
  batch: string;
  material: string;
  plant: string;
  PR_ID: string;
  TitleShortDescription: string;
  PrState: string;
  OriginalDueDate: Date;
  DueDate: Date;
  DateOpened: Date;
  DateClosed: Date;
  RecordType: string;
};

export type BatchDetail = {
  batchId: string;
  batch: string;
  previousBatch: string[] | null;
  nextBatch: string[] | null;
  etsOpenCount: number;
  etsClosedCount: number;
  etsOpen: InvestigationBatchesDetails[] | null;
  etsClosed: InvestigationBatchesDetails[] | null;
  originalinvestigationdate: Date;
  currentinvestigationdate: Date;
  milestones: BatchMilestone[];
  shipped_on: Date;
  shipped_to: string;
  shipped_quantity: number;
  quantity_ordered: number;
  units: string;
};
