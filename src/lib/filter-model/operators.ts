import { isAfter, isBefore, isSameDay } from "date-fns";
import type { ResponsiblePerson } from "@/entities";

const toStringArray = (value: unknown): string[] => {
  if (value == null) return [];

  if (typeof value === "string") return [value];

  if (Array.isArray(value)) {
    const out: string[] = [];

    for (const item of value) {
      if (typeof item === "string") {
        const s = item.trim();
        if (s) out.push(s);
        continue;
      }

      if (item && typeof item === "object" && "Person" in item) {
        const person = (item as ResponsiblePerson).Person;
        if (typeof person === "string" && person.trim())
          out.push(person.trim());
      }
    }

    return out;
  }

  return [];
};

const norm = (s: string) => s.trim().toLowerCase();

// String operators - all accept null and return no-op filter
// export const stringOperators = {
//   equals: (filterValue: string | null) => {
//     if (filterValue === null) return () => true;
//     return (value: string) => {
//       if (Array.isArray(value)) {
//         return value.some((v) => v.toLowerCase() === filterValue.toLowerCase());
//       }
//       return value?.toLowerCase() === filterValue.toLowerCase();
//     };
//   },
//   contains: (filterValue: string | null) => {
//     if (filterValue === null) return () => true;
//     return (value: string) => {
//       if (Array.isArray(value)) {
//         return value.some((v) =>
//           v.toLowerCase().includes(filterValue.toLowerCase())
//         );
//       }
//       return value.toLowerCase().includes(filterValue.toLowerCase());
//     };
//   },
//   isIn: (filterValue: string[] | null) => {
//     if (filterValue === null || filterValue.length === 0) return () => true;
//     return (value: string | string[]) => {
//       // Handle array values (like responsiblePerson)
//       if (Array.isArray(value)) {
//         return value.some((v) =>
//           filterValue.some((fv) => fv?.toLowerCase() === v?.toLowerCase())
//         );
//       }

//       // Handle string values
//       return filterValue.some(
//         (fv) => fv?.toLowerCase() === value?.toLowerCase()
//       );
//     };
//   },
// } as const;

export const stringOperators = {
  equals: (filterValue: string | null) => {
    if (!filterValue?.trim()) return () => true;
    const fv = norm(filterValue);
    return (value: unknown) => toStringArray(value).some((v) => norm(v) === fv);
  },

  contains: (filterValue: string | null) => {
    if (!filterValue?.trim()) return () => true;
    const fv = norm(filterValue);
    return (value: unknown) =>
      toStringArray(value).some((v) => norm(v).includes(fv));
  },
  isIn: (filterValue: string[] | null) => {
    if (!filterValue?.length) return () => true;
    const set = new Set(filterValue.filter(Boolean).map(norm));
    return (value: unknown) =>
      toStringArray(value).some((v) => set.has(norm(v)));
  },
} as const;

// Number operators - all accept null and return no-op filter
export const numberOperators = {
  equals: (filterValue: number | null) => {
    if (filterValue === null) return () => true;
    return (value: number) => value === filterValue;
  },
  greaterThan: (filterValue: number | null) => {
    if (filterValue === null) return () => true;
    return (value: number) => value > filterValue;
  },
  lessThan: (filterValue: number | null) => {
    if (filterValue === null) return () => true;
    return (value: number) => value < filterValue;
  },
  between: (filterValue: [number, number] | null) => {
    if (filterValue === null) return () => true;
    const [start, end] = filterValue;
    return (value: number) => value >= start && value <= end;
  },
} as const;

// Date operators - all accept null and return no-op filter
export const dateOperators = {
  before: (filterValue: Date | null) => {
    if (filterValue === null) return () => true;
    return (value: Date) => isBefore(value, filterValue);
  },
  after: (filterValue: Date | null) => {
    if (filterValue === null) return () => true;
    return (value: Date) => !isBefore(value, filterValue);
  },
  on: (filterValue: Date | null) => {
    if (filterValue === null) return () => true;
    return (value: Date) => isSameDay(value, filterValue);
  },
  between: (filterValue: [Date | null, Date | null] | null) => {
    if (filterValue === null) return () => true;
    const [start, end] = filterValue;
    if (start === null && end === null) return () => true;
    return (value: Date) => {
      if (start === null && end !== null) return !isAfter(value, end);
      if (start !== null && end === null) return !isBefore(value, start);
      return !isBefore(value, start as Date) && !isAfter(value, end as Date);
    };
  },
} as const;

// Boolean operators - accept null and return no-op filter
export const booleanOperators = {
  is: (filterValue: boolean | null) => {
    if (filterValue === null) return () => true;
    return (value: boolean) => value === filterValue;
  },
} as const;

// Flags operators - composite filter that checks multiple batch flags
export const flagsOperators = {
  hasAny: (filterValue: string[] | null) => {
    if (filterValue === null || filterValue.length === 0) return () => true;
    return (batch: {
      overdue: string;
      etsEscalation: string;
      notStarted: string;
    }) => {
      return filterValue.some((flag) => {
        if (flag === "escalated")
          return (
            batch.etsEscalation === "T" &&
            batch.overdue !== "T" &&
            batch.notStarted !== "T"
          ); // Escalated but not overdue or not started
        if (flag === "overdue")
          return (
            batch.overdue === "T" &&
            batch.etsEscalation !== "T" &&
            batch.notStarted !== "T"
          ); // Overdue but not escalated or not started
        if (flag === "notStarted")
          return (
            batch.notStarted === "T" &&
            batch.etsEscalation !== "T" &&
            batch.overdue !== "T"
          ); // Not started but not escalated or overdue

        return false;
      });
    };
  },
  hasAll: (filterValue: string[] | null) => {
    if (filterValue === null || filterValue.length === 0) return () => true;
    return (batch: {
      overdue: string;
      etsEscalation: string;
      notStarted: string;
    }) => {
      return filterValue.every((flag) => {
        if (flag === "escalated") return batch.etsEscalation === "T";
        if (flag === "overdue") return batch.overdue === "T";
        if (flag === "notStarted") return batch.notStarted === "T";
        return false;
      });
    };
  },
  not: (filterValue: string[] | null) => {
    if (filterValue === null || filterValue.length === 0) return () => true;
    return (batch: {
      overdue: string;
      etsEscalation: string;
      notStarted: string;
    }) => {
      return !filterValue.some((flag) => {
        if (flag === "escalated") return batch.etsEscalation === "T";
        if (flag === "overdue") return batch.overdue === "T";
        if (flag === "notStarted") return batch.notStarted === "T";
        return false;
      });
    };
  },
} as const;
