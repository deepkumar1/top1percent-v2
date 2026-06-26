import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { renderMarkdown } from "@/lib/markdown";
import type { PostFormData } from "@/components/post-form";

type PostPreviewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PostFormData;
  categoryName?: string;
  children?: React.ReactNode;
};

export function PostPreview({ open, onOpenChange, formData, categoryName, children }: PostPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Preview</DialogTitle>
        </DialogHeader>
        <article>
          <div
            className={`relative mb-8 h-40 overflow-hidden rounded-xl bg-gradient-to-br ${formData.coverGradient || "from-indigo-600 to-fuchsia-600"}`}
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {categoryName && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium">{categoryName}</span>
            )}
            <span>{formData.readingMinutes} min read</span>
          </div>
          <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight">
            {formData.title || "Untitled post"}
          </h1>
          {formData.excerpt && (
            <p className="mt-3 text-lg text-muted-foreground">{formData.excerpt}</p>
          )}
          {formData.tags && (
            <div className="mt-4 flex flex-wrap gap-2">
              {formData.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                <span key={t} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  #{t}
                </span>
              ))}
            </div>
          )}
          <div className="prose-article mt-8 border-t border-border pt-8">
            {formData.content ? renderMarkdown(formData.content) : (
              <p className="text-muted-foreground">No content yet.</p>
            )}
          </div>
          {children}
        </article>
      </DialogContent>
    </Dialog>
  );
}