import { marked } from "marked";
import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
  bulletListMarker: "-",
});

turndown.addRule("strikethrough", {
  filter: ["s", "del", "strike"] as any,
  replacement: (content) => `~~${content}~~`,
});

keepAsHtml(["span", "img"]);

function keepAsHtml(tags: string[]) {
  for (const tag of tags) {
    turndown.addRule(tag, {
      filter: tag as any,
      replacement: (content, node) => {
        const el = node as HTMLElement;
        return el.outerHTML;
      },
    });
  }
}

export function markdownToHtml(md: string): string {
  if (!md) return "";
  const result = marked.parse(md, { async: false });
  return typeof result === "string" ? result : "";
}

export function htmlToMarkdown(html: string): string {
  if (!html) return "";
  return turndown.turndown(html);
}
