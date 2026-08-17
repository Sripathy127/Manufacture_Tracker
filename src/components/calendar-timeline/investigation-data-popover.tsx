import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "../ui/popover";

import { ChevronRightIcon, XIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import {
  TypographyBody1,
  TypographyBody2,
  TypographyCaption2,
} from "../ui/typography";
import type {
  InvestigationBatchesDetails,
  ResponsiblePerson,
} from "@/entities";

const InvestigationsDataKeyLabelMap: Partial<
  Record<keyof InvestigationBatchesDetails, string>
> &
  Record<string, string> = {
  TitleShortDescription: "Title Short Description",
  batch: "Batch name",
  Responsible_Person: "Responsible Person",
  PrState: "PR State",
  RecordType: "Record Type",
  DateOpened: "Date Opened",
  OriginalDueDate: "Original Due Date",
  DueDate: "Due Date",
  DateClosed: "Date Closed",
};

export function BatchPopoverItem({
  batch,
  Responsible_Person,
}: {
  batch: InvestigationBatchesDetails;
  Responsible_Person?: ResponsiblePerson[] | null;
}) {
  const responsibleName =
    Responsible_Person?.find((p) => p.PR_ID === batch?.PR_ID)?.Person ?? "N/A";

  const batchWithResponsiblePerson = {
    ...batch,
    Responsible_Person: responsibleName,
  };

  return (
    <Popover>
      <PopoverTrigger className="flex gap-1">
        <TypographyCaption2 className="text-sm">
          {batchWithResponsiblePerson.PR_ID}
        </TypographyCaption2>
        <ChevronRightIcon className="inline size-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-90" />
      </PopoverTrigger>

      <PopoverContent
        side="right"
        className="min-w-100 "
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="p-2 border-b border-light-gray relative flex items-center">
          <TypographyBody1 className="font-bold flex-1 text-center">
            PR ID : {batchWithResponsiblePerson.PR_ID}
          </TypographyBody1>
          <PopoverClose className="absolute right-2 hover:bg-neutral-lighter-gray rounded-sm p-1">
            <XIcon className="size-4 " color="red" />
          </PopoverClose>
        </div>
        <ScrollArea className="h-80">
          <ul className="divide-y divide-neutral-lightest-gray">
            {Object.keys(InvestigationsDataKeyLabelMap).map((key) => {
              const value =
                batchWithResponsiblePerson[
                  key as keyof InvestigationBatchesDetails
                ];

              return (
                <li
                  key={key}
                  className="flex gap-2 py-3.5 pl-2.5 pr-3 justify-center"
                >
                  <TypographyBody2 className="text-text-gray-dark min-w-[140px]">
                    {
                      InvestigationsDataKeyLabelMap[
                        key as keyof InvestigationBatchesDetails
                      ]
                    }
                  </TypographyBody2>
                  <TypographyBody2 className="flex-1 text-neutral-black text-right">
                    {typeof value === "string" &&
                    /^\d{4}-\d{2}-\d{2}T/.test(value)
                      ? new Date(value).toLocaleDateString()
                      : value instanceof Date
                        ? value.toLocaleDateString()
                        : (value ?? "N/A")}
                  </TypographyBody2>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
