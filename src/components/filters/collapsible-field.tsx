"use client";

import * as React from "react";
import { ChevronDownIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { OperatorSelector } from "./operator-selector";
import {
  getOperatorConfigsForType,
  type BatchAllFilterModel,
} from "@/lib/filter-model/config";
import type { FilterFieldConfig } from "@/lib/filter-model/types";
import { FilterField } from "./filter-field";
import { TypographyH3 } from "../ui/typography";

export function CollapsibleField({
  fieldConfig,
  currentOperator,
  currentFilter,
  fieldKey,
  handleFilterChange,
  resolvedOptions,
}: {
  fieldConfig: FilterFieldConfig;
  currentOperator: string;
  currentFilter: BatchAllFilterModel[keyof BatchAllFilterModel];
  fieldKey: keyof BatchAllFilterModel;
  handleFilterChange: <K extends keyof BatchAllFilterModel>(
    fieldKey: K,
    filter: BatchAllFilterModel[K] | undefined
  ) => void;
  resolvedOptions?: string[];
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const operators = getOperatorConfigsForType(fieldConfig.valueType);
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-full flex-col gap-2"
    >
      <CollapsibleTrigger asChild>
        <div className="group flex items-center justify-between gap-4 px-2">
          <TypographyH3 className="text-neutral-darker-gray">
            {fieldConfig.label}
          </TypographyH3>
          <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="flex flex-col gap-2 px-2">
        <OperatorSelector
          operator={currentOperator}
          operators={operators}
          onOperatorChange={(newOperator) => {
            // Determine appropriate value based on operator type
            let newValue: unknown = currentFilter?.value ?? null;

            // Handle transitions based on new operator type
            if (newOperator === "between") {
              // Switching to "between" - requires tuple value
              if (fieldConfig.valueType === "date") {
                newValue = [null, null];
              } else {
                // number type
                newValue = [0, 0];
              }
            } else if (newOperator === "isIn") {
              // Switching to "isIn" - requires array value
              newValue = [];
            } else if (newOperator === "hasAny" || newOperator === "hasAll") {
              // Switching to flags operators - requires array value
              newValue = [];
            } else if (
              currentFilter?.operator === "between" ||
              currentFilter?.operator === "isIn" ||
              currentFilter?.operator === "hasAny" ||
              currentFilter?.operator === "hasAll"
            ) {
              // Switching from "between", "isIn", or flags operators to single value operator
              newValue = null;
            }

            handleFilterChange(fieldKey, {
              operator: newOperator,
              value: newValue,
            } as BatchAllFilterModel[typeof fieldKey]);
          }}
        />
        <div className="flex flex-row items-center gap-2">
          <div className="w-80">
            <FilterField
              fieldConfig={fieldConfig}
              filter={currentFilter}
              onChange={(filter) => handleFilterChange(fieldKey, filter)}
              resolvedOptions={resolvedOptions}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground ml-auto"
            onClick={() => handleFilterChange(fieldKey, undefined)}
            aria-label={`Clear ${fieldConfig.label} filter`}
            title={`Clear ${fieldConfig.label} filter`}
          >
            <X className="h-4 w-4 " stroke="var(--color-orange-100)" />
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
