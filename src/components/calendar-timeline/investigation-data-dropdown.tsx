import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  type InvestigationBatchesDetails,
  type ResponsiblePerson,
} from "@/entities";
import { ScrollArea } from "../ui/scroll-area";
import { TypographyCaption1 } from "../ui/typography";
import { ChevronDownIcon } from "lucide-react";
import { BatchPopoverItem } from "./investigation-data-popover";
export function InvestigationsDropdown({
  Batchlist,
  Title,
  Responsible_Person,
}: {
  Batchlist: InvestigationBatchesDetails[] | null;
  Title: string;
  Responsible_Person?: ResponsiblePerson[] | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group px-1 ">
        <div
          role="button"
          className="hover:bg-neutral-lighter-gray rounded-sm px-2 "
        >
          <TypographyCaption1>
            {Batchlist?.length ?? 0} Investigations
            <ChevronDownIcon className="inline size-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180  ml-1" />
          </TypographyCaption1>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-60">
        <DropdownMenuLabel className="font-bold px-2 border-b border-light-gray">
          <div className="flex items-center justify-center">{`${Title} Investigations`}</div>
        </DropdownMenuLabel>
        <ScrollArea className=" h-25 ">
          {!Batchlist ||
            (Batchlist.length === 0 && (
              <div className="p-2 text-sm italic text-neutral-gray-tone flex items-center justify-center">
                No batches available
              </div>
            ))}
          {Batchlist?.map((batch) => (
            <DropdownMenuItem
              key={batch.batch}
              className=" border-b border-light-gray items-center justify-center group"
              onSelect={(e) => e.preventDefault()}
            >
              <BatchPopoverItem
                batch={batch}
                Responsible_Person={Responsible_Person}
              />
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
