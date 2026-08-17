import { batchStatusLabelMap } from "@/components/calendar-timeline/colors-mapping";
import type { Batch } from "@/entities";
import type { OptionsResolver } from "@/lib/filter-model/types";
import type {
  AnyFilter,
  BooleanOperator,
  DateOperator,
  FilterFieldConfig,
  FlagsOperator,
  NumberOperator,
  StringOperator,
} from "./types";
import {
  booleanOperators,
  dateOperators,
  flagsOperators,
  numberOperators,
  stringOperators,
} from "./operators";

// ============================================================================
// FILTER CONFIGURATION
// ============================================================================

// Batch-specific filter fields
export const batchFilters = {
  batch: {
    id: "batch",
    label: "Name",
    valueType: "string",
    displayInModal: false,
  },
  material: {
    id: "material",
    label: "Material",
    valueType: "string",
  },

  materialDescription: {
    id: "materialDescription",
    label: "Material Name",
    valueType: "string",
  },

  batchCreationDate: {
    id: "batchCreationDate",
    label: "Batch Creation Date",
    valueType: "date",
  },
  plannedBatchCreationDate: {
    id: "plannedBatchCreationDate",
    label: "Planned Batch Creation Date",
    valueType: "date",
  },
  actualBatchEndDate: {
    id: "actualBatchEndDate",
    label: "Actual Batch End Date",
    valueType: "date",
  },
  plannedBatchEndDate: {
    id: "plannedBatchEndDate",
    label: "Planned Batch End Date",
    valueType: "date",
  },
  etsDueDate: {
    id: "etsDueDate",
    label: "ETS Due Date",
    valueType: "date",
  },
  status: {
    id: "status",
    label: "Status",
    valueType: "string",
    selectOptions: Object.entries(batchStatusLabelMap).map(
      ([value, label]) => ({ value, label })
    ),
    displayInModal: false,
  },
  //
  // example how to add single flag filter
  //
  // overdue: {
  //   id: "overdue",
  //   label: "Overdue",
  //   valueType: "string",
  //   selectOptions: [
  //     { value: "T", label: "Yes" },
  //     { value: "F", label: "No" },
  //   ],
  // },
  // etsEscalation: {
  //   id: "etsEscalation",
  //   label: "ETS Escalation",
  //   valueType: "string",
  //   selectOptions: [
  //     { value: "T", label: "Yes" },
  //     { value: "F", label: "No" },
  //   ],
  // },
  // notStarted: {
  //   id: "notStarted",
  //   label: "Delayed start",
  //   valueType: "string",
  //   selectOptions: [
  //     { value: "T", label: "Yes" },
  //     { value: "F", label: "No" },
  //   ],
  // },

  plant: {
    id: "plant",
    label: "Plant",
    valueType: "string",
  },
  MaterialType: {
    id: "MaterialType",
    label: "Material Type",
    valueType: "string",
  },
  responsiblePerson: {
    id: "responsiblePerson",
    label: "Responsible Person",
    valueType: "string",
    DropdownComponent: true, // This will signal the UI to use a dropdown for this filter, with options derived from the data
  },
  leftBound: {
    id: "leftBound",
    label: "Left Bound",
    valueType: "date",
  },
  rightBound: {
    id: "rightBound",
    label: "Right Bound",
    valueType: "date",
  },
  flags: {
    id: "flags",
    label: "Flags",
    valueType: "flags",
    selectOptions: [
      { value: "escalated", label: "Escalated" },
      { value: "overdue", label: "Overdue" },
      { value: "notStarted", label: "Delayed start" },
    ],
    displayInModal: false,
  },
} satisfies Record<string, FilterFieldConfig>;

export type BatchAllFilterModel = Partial<
  Record<keyof typeof batchFilters, AnyFilter>
>;

// ============================================================================
// OPERATOR CONFIGS (for UI)
// ============================================================================

export const stringOperatorConfigs = [
  { value: "contains", label: "Contains" },
  { value: "equals", label: "Equals" },
  { value: "isIn", label: "Is in" },
] as const satisfies readonly {
  value: StringOperator;
  label: string;
}[];

export const numberOperatorConfigs = [
  { value: "between", label: "Between" },
  { value: "equals", label: "Equals" },
  { value: "greaterThan", label: "Greater than" },
  { value: "lessThan", label: "Less than" },
] as const satisfies readonly { value: NumberOperator; label: string }[];

export const dateOperatorConfigs = [
  { value: "between", label: "Between" },
  { value: "on", label: "On" },
  { value: "before", label: "Before" },
  { value: "after", label: "After" },
] as const satisfies readonly { value: DateOperator; label: string }[];

export const booleanOperatorConfigs = [
  { value: "is", label: "Is" },
] as const satisfies readonly { value: BooleanOperator; label: string }[];

export const flagsOperatorConfigs = [
  { value: "hasAny", label: "Has any" },
  { value: "hasAll", label: "Has all" },
  { value: "not", label: "Not" },
] as const satisfies readonly { value: FlagsOperator; label: string }[];

// ============================================================================
// DEFAULT OPERATORS
// ============================================================================

export const defaultOperators = {
  string: "contains" as StringOperator,
  number: "between" as NumberOperator,
  date: "between" as DateOperator,
  boolean: "is" as BooleanOperator,
  flags: "hasAny" as FlagsOperator,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getOperatorConfigsForType(
  valueType: FilterFieldConfig["valueType"]
) {
  switch (valueType) {
    case "string":
      return stringOperatorConfigs;
    case "number":
      return numberOperatorConfigs;
    case "date":
      return dateOperatorConfigs;
    case "boolean":
      return booleanOperatorConfigs;
    case "flags":
      return flagsOperatorConfigs;
  }
}

export function getOperatorsForType(valueType: FilterFieldConfig["valueType"]) {
  switch (valueType) {
    case "string":
      return stringOperators;
    case "number":
      return numberOperators;
    case "date":
      return dateOperators;
    case "boolean":
      return booleanOperators;
    case "flags":
      return flagsOperators;
  }
}

export function getDefaultOperatorForType(
  valueType: FilterFieldConfig["valueType"]
) {
  return defaultOperators[valueType];
}

export function countVisibleFilters<T extends Record<string, AnyFilter>>(
  filterModel: T
): number {
  return Object.keys(filterModel).filter((key) => {
    const fieldConfig = batchFilters[key as keyof typeof batchFilters];
    const filter = filterModel[key];
    const isVisible =
      (fieldConfig as FilterFieldConfig)?.displayInModal !== false;
    const hasValue = filter?.value != null;
    return isVisible && hasValue;
  }).length;
}

export const fieldOptionsResolver: Partial<
  Record<keyof typeof batchFilters, OptionsResolver<Batch>>
> = {
  responsiblePerson: (batches) => {
    const people = batches
      .flatMap((b) => b.Responsible_Person?.map((p) => p.Person) ?? [])
      .filter((p): p is string => typeof p === "string" && p.trim().length > 0);
    return [...new Set(people)].sort();
  },
};
