import { InfoIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import type { Batch } from "@/entities";
import { Drawer as DrawerPrimitive } from "vaul";
import { useLayoutEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Spinner } from "@/components/dot-spinner";

import {
  TypographyBody1,
  TypographyBody2,
  TypographyH2,
  TypographyH3,
} from "../ui/typography";
import {
  batchSummaryKeyLabelMap,
  batchSectionMap,
  batchValueFormatters,
  batchSummaryObjectConfig,
} from "./drawer-key-mapping";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiEndpoints } from "@/api/endpoints";
// import { getUserAccount } from "@/lib/auth/auth";
import { toast } from "sonner";

export function BatchDetailsDrawer({
  batch,
  open,
  onOpenChange,
  onClosed,
  containerRef,
  defaultTab,
}: {
  batch: Batch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClosed: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  defaultTab: string;
}) {
  const [bounds, setBounds] = useState({ top: 0, height: 0 });
  const isClosed = batch.status === "closed";
  const [commentInput, setCommentInput] = useState<string>("");
  const [localComments, setLocalComments] = useState<string[]>(
    Array.isArray(batch.comments) ? batch.comments : []
  );

  const { refetch: submitComment, isFetching: isSaving } = useQuery({
    queryKey: ["saveComment", apiEndpoints.comment, batch.batchId],
    enabled: false,
    queryFn: async () => {
      // Mock: simulate API delay since endpoint is not ready
      await new Promise((resolve) => setTimeout(resolve, 10000));
      return { success: true };
    },
  });

  const saveComment = async () => {
    const result = await submitComment();
    if (result.isSuccess) {
      const newComment: string = commentInput;
      setLocalComments((prev) => [newComment, ...prev]);
      setCommentInput("");
    } else {
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const handleCancel = () => {
    setCommentInput("");
  };

  useLayoutEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setBounds({ top: rect.top, height: rect.height });
      }
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds, true); // Capture phase to catch all scrolls

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds, true);
    };
  }, [containerRef]);

  const tabs = [
    { value: "details", label: "Details" },
    { value: "edit", label: "Edit" },
    { value: "comments", label: "Comments" },
  ];

  return (
    <DrawerPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      onAnimationEnd={(open) => {
        if (!open) onClosed();
      }}
      direction="right"
    >
      <DrawerPrimitive.Content
        className="fixed right-0 w-108 bg-white border-l rounded-tl-xl border-t flex flex-col z-30 shadow-drawer border-border-tertiary pt-2"
        style={{
          top: `${bounds.top}px`,
          height: `${bounds.height}px`,
        }}
      >
        <DrawerPrimitive.Close asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="close drawer"
            className="cursor-pointer ml-auto mr-2"
          >
            <XIcon className="size-5 " />
          </Button>
        </DrawerPrimitive.Close>
        <DrawerPrimitive.Title className="text-xl font-arboria-bold font-bold tracking-tight text-center  px-4 pb-3 mb-2">
          Batch {batch.batch}
        </DrawerPrimitive.Title>

        <div className="flex-1 overflow-y-auto px-4">
          <Tabs
            key={defaultTab}
            defaultValue={defaultTab}
            className="h-full flex flex-col"
          >
            <TabsList className="w-full rounded-none bg-transparent h-auto ">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 rounded-none border-0 border-b-3 border-gray-200  data-[state=active]:text-orange-100 text-text-gray-dark data-[state=active]:border-b-4 data-[state=active]:border-orange-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none bg-transparent pb-2"
                >
                  <TypographyBody1>{tab.label}</TypographyBody1>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent
              value="details"
              className="flex-1 overflow-y-auto px-4 pb-4"
            >
              {Object.entries(batchSectionMap).map(([section, keys]) => (
                <div key={section} className="mb-6">
                  <div className="border-b py-3.5 border-neutral-lightest-gray">
                    <TypographyH2>{section}</TypographyH2>
                  </div>
                  <ul className="divide-y divide-neutral-lightest-gray">
                    {keys.map((key) => {
                      const componentConfig =
                        batchSummaryObjectConfig[
                          key as keyof typeof batchSummaryObjectConfig
                        ];

                      if (componentConfig) {
                        const field = batch[key as keyof Batch];
                        if (!Array.isArray(field) || field.length === 0) {
                          return (
                            <li
                              key={key}
                              className="flex gap-2 py-3.5 pl-2.5 justify-center"
                            >
                              <TypographyBody2 className="text-text-gray-dark min-w-[140px]">
                                {batchSummaryKeyLabelMap[key]}
                              </TypographyBody2>
                              <TypographyBody2 className="flex-1 text-neutral-black text-right">
                                No details found
                              </TypographyBody2>
                            </li>
                          );
                        }
                        const items = field as Record<string, string>[];

                        return (
                          <>
                            <div className="flex gap-2 py-3.5 pl-2.5 justify-between">
                              <TypographyH3>
                                {componentConfig.idLabel}
                              </TypographyH3>
                              <TypographyH3>
                                {componentConfig.displayLabel}
                              </TypographyH3>
                            </div>
                            {items.map((item) => (
                              <li
                                key={item[componentConfig.idKey]}
                                className="flex gap-2 py-3.5 pl-2.5 justify-center"
                              >
                                <TypographyBody2 className="text-text-gray-dark min-w-[140px]">
                                  {item[componentConfig.idKey]}
                                </TypographyBody2>
                                <TypographyBody2 className="flex-1 text-neutral-black text-right">
                                  {item[componentConfig.displayKey]}
                                </TypographyBody2>
                              </li>
                            ))}
                          </>
                        );
                      }

                      const value = batch[key];
                      const formattedValue = batchValueFormatters[key]
                        ? batchValueFormatters[key]!(value)
                        : value;
                      return (
                        <li
                          key={key}
                          className="flex gap-2 py-3.5 pl-2.5 justify-center"
                        >
                          <TypographyBody2 className="text-text-gray-dark min-w-[140px]">
                            {batchSummaryKeyLabelMap[key] ?? key}
                          </TypographyBody2>

                          <TypographyBody2 className="flex-1 text-neutral-black text-right">
                            {formattedValue === null
                              ? "NA"
                              : formattedValue instanceof Date
                                ? formattedValue.toLocaleDateString()
                                : String(formattedValue)}
                          </TypographyBody2>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="edit" className="flex-1 overflow-y-auto p-4">
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </TabsContent>

            <TabsContent
              value="comments"
              className={cn(
                "flex-1 p-4 overflow-y-auto ",
                !isClosed && "max-h-[calc(100%-150px)]"
              )}
            >
              {/* <p className="text-sm text-muted-foreground">Coming soon</p> */}
              {isClosed && (
                <div className="border rounded-md border-bg-info bg-bg-info  bg-opacity-50 p-1">
                  <div className="flex flex-row gap-2 items-center  ">
                    <InfoIcon className="size-5 text-black mb-2" />
                    <TypographyH2 className=" p-2">
                      No new comments
                    </TypographyH2>
                  </div>
                  <TypographyBody1 className="text-sm mb-4 p-2">
                    This batch is closed so you can't comment on it anymore
                  </TypographyBody1>
                </div>
              )}
              {!isClosed && (
                <div className=" bg-white">
                  <TypographyH2 className="mb-2 p-2">
                    Add a comment
                  </TypographyH2>
                  <textarea
                    className="w-full border rounded-md p-2 mb-2 text-xl text-neutral-dark-gray"
                    placeholder="Start typing..."
                    disabled={isClosed || isSaving}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                </div>
              )}
              <TypographyH2 className="mb-2 p-2">Comments</TypographyH2>
              {isSaving && (
                <div className="border-b p-2 items-center justify-center gap-2 flex">
                  <Spinner />
                  <TypographyH2>Saving comment...</TypographyH2>
                </div>
              )}
              {localComments && localComments.length > 0 ? (
                <ul className="space-y-2">
                  {localComments.map((comment, index) => (
                    <li
                      key={index}
                      className=" border-b p-2 gap-2 flex flex-col"
                    >
                      {/* <TypographyCaption1 className="text-sm text-neutral-dark-gray">
                        {new Date(comment.date).toLocaleString()}
                      </TypographyCaption1>
                      <TypographyCaption1 className="text-sm text-neutral-dark-gray">
                        By: {comment.user}
                      </TypographyCaption1> */}

                      <TypographyBody1 className="text-black">
                        {comment}
                      </TypographyBody1>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No comments available
                </p>
              )}
              {!isClosed && (
                <div className="flex flex-row gap-2 mt-auto  fixed bottom-0 left-0 w-full p-4">
                  <Button
                    variant={"default"}
                    className="flex flex-1 bg-white border border-orange-100 text-orange-100 hover:bg-orange-60 hover:text-white "
                    disabled={isSaving}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={"default"}
                    className="flex flex-1 bg-orange-100 hover:bg-orange-200 text-white"
                    disabled={isSaving || !commentInput.trim()}
                    onClick={saveComment}
                  >
                    Save
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Root>
  );
}
