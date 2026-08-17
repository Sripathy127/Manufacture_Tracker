// import { useCallback, useMemo } from "react";
// import useLocalStorageState from "use-local-storage-state";
// import {
//   BATCH_ALL_FILTER_MODEL_STORAGE_KEY,
//   getBatchAllFilterModelFromStorage,
// } from "@/lib/batch-all-filter-model-store";
// import {
//   stringOperators,
//   dateOperators,
//   numberOperators,
//   booleanOperators,
//   flagsOperators,
// } from "@/lib/filter-model/operators";
// import type { Batch } from "@/entities";
// import type { BatchAllFilterModel } from "@/lib/filter-model/config";

// export function useBatchAllFilterModel() {
//   const [filterModel, setFilterModel] =
//     useLocalStorageState<BatchAllFilterModel>(
//       BATCH_ALL_FILTER_MODEL_STORAGE_KEY,
//       {
//         defaultValue: getBatchAllFilterModelFromStorage(),
//         serializer: {
//           stringify: (value: unknown) => JSON.stringify(value),
//           parse: (text: string) =>
//             JSON.parse(text, (_key, value) => {
//               // Revive Date objects
//               if (
//                 typeof value === "string" &&
//                 /^\d{4}-\d{2}-\d{2}T/.test(value)
//               ) {
//                 return new Date(value);
//               }
//               return value;
//             }),
//         },
//       }
//     );

//   const setFilter = useCallback(
//     <K extends keyof BatchAllFilterModel>(
//       field: K,
//       filter: BatchAllFilterModel[K] | null
//     ) => {
//       setFilterModel((current: BatchAllFilterModel) => {
//         const updated = { ...current };
//         if (filter === null) {
//           delete updated[field];
//         } else {
//           updated[field] = filter;
//         }
//         return updated;
//       });
//     },
//     [setFilterModel]
//   );

//   const clearFilter = useCallback(
//     (field: keyof BatchAllFilterModel) => {
//       setFilter(field, null);
//     },
//     [setFilter]
//   );

//   const clearAllFilters = useCallback(() => {
//     setFilterModel({});
//   }, [setFilterModel]);

//   const activeFilters = useMemo(() => {
//     return Object.entries(filterModel).map(([fieldKey, filter]) => {
//       if (!filter) return () => true;

//       // Special handling for flags - it's a composite filter that operates on the batch itself
//       if (fieldKey === "flags") {
//         // Skip if empty array - not an active filter, just preserving operator preference
//         if (Array.isArray(filter.value) && filter.value.length === 0) {
//           return () => true;
//         }
//         const operators = flagsOperators;
//         // @ts-expect-error for type narrowing
//         const filterFn = operators[filter.operator];
//         if (!filterFn) return () => true;
//         return (batch: Batch) => filterFn(filter.value)(batch) as boolean;
//       }

//       const operators =
//         filter.operator in stringOperators
//           ? stringOperators
//           : filter.operator in dateOperators
//             ? dateOperators
//             : filter.operator in numberOperators
//               ? numberOperators
//               : filter.operator in booleanOperators
//                 ? booleanOperators
//                 : null;
//       if (!operators) return () => true;
//       // @ts-expect-error for type narrowing
//       const filterFn = operators[filter.operator];
//       if (!filterFn) return () => true;

//       return (batch: Batch) =>
//         filterFn(filter.value)(batch[fieldKey as keyof Batch]) as boolean;
//     });
//   }, [filterModel]);

//   return {
//     activeFilters,
//     filterModel,
//     setFilterModel,
//     setFilter,
//     clearFilter,
//     clearAllFilters,
//   };
// }

import { useCallback, useMemo } from "react";
import useLocalStorageState from "use-local-storage-state";

import {
  BATCH_ALL_FILTER_MODEL_STORAGE_KEY,
  getBatchAllFilterModelFromStorage,
} from "@/lib/batch-all-filter-model-store";

import {
  stringOperators,
  dateOperators,
  numberOperators,
  booleanOperators,
  flagsOperators,
} from "@/lib/filter-model/operators";

import type { Batch } from "@/entities";
import type { BatchAllFilterModel } from "@/lib/filter-model/config";

type OperatorFn = (filterValue: unknown) => (rowValue: unknown) => boolean;
type OperatorTable = Record<string, OperatorFn>;

const pickOperators = (op: string): OperatorTable | null => {
  if (op in stringOperators) return stringOperators as unknown as OperatorTable;
  if (op in dateOperators) return dateOperators as unknown as OperatorTable;
  if (op in numberOperators) return numberOperators as unknown as OperatorTable;
  if (op in booleanOperators)
    return booleanOperators as unknown as OperatorTable;
  return null;
};

// Map filter-model keys -> actual Batch fields when names differ
const fieldAccessors: Partial<
  Record<keyof BatchAllFilterModel, (b: Batch) => unknown>
> = {
  responsiblePerson: (b) => b.Responsible_Person,
};

export function useBatchAllFilterModel() {
  const [filterModel, setFilterModel] =
    useLocalStorageState<BatchAllFilterModel>(
      BATCH_ALL_FILTER_MODEL_STORAGE_KEY,
      {
        defaultValue: getBatchAllFilterModelFromStorage(),
        serializer: {
          stringify: (value: unknown) => JSON.stringify(value),
          parse: (text: string) =>
            JSON.parse(text, (_key, value) => {
              if (
                typeof value === "string" &&
                /^\d{4}-\d{2}-\d{2}T/.test(value)
              ) {
                return new Date(value);
              }
              return value;
            }),
        },
      }
    );

  const setFilter = useCallback(
    <K extends keyof BatchAllFilterModel>(
      field: K,
      filter: BatchAllFilterModel[K] | null
    ) => {
      setFilterModel((current: BatchAllFilterModel) => {
        const updated = { ...current };
        if (filter === null) delete updated[field];
        else updated[field] = filter;
        return updated;
      });
    },
    [setFilterModel]
  );

  const clearFilter = useCallback(
    (field: keyof BatchAllFilterModel) => {
      setFilter(field, null);
    },
    [setFilter]
  );

  const clearAllFilters = useCallback(() => {
    setFilterModel({});
  }, [setFilterModel]);

  const activeFilters = useMemo(() => {
    return Object.entries(filterModel).map(([fieldKey, filter]) => {
      if (!filter) return () => true;

      // Special handling for flags (operates on whole batch)
      if (fieldKey === "flags") {
        if (Array.isArray(filter.value) && filter.value.length === 0)
          return () => true;

        const filterFn = (flagsOperators as unknown as OperatorTable)[
          filter.operator
        ];
        if (!filterFn) return () => true;

        return (batch: Batch) => filterFn(filter.value)(batch);
      }

      const operators = pickOperators(filter.operator);
      if (!operators) return () => true;

      const filterFn = operators[filter.operator];
      if (!filterFn) return () => true;

      return (batch: Batch) => {
        const accessor = fieldAccessors[fieldKey as keyof BatchAllFilterModel];

        // If we have an accessor, use it; otherwise fall back to direct Batch field access.
        const rowValue = accessor
          ? accessor(batch)
          : batch[fieldKey as keyof Batch];

        return filterFn(filter.value)(rowValue);
      };
    });
  }, [filterModel]);

  return {
    activeFilters,
    filterModel,
    setFilterModel,
    setFilter,
    clearFilter,
    clearAllFilters,
  };
}
