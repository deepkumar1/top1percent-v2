import { useState } from "react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CommentData as Comment } from "@/lib/api/comments";
import { commentsApi } from "@/lib/api/comments";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}

function CommentAvatar({ username }: { username: string }) {
  const { authors } = useApp();
  const author = authors.find((a) => a.username === username);
  const displayName = author?.name || username;
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
    "bg-rose-500", "bg-cyan-500", "bg-pink-500", "bg-teal-500",
  ];
  const colorIndex = displayName.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0) % colors.length;
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${colors[colorIndex]}`}>
      {initials}
    </div>
  );
}

export function CommentList({
  comments = [],
  onLoadMore,
  hasMore,
  loading,
}: {
  comments?: Comment[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}) {
  const { authors } = useApp();
  if (!comments) return null;

  return (
    <div className="space-y-5">
      {comments.filter((c) => c?.authorUsername).map((comment) => {
        const author = authors.find((a) => a.username === comment.authorUsername);
        const displayName = author?.name || comment.authorUsername;
        return (
          <div key={comment.id} className="flex gap-3">
            <CommentAvatar username={comment.authorUsername} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2 text-sm">
                <span className="font-semibold">{displayName}</span>
                <span className="text-xs text-muted-foreground">{formatDateTime(comment.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{comment.content}</p>
            </div>
          </div>
        );
      })}
      {hasMore && (
        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={onLoadMore} disabled={loading}>
            {loading ? "Loading..." : "Show more comments"}
          </Button>
        </div>
      )}
    </div>
  );
}

export function CommentForm({
  articleId,
  articleSlug,
  onCommentAdded,
}: {
  articleId: string;
  articleSlug: string;
  onCommentAdded: () => void;
}) {
  const { currentUser } = useApp();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser || submitting) return;

    const authorUsername = currentUser.authorUsername || currentUser.name.toLowerCase().replace(/\s+/g, "-");

    setSubmitting(true);
    try {
      const res = await commentsApi.create(articleId, articleSlug, authorUsername, content.trim());
      if (!res.success) {
        toast.error(res.message || "Failed to post comment.");
        return;
      }
      toast.success("Comment posted.");
      setContent("");
      onCommentAdded();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to post comment.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>{" "}
        to join the conversation.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add your comment..."
        className="min-h-[100px]"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim() || submitting}>
          {submitting ? "Posting…" : "Post comment"}
        </Button>
      </div>
    </form>
  );
}
