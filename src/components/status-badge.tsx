import type { ArticleStatus } from "@/lib/articles";
import { ARTICLE_STATUS_COLORS, ARTICLE_STATUS_LABELS } from "@/lib/articles";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        ARTICLE_STATUS_COLORS[status],
      )}
    >
      {ARTICLE_STATUS_LABELS[status]}
    </span>
  );
}
