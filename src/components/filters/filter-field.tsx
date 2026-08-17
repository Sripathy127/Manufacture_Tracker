import { StringSingleFilter } from "./string/string-single-filter";
import { StringMultipleFilter } from "./string/string-multiple-filter";
import { NumberSingleFilter } from "./number/number-single-filter";
import { NumberTupleFilter } from "./number/number-tuple-filter";
import { DateSingleFilter } from "./date/date-single-filter";
import { DateRangeFilter } from "./date/date-range-filter";
import { BooleanSingleFilter } from "./boolean/boolean-single-filter";
import type { BatchAllFilterModel } from "@/lib/filter-model/config";
import type {
  FilterFieldConfig,
  StringFilter,
  NumberFilter,
  DateFilter,
  BooleanFilter,
  FlagsFilter,
} from "@/lib/filter-model/types";

interface FilterFieldProps<K extends keyof BatchAllFilterModel> {
  fieldConfig: FilterFieldConfig;
  filter: BatchAllFilterModel[K] | undefined;
  onChange: (filter: BatchAllFilterModel[K] | undefined) => void;
  resolvedOptions?: string[];
}

export function FilterField<K extends keyof BatchAllFilterModel>({
  fieldConfig,
  filter,
  onChange,
  resolvedOptions,
}: FilterFieldProps<K>) {
  const { valueType, selectOptions, DropdownComponent } = fieldConfig;

  // Render the appropriate input based on filter type or default
  switch (valueType) {
    case "string": {
      const stringFilter = filter as StringFilter | undefined;
      const operator = stringFilter?.operator || "contains";

      if (operator === "isIn") {
        const options = DropdownComponent ? resolvedOptions : selectOptions;

        return (
          <StringMultipleFilter
            value={Array.isArray(stringFilter?.value) ? stringFilter.value : []}
            onValueChange={(newValue) =>
              onChange({
                operator: "isIn",
                value: newValue.length > 0 ? newValue : null,
              } as BatchAllFilterModel[K])
            }
            selectOptions={options}
            isMultiSelect={DropdownComponent}
          />
        );
      } else {
        return (
          <StringSingleFilter
            value={
              typeof stringFilter?.value === "string" ? stringFilter.value : ""
            }
            onValueChange={(newValue) =>
              onChange({
                operator: operator,
                value: newValue.trim() === "" ? null : newValue,
              } as BatchAllFilterModel[K])
            }
            selectOptions={selectOptions}
          />
        );
      }
    }
    case "number": {
      const numberFilter = filter as NumberFilter | undefined;
      const operator = numberFilter?.operator || "equals";

      if (operator === "between") {
        return (
          <NumberTupleFilter
            value={
              Array.isArray(numberFilter?.value)
                ? (numberFilter.value as [number, number])
                : [0, 0]
            }
            onValueChange={(newValue) =>
              onChange({
                operator: "between",
                value: newValue,
              } as unknown as BatchAllFilterModel[K])
            }
          />
        );
      } else {
        return (
          <NumberSingleFilter
            value={
              typeof numberFilter?.value === "number"
                ? numberFilter.value
                : null
            }
            onValueChange={(newValue) =>
              onChange({
                operator: operator,
                value: newValue,
              } as unknown as BatchAllFilterModel[K])
            }
          />
        );
      }
    }
    case "date": {
      const dateFilter = filter as DateFilter | undefined;
      const operator = dateFilter?.operator || "between";

      if (operator === "between") {
        return (
          <DateRangeFilter
            value={
              Array.isArray(dateFilter?.value)
                ? (dateFilter.value as [Date | null, Date | null])
                : [null, null]
            }
            onValueChange={(newValue) =>
              onChange({
                operator: "between",
                value: newValue,
              } as BatchAllFilterModel[K])
            }
          />
        );
      } else {
        return (
          <DateSingleFilter
            value={dateFilter?.value instanceof Date ? dateFilter.value : null}
            onValueChange={(newValue) =>
              onChange({
                operator: operator,
                value: newValue,
              } as BatchAllFilterModel[K])
            }
          />
        );
      }
    }
    case "boolean": {
      const booleanFilter = filter as unknown as BooleanFilter | undefined;
      return (
        <BooleanSingleFilter
          value={
            typeof booleanFilter?.value === "boolean"
              ? booleanFilter.value
              : null
          }
          onValueChange={(newValue) =>
            onChange({
              operator: "is",
              value: newValue,
            } as unknown as BatchAllFilterModel[K])
          }
        />
      );
    }

    default:
      return null;
  }
}
