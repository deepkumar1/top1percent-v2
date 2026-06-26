import {
  Bold,
  Code,
  Code2,
  Heading2,
  Heading3,
  Image,
  Link,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type MarkdownInsert = {
  before: string;
  after: string;
  placeholder?: string;
  block?: boolean;
};

export const MARKDOWN_TOOLS: {
  id: string;
  label: string;
  tooltip: string;
  icon: React.ComponentType<{ className?: string }>;
  insert: MarkdownInsert;
}[] = [
  {
    id: "h2",
    label: "Heading 2",
    tooltip: "Section heading — type ## Your heading",
    icon: Heading2,
    insert: { before: "## ", after: "", placeholder: "Section heading", block: true },
  },
  {
    id: "h3",
    label: "Heading 3",
    tooltip: "Subsection heading — type ### Your subheading",
    icon: Heading3,
    insert: { before: "### ", after: "", placeholder: "Subsection heading", block: true },
  },
  {
    id: "bold",
    label: "Bold",
    tooltip: "Bold text — wrap with **double asterisks**",
    icon: Bold,
    insert: { before: "**", after: "**", placeholder: "bold text" },
  },
  {
    id: "inline-code",
    label: "Inline code",
    tooltip: "Inline code — wrap with `backticks`",
    icon: Code,
    insert: { before: "`", after: "`", placeholder: "code" },
  },
  {
    id: "code-block",
    label: "Code block",
    tooltip: "Multi-line code — wrap with ``` opening and closing fences",
    icon: Code2,
    insert: {
      before: "```\n",
      after: "\n```",
      placeholder: "your code here",
      block: true,
    },
  },
  {
    id: "ul",
    label: "Bullet list",
    tooltip: "Unordered list — start each line with - or *",
    icon: List,
    insert: { before: "- ", after: "", placeholder: "List item", block: true },
  },
  {
    id: "ol",
    label: "Numbered list",
    tooltip: "Ordered list — start each line with 1. 2. 3.",
    icon: ListOrdered,
    insert: { before: "1. ", after: "", placeholder: "List item", block: true },
  },
  {
    id: "quote",
    label: "Blockquote",
    tooltip: "Quote — start the line with >",
    icon: Quote,
    insert: { before: "> ", after: "", placeholder: "Quoted text", block: true },
  },
  {
    id: "link",
    label: "Link",
    tooltip: "Hyperlink — use [label](url)",
    icon: Link,
    insert: { before: "[", after: "](https://)", placeholder: "link text" },
  },
  {
    id: "image",
    label: "Image",
    tooltip: "Image — use ![alt text](image-url)",
    icon: Image,
    insert: { before: "![", after: "](https://)", placeholder: "alt text" },
  },
];

type MarkdownToolbarProps = {
  onInsert: (insert: MarkdownInsert) => void;
};

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  return (
    <div className="flex flex-wrap gap-1 rounded-t-lg border border-b-0 border-border bg-muted/40 p-2">
      {MARKDOWN_TOOLS.map((tool) => (
        <Tooltip key={tool.id}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label={tool.label}
              onClick={() => onInsert(tool.insert)}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-left">
            <p className="font-medium">{tool.label}</p>
            <p className="mt-0.5 text-primary-foreground/80">{tool.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export function applyMarkdownInsert(
  content: string,
  selectionStart: number,
  selectionEnd: number,
  insert: MarkdownInsert,
): { value: string; cursorStart: number; cursorEnd: number } {
  const selected = content.slice(selectionStart, selectionEnd);
  const placeholder = selected || insert.placeholder || "";
  const snippet = `${insert.before}${placeholder}${insert.after}`;

  const value =
    content.slice(0, selectionStart) + snippet + content.slice(selectionEnd);

  const cursorStart = selectionStart + insert.before.length;
  const cursorEnd = cursorStart + placeholder.length;

  return { value, cursorStart, cursorEnd };
}
