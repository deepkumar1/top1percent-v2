import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import type { ReactNode } from "react";

export function renderMarkdown(md: string): ReactNode {
  const processed = md.replace(/\\n/g, "\n");
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          if (match) {
            return (
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          }
          if (typeof children === "string" && !children.includes("\n")) {
            return (
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-medium text-primary" {...props}>
                {children}
              </code>
            );
          }
          return (
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code className={className} {...props}>{children}</code>
            </pre>
          );
        },
        a({ href, children }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">
              {children}
            </a>
          );
        },
        img({ src, alt }) {
          return <img src={src} alt={alt} className="rounded-lg" loading="lazy" />;
        },
      }}
    >
      {processed}
    </ReactMarkdown>
  );
}
