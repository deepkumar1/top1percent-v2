import { useCallback, useEffect, useRef } from "react";
import { marked } from "marked";
import { markdownToHtml, htmlToMarkdown } from "../lib/tiptap-utils";

function looksLikeMarkdown(text: string): boolean {
  if (
    /^#{1,6}\s/m.test(text) ||
    /^```/m.test(text) ||
    /^>\s/m.test(text) ||
    /^(?:[-*+]|\d+\.)\s/m.test(text) ||
    /\[.+?\]\(.+?\)/m.test(text) ||
    /!\[.+?\]\(.+?\)/m.test(text) ||
    /[*_]{2,}.+?[*_]{2,}/m.test(text) ||
    /`[^`]+`/m.test(text) ||
    /^-{3,}$/m.test(text)
  ) {
    return true;
  }
  return false;
}
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import Dropcursor from "@tiptap/extension-dropcursor";
import { mergeAttributes, Node } from "@tiptap/core";
import { createLowlight, common } from "lowlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Pilcrow,
  ImageIcon,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const lowlight = createLowlight(common);

const COLORS = [
  { label: "Default", value: "inherit" },
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Yellow", value: "#eab308" },
  { label: "Green", value: "#22c55e" },
  { label: "Emerald", value: "#10b981" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Fuchsia", value: "#d946ef" },
  { label: "Pink", value: "#ec4899" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Gray", value: "#6b7280" },
  { label: "Slate", value: "#64748b" },
];

type TiptapEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  editorKey?: string;
};

function Toolbar({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const addLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (url) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "image",
            attrs: { src: url },
          })
          .run();
      }
    };
    reader.readAsDataURL(file);
  }, [editor]);

  const handleImageButton = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addImage(file);
    }
    e.target.value = "";
  }, [addImage]);

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <div className="mx-1 h-5 w-px bg-border" />

      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        aria-label="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        aria-label="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>

      <div className="mx-1 h-5 w-px bg-border" />

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet list"
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Ordered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      <div className="mx-1 h-5 w-px bg-border" />

      <Toggle
        size="sm"
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        aria-label="Inline code"
      >
        <Code className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("codeBlock")}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        aria-label="Code block"
      >
        <Code2 className="h-4 w-4" />
      </Toggle>

      <div className="mx-1 h-5 w-px bg-border" />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handleImageButton}
        aria-label="Image"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-5 w-px bg-border" />

      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="h-8 gap-1 px-2 text-xs">
            <Pilcrow className="h-3.5 w-3.5" />
            Color
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <div className="grid grid-cols-6 gap-1">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md border text-[10px] hover:border-foreground"
                style={{ backgroundColor: c.value === "inherit" ? "transparent" : c.value }}
                title={c.label}
                onClick={() => editor.chain().focus().setColor(c.value).run()}
              >
                {c.value === "inherit" ? "A" : ""}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={addLink}
        aria-label="Link"
      >
        <Link className="h-4 w-4" />
      </Toggle>
    </div>
    </>
  );
}

export function TiptapEditor({
  value,
  onChange,
  placeholder = "Write your post content here...",
  minHeight = "300px",
}: TiptapEditorProps) {
  const mounted = useRef(false);

  const editor = useEditor({
    content: value ? markdownToHtml(value) : "",
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      TextStyle,
      Color,
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Node.create({
        name: "image",
        inline: true,
        group: "inline",
        draggable: true,
        addAttributes() {
          return {
            src: { default: null },
            alt: { default: null },
            width: { default: null },
            height: { default: null },
          };
        },
        parseHTML() {
          return [{ tag: "img[src]" }];
        },
        renderHTML({ HTMLAttributes }) {
          return ["img", mergeAttributes(HTMLAttributes, { class: "rounded-lg" })];
        },
      }),
      Dropcursor,
      Placeholder.configure({ placeholder }),
    ],
    onUpdate({ editor }) {
      if (!mounted.current) return;
      const html = editor.getHTML();
      const md = htmlToMarkdown(html);
      onChange(md);
    },
    editorProps: {
      handleClick(view, pos, event) {
        const node = view.state.doc.nodeAt(pos);
        if (node?.type.name === "image") {
          const attrs = node.attrs;
          const currentWidth = attrs.width || "";
          const width = window.prompt("Image width (e.g. 100%, 300px, or leave empty for auto):", currentWidth);
          if (width !== null) {
            view.dispatch(
              view.state.tr.setNodeMarkup(pos, undefined, {
                ...attrs,
                width: width || null,
              }),
            );
          }
          return true;
        }
        return false;
      },
      handleDrop(view, event, slice, moved) {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = (e) => {
              const url = e.target?.result as string;
              if (url) {
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: "image",
                    attrs: { src: url },
                  })
                  .run();
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of Array.from(items)) {
            if (item.type.startsWith("image/")) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const url = e.target?.result as string;
                  if (url) {
                    editor
                      .chain()
                      .focus()
                      .insertContent({
                        type: "image",
                        attrs: { src: url },
                      })
                      .run();
                  }
                };
                reader.readAsDataURL(file);
              }
              return true;
            }
          }
        }
        const types = event.clipboardData?.types;
        const hasHtml = types && Array.from(types).includes("text/html");
        if (!hasHtml) {
          const text = event.clipboardData?.getData("text/plain");
          if (text && looksLikeMarkdown(text)) {
            event.preventDefault();
            const html = markdownToHtml(text);
            editor
              .chain()
              .focus()
              .insertContent(html)
              .run();
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    mounted.current = true;
  }, []);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-input">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose-article max-w-none"
        style={{ minHeight }}
      />
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border bg-muted/30 px-3 py-1.5 text-[11px] text-muted-foreground">
        <span><code className="text-xs font-semibold text-foreground">#</code> H1</span>
        <span><code className="text-xs font-semibold text-foreground">##</code> H2</span>
        <span><code className="text-xs font-semibold text-foreground">###</code> H3</span>
        <span><code className="text-xs font-semibold text-foreground">**text**</code> Bold</span>
        <span><code className="text-xs font-semibold text-foreground">*text*</code> Italic</span>
        <span><code className="text-xs font-semibold text-foreground">***text***</code> B+I</span>
        <span><code className="text-xs font-semibold text-foreground">~~text~~</code> Strike</span>
        <span><code className="text-xs font-semibold text-foreground">`code`</code> Code</span>
        <span><code className="text-xs font-semibold text-foreground">```</code> Block</span>
        <span><code className="text-xs font-semibold text-foreground">&gt;</code> Quote</span>
        <span><code className="text-xs font-semibold text-foreground">-</code> List</span>
        <span><code className="text-xs font-semibold text-foreground">1.</code> Ord</span>
        <span><code className="text-xs font-semibold text-foreground">[a](u)</code> Link</span>
        <span><code className="text-xs font-semibold text-foreground">---</code> HR</span>
      </div>
    </div>
  );
}
