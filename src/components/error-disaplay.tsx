import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, RefreshCcwIcon } from "lucide-react";

export function ErrorDisplay({
  error,
  title = "Something went wrong",
  description,
  statusCode,
  onRetry,
  retryLabel = "Try Again",
  fullScreen = true,
}: {
  error: Error | unknown;
  title?: string;
  description?: string;
  statusCode?: number;
  onRetry?: () => void;
  retryLabel?: string;
  showLogout?: boolean;
  fullScreen?: boolean;
}) {
  const handleRetry = onRetry || (() => window.location.reload());

  // Extract error message
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "An unexpected error occurred. Please try again.";

  // Extract stack trace for development
  const errorStack = error instanceof Error ? error.stack : undefined;

  const containerClass = fullScreen
    ? "flex min-h-screen items-center justify-center bg-background p-4"
    : "flex flex-1 items-center justify-center bg-background p-4";

  return (
    <div className={containerClass}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangleIcon className="size-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {(description || statusCode) && (
            <CardDescription
              className={statusCode ? "text-lg font-semibold" : ""}
            >
              {statusCode ? `Status Code: ${statusCode}` : description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">{errorMessage}</p>
          {errorStack && import.meta.env.DEV && (
            <details className="mt-4 rounded-md bg-muted p-3 text-xs">
              <summary className="cursor-pointer font-semibold">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 overflow-auto whitespace-pre-wrap wrap-break-word">
                {errorStack}
              </pre>
            </details>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            className="flex-1 bg-btn-primary hover:bg-btn-primary-hover active:bg-btn-primary-select"
            onClick={handleRetry}
          >
            <RefreshCcwIcon className="mr-2" />
            {retryLabel}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
