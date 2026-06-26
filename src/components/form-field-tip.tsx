import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function FormFieldTip({
  htmlFor,
  label,
  tooltip,
  required,
}: {
  htmlFor: string;
  label: string;
  tooltip: string;
  required?: boolean;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Help: ${label}`}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-left">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
