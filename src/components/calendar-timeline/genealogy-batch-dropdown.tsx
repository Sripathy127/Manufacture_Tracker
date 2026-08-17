import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { TypographyCaption1, TypographyCaption2 } from "../ui/typography";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";

export function GenealogyBatchDropdown({
  Batchlist,
  placeholder,
}: {
  Batchlist: string[] | null;
  placeholder: string;
}) {
  const handleCopy = async (batchName: string) => {
    try {
      await navigator.clipboard.writeText(batchName);
      toast.info("Copied to clipboard", {
        description: `${batchName} `,
        duration: 1500,
      });
    } catch (e) {
      toast.error("Error", {
        description: "Please try again.",
        duration: 1500,
      });
      console.warn("Failed to copy text: ", e);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group px-1 ">
        <div
          role="button"
          className="hover:bg-neutral-lighter-gray rounded-sm px-2 "
        >
          <TypographyCaption1>
            {Batchlist?.length} Batches
            <ChevronDownIcon className="inline size-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180  ml-1" />
          </TypographyCaption1>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-60">
        <DropdownMenuLabel className="font-bold px-2  ">
          <div className="flex items-center justify-center">{placeholder}</div>
        </DropdownMenuLabel>
        <ScrollArea className=" h-25 ">
          {!Batchlist ||
            (Batchlist.length < 1 && (
              <div className="p-2 text-sm italic text-neutral-gray-tone flex items-center justify-center">
                No batches available
              </div>
            ))}
          {Batchlist?.map((batchName) => (
            <DropdownMenuItem
              key={batchName}
              className=" border-b border-light-gray items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCopy(batchName);
              }}
            >
              <TypographyCaption2 className="text-xs">
                {batchName}
              </TypographyCaption2>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
