import type { Article } from "@/lib/mock-data";
import { formatDate } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ArticleStatus } from "@/lib/articles";

type MyPostsListProps = {
  posts: Article[];
  onEdit: (article: Article) => void;
  onDelete: (slug: string) => void;
  emptyMessage?: string;
};

export function MyPostsList({
  posts,
  onEdit,
  onDelete,
  emptyMessage = "No posts yet.",
}: MyPostsListProps) {
  if (posts.length === 0) {
    return <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="mt-6 grid gap-4">
      {posts.map((a) => (
        <MyPostRow key={a.slug} article={a} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

function MyPostRow({
  article,
  onEdit,
  onDelete,
}: {
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: (slug: string) => void;
}) {
  const status = (article.status ?? "pending") as ArticleStatus;

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{article.title}</p>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {article.slug} · {formatDate(article.publishedAt)}
          </p>
          {status === "approved" && (
            <p className="mt-1 text-xs text-amber-600">
              Editing a live post will unpublish it until admin re-approves.
            </p>
          )}
          {article.authorMessage && (status === "pending" || status === "needs_rework") && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium">Your note:</span> {article.authorMessage}
            </p>
          )}
          {article.adminFeedback && status === "needs_rework" && (
            <p className="mt-2 text-sm text-rose-600">
              <span className="font-medium">Admin feedback:</span> {article.adminFeedback}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" size="sm" onClick={() => onEdit(article)}>
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                <AlertDialogDescription>
                  &quot;{article.title}&quot; will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(article.slug)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
