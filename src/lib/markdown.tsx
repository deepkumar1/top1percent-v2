import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import type { ReactNode } from "react";

export function renderMarkdown(md: string): ReactNode {
  const processed = md.replace(/\\n/g, "\n");
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1({ children, ...props }) {
          return <h1 className="font-serif text-3xl font-semibold tracking-tight mt-8 mb-4" {...props}>{children}</h1>;
        },
        h2({ children, ...props }) {
          return <h2 className="font-serif text-2xl font-semibold tracking-tight mt-6 mb-3" {...props}>{children}</h2>;
        },
        h3({ children, ...props }) {
          return <h3 className="font-serif text-xl font-semibold tracking-tight mt-5 mb-2" {...props}>{children}</h3>;
        },
        h4({ children, ...props }) {
          return <h4 className="font-serif text-lg font-semibold mt-4 mb-2" {...props}>{children}</h4>;
        },
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          if (match) {
            return (
              <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-sm leading-relaxed">
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
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-sm leading-relaxed">
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
          if (!src) return null;
          return <img src={src} alt={alt || ""} className="mx-auto rounded-lg" loading="lazy" />;
        },
      }}
    >
      {processed}
    </ReactMarkdown>
  );
}
