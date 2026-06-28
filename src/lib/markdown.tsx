import type { ReactNode } from "react";

type MarkdownBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "pre"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function processInline(text: string) {
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

export function renderMarkdown(md: string): ReactNode[] {
  const blocks: MarkdownBlock[] = [];
  const lines = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  let buf: string[] = [];
  let inCode = false;
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  const flush = () => {
    if (!buf.length) return;
    const text = buf.join("\n").trim();
    if (text) blocks.push({ type: "p", text });
    buf = [];
  };

  const flushList = () => {
    if (currentList && currentList.items.length > 0) {
      blocks.push({ type: currentList.type, items: [...currentList.items] });
    }
    currentList = null;
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "pre", text: buf.join("\n") });
        buf = [];
        inCode = false;
      } else {
        flush();
        flushList();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      buf.push(line);
      continue;
    }

    if (line.startsWith("## ")) {
      flush();
      flushList();
      blocks.push({ type: "h2", text: line.slice(3) });
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      flushList();
      blocks.push({ type: "h3", text: line.slice(4) });
      continue;
    }
    if (line.startsWith("> ")) {
      flush();
      flushList();
      blocks.push({ type: "blockquote", text: line.slice(2) });
      continue;
    }

    const ulMatch = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (ulMatch) {
      flush();
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(ulMatch[2]);
      continue;
    }

    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      flush();
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(olMatch[2]);
      continue;
    }

    if (line.trim() === "") {
      flush();
      flushList();
      continue;
    }

    flushList();
    buf.push(line);
  }

  flush();
  flushList();

  return blocks.map((b, i) => {
    if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
    if (b.type === "h3") return <h3 key={i}>{b.text}</h3>;
    if (b.type === "blockquote") return <blockquote key={i}>{b.text}</blockquote>;
    if (b.type === "pre")
      return (
        <pre key={i}>
          <code>{b.text}</code>
        </pre>
      );
    if (b.type === "ul") {
      return (
        <ul key={i}>
          {b.items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: processInline(item) }} />
          ))}
        </ul>
      );
    }
    if (b.type === "ol") {
      return (
        <ol key={i}>
          {b.items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: processInline(item) }} />
          ))}
        </ol>
      );
    }
    return <p key={i} dangerouslySetInnerHTML={{ __html: processInline(b.text) }} />;
  });
}
