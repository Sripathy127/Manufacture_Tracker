// ============================================================================
// OPERATOR TYPE DEFINITIONS
// ============================================================================

import type {
  booleanOperators,
  dateOperators,
  numberOperators,
  stringOperators,
} from "./operators";

export type StringOperator = keyof typeof stringOperators;
export type NumberOperator = keyof typeof numberOperators;
export type DateOperator = keyof typeof dateOperators;
export type BooleanOperator = keyof typeof booleanOperators;
export type FlagsOperator = "hasAny" | "hasAll" | "not";
export type DropdownOperator = "isIn";

// ============================================================================
// FILTER VALUE TYPES
// ============================================================================

export type StringFilterValue = string | null | string[];
export type NumberFilterValue = number | null | [number, number];
export type DateFilterValue = Date | null | [Date, Date];
export type BooleanFilterValue = boolean | null;
export type FlagsFilterValue = string[] | null;
export type DropdownFilterValue = string[] | null;

// ============================================================================
// FILTER TYPES
// ============================================================================

export type StringFilter = {
  operator: StringOperator;
  value: StringFilterValue;
};

export type NumberFilter = {
  operator: NumberOperator;
  value: NumberFilterValue;
};

export type DateFilter = {
  operator: DateOperator;
  value: DateFilterValue;
};

export type BooleanFilter = {
  operator: BooleanOperator;
  value: BooleanFilterValue;
};

export type FlagsFilter = {
  operator: FlagsOperator;
  value: FlagsFilterValue;
};

export type DropdownFilter = {
  operator: "isIn";
  value: string[] | null;
};

export type AnyFilter =
  | StringFilter
  | NumberFilter
  | DateFilter
  | BooleanFilter
  | FlagsFilter
  | DropdownFilter;

// ============================================================================
// FILTER CONFIG TYPE
// ============================================================================

export type FilterFieldConfig = {
  id: string;
  label: string;
  valueType: "string" | "number" | "date" | "boolean" | "flags";
  selectOptions?: ReadonlyArray<{
    readonly value: string;
    readonly label: string;
  }>;
  DropdownComponent?: boolean; // Indicates if a dropdown should be used for this filter
  displayInModal?: boolean; // Controls whether the filter is shown in the UI modal (defaults to true)
};

/**========================================================
 * A function that extracts dropdown options from raw data.
 * Generic so it works with Batch today, any entity tomorrow.
 ===========================================================*/
export type OptionsResolver<T = unknown> = (data: T[]) => string[];
