import { useRef, useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormFieldTip } from "@/components/form-field-tip";
import { PostPreview } from "@/components/post-preview";
import {
  MarkdownToolbar,
  applyMarkdownInsert,
  type MarkdownInsert,
} from "@/components/markdown-toolbar";

export type PostFormData = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorUsername: string;
  category: string;
  tags: string;
  readingMinutes: number;
  coverGradient: string;
  authorMessage: string;
};

type PostFormProps = {
  formData: PostFormData;
  setFormData: (data: PostFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  submitLabel: string;
  editingSlug?: string | null;
  categories: { slug: string; name: string }[];
  authors?: { username: string; name: string }[];
  lockAuthor?: boolean;
  showAuthorField?: boolean;
  adminFeedback?: string;
  showAuthorMessage?: boolean;
  editingWasLive?: boolean;
  errors?: Partial<PostFormData>;
};

const COVER_GRADIENTS = [
  { value: "from-indigo-600 to-fuchsia-600", label: "Indigo → Fuchsia" },
  { value: "from-emerald-500 to-teal-600", label: "Emerald → Teal" },
  { value: "from-rose-500 to-pink-600", label: "Rose → Pink" },
  { value: "from-slate-600 to-slate-900", label: "Slate" },
  { value: "from-amber-500 to-orange-600", label: "Amber → Orange" },
  { value: "from-cyan-500 to-blue-600", label: "Cyan → Blue" },
];

export function PostForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  submitLabel,
  editingSlug,
  categories,
  authors,
  lockAuthor = false,
  showAuthorField = false,
  adminFeedback,
  showAuthorMessage = true,
  editingWasLive = false,
  errors = {},
}: PostFormProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const categoryName = categories.find((c) => c.slug === formData.category)?.name;

  const handleMarkdownInsert = (insert: MarkdownInsert) => {
    const el = contentRef.current;
    if (!el) return;

    const { value, cursorStart, cursorEnd } = applyMarkdownInsert(
      formData.content,
      el.selectionStart,
      el.selectionEnd,
      insert,
    );

    setFormData({ ...formData, content: value });

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  return (
    <>
      <form onSubmit={onSubmit} className="grid gap-4">
        {adminFeedback && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">
              Admin feedback
            </p>
            <p className="mt-2 text-sm text-foreground">{adminFeedback}</p>
          </div>
        )}

        {editingWasLive && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-800 dark:text-amber-300">
            This post is currently live. Saving changes will unpublish it until an admin re-approves.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FormFieldTip
              htmlFor="slug"
              label="Slug"
              required
              tooltip="URL-friendly identifier used in the article link. Use lowercase letters, numbers, and hyphens only. Example: my-awesome-post"
            />
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="my-awesome-post"
              disabled={!!editingSlug}
            />
          </div>
          <div>
            <FormFieldTip
              htmlFor="readingMinutes"
              label="Reading time (min)"
              tooltip="Estimated reading time in minutes. Helps readers know how long the article takes to read."
            />
            <Input
              id="readingMinutes"
              type="number"
              min={1}
              value={formData.readingMinutes}
              onChange={(e) =>
                setFormData({ ...formData, readingMinutes: parseInt(e.target.value) || 1 })
              }
            />
          </div>
        </div>

        <div>
          <FormFieldTip
            htmlFor="title"
            label="Title"
            required
            tooltip="The main headline of your article. Keep it clear, specific, and compelling."
          />
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="My Awesome Post"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <FormFieldTip
            htmlFor="excerpt"
            label="Excerpt"
            required
            tooltip="A short summary shown on article cards and search results. Aim for 1–2 sentences."
          />
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="A short description of the post"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {showAuthorField && authors && (
            <div>
              <FormFieldTip
                htmlFor="author"
                label="Author"
                tooltip="The author profile shown on the published article."
              />
              <Select
                value={formData.authorUsername}
                onValueChange={(v) => setFormData({ ...formData, authorUsername: v })}
                disabled={lockAuthor}
              >
                <SelectTrigger id="author">
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((a) => (
                    <SelectItem key={a.username} value={a.username}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className={showAuthorField ? "" : "sm:col-span-2"}>
            <FormFieldTip
              htmlFor="category"
              label="Category"
              required
              tooltip="The primary topic for your article. Helps readers discover it in browse and search."
            />
            <Select
              value={formData.category}
              onValueChange={(v) => setFormData({ ...formData, category: v })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <FormFieldTip
            htmlFor="tags"
            label="Tags"
            tooltip="Comma-separated keywords for filtering and discovery. Example: java, spring-boot, performance"
          />
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div>
          <FormFieldTip
            htmlFor="coverGradient"
            label="Cover gradient"
            tooltip="Background gradient for the article hero image area on the published page."
          />
          <Select
            value={formData.coverGradient}
            onValueChange={(v) => setFormData({ ...formData, coverGradient: v })}
          >
            <SelectTrigger id="coverGradient">
              <SelectValue placeholder="Select gradient" />
            </SelectTrigger>
            <SelectContent>
              {COVER_GRADIENTS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <FormFieldTip
            htmlFor="content"
            label="Content"
            required
            tooltip="Write your article in Markdown. Use the toolbar above for headings, lists, code blocks (```), bold (**), links, and more."
          />
          <MarkdownToolbar
            onInsert={handleMarkdownInsert}
            rightSlot={
              <Button type="button" variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                <Eye className="mr-1 h-3.5 w-3.5" />
                Preview
              </Button>
            }
          />
          <Textarea
            ref={contentRef}
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write your post content here..."
            className="min-h-[300px] rounded-t-none"
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          <p className="mt-2 text-xs text-muted-foreground">
            Markdown supported: ## headings, **bold**, `code`, ``` code blocks ```, - lists, 1. numbered lists, &gt; quotes, [links](url)
          </p>
        </div>

        {showAuthorMessage && (
          <div>
            <FormFieldTip
              htmlFor="authorMessage"
              label="Message to admin"
              tooltip="Optional note for the reviewer — context, questions, or what changed since the last version."
            />
            <Textarea
              id="authorMessage"
              value={formData.authorMessage}
              onChange={(e) => setFormData({ ...formData, authorMessage: e.target.value })}
              placeholder="Anything you'd like the admin to know when reviewing this post..."
              rows={3}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>

      <PostPreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        formData={formData}
        categoryName={categoryName}
      />
    </>
  );
}

export const defaultPostFormState: PostFormData = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  authorUsername: "",
  category: "",
  tags: "",
  readingMinutes: 10,
  coverGradient: "from-indigo-600 to-fuchsia-600",
  authorMessage: "",
};

export function articleToFormData(article: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorUsername: string;
  category: string;
  tags: string[];
  readingMinutes: number;
  coverGradient: string;
  authorMessage?: string;
}): PostFormData {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    authorUsername: article.authorUsername,
    category: article.category,
    tags: article.tags.join(", "),
    readingMinutes: article.readingMinutes,
    coverGradient: article.coverGradient,
    authorMessage: article.authorMessage ?? "",
  };
}

export function formDataToPayload(formData: PostFormData) {
  return {
    ...formData,
    tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    authorMessage: formData.authorMessage.trim() || undefined,
  };
}