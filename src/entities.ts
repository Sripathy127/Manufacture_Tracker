export type Site = {
  SiteID: string | number;
  SiteName: string;
};

export type ProductFamily = {
  ProductFamilyNumber: string | number;
  ProductFamilyName: string;
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
  etsDueDate: Date;
  status: BatchStatus;
  overdue: string;
  etsEscalation: string;
  notStarted: string;
  leftBound: Date;
  rightBound: Date;
  MaterialType: string;
};

export const batchStatus = ["in-process", "future", "closed"] as const;

export type BatchStatus = (typeof batchStatus)[number];
