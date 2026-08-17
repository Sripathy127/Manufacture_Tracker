import type { Batch } from "@/entities";

export const batchSummaryKeyLabelMap: Record<keyof Batch, string> = {
  batchId: "Batch ID",
  batch: "Batch name",
  material: "Material Number",
  plant: "Plant",
  materialDescription: "Material description",
  batchCreationDate: "Actual batch creation date",
  plannedBatchCreationDate: "Planned batch creation date",
  actualBatchEndDate: "Actual batch end date",
  plannedBatchEndDate: "Planned batch end date",
  etsDueDate: "ETS due date",
  status: "Status",
  overdue: "Overdue",
  notStarted: "Delayed start",
  etsEscalation: "ETS escalation",
  leftBound: "Left bound",
  rightBound: "Right bound",
  MaterialType: "Material Type",
  Responsible_Person: "Responsible Person",
  comments: "Comments",
  batchValue: "Batch Cost",
  SLED: "SLED expiry",
};

export const batchSectionMap = {
  Summary: [
    "batch",
    "material",
    "materialDescription",
    "plant",
    "MaterialType",
    "batchValue",
  ],
  "Operational planning": [
    "batchCreationDate",
    "plannedBatchCreationDate",
    "actualBatchEndDate",
    "plannedBatchEndDate",
    "etsDueDate",
    "SLED",
  ],
  // "Responsible persons for ETS investigations": ["Responsible_Person"],
} satisfies Record<string, readonly (keyof Batch)[]>;

interface ObjectConfig {
  idKey: string;
  displayKey: string;
  idLabel: string;
  displayLabel: string;
}

export const batchSummaryObjectConfig = {
  Responsible_Person: {
    idKey: "PR_ID",
    displayKey: "Person",
    idLabel: "PR ID",
    displayLabel: "Responsible Person",
  },
} satisfies Partial<Record<keyof Batch, ObjectConfig>>;

export const batchValueFormatters: Partial<
  Record<keyof Batch, (value: Batch[keyof Batch]) => string>
> = {
  batchCreationDate: (val): string =>
    val
      ? typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)
        ? new Date(val).toLocaleDateString()
        : val instanceof Date
          ? val.toLocaleDateString()
          : String(val ?? "N/A")
      : "N/A",
  plannedBatchCreationDate: (val): string =>
    val
      ? typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)
        ? new Date(val).toLocaleDateString()
        : val instanceof Date
          ? val.toLocaleDateString()
          : String(val ?? "N/A")
      : "N/A",
  actualBatchEndDate: (val): string =>
    val
      ? typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)
        ? new Date(val).toLocaleDateString()
        : val instanceof Date
          ? val.toLocaleDateString()
          : String(val ?? "N/A")
      : "N/A",
  plannedBatchEndDate: (val): string =>
    val
      ? typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)
        ? new Date(val).toLocaleDateString()
        : val instanceof Date
          ? val.toLocaleDateString()
          : String(val ?? "N/A")
      : "N/A",
  etsDueDate: (val): string =>
    val
      ? typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)
        ? new Date(val).toLocaleDateString()
        : val instanceof Date
          ? val.toLocaleDateString()
          : String(val ?? "N/A")
      : "N/A",
  overdue: (val): string => (val === "T" ? "True" : "False"),
  etsEscalation: (val): string => (val === "T" ? "True" : "False"),
  notStarted: (val): string => (val === "T" ? "True" : "False"),

  batchValue: (val): string => (val !== undefined ? `$ ${val}` : "N/A"),
  SLED: (val): string =>
    val
      ? typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)
        ? new Date(val).toLocaleDateString()
        : val instanceof Date
          ? val.toLocaleDateString()
          : String(val ?? "N/A")
      : "N/A",
};
