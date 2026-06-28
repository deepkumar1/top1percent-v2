import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-context";
import { RequireAuth } from "@/components/require-auth";
import {
  PostForm,
  defaultPostFormState,
  articleToFormData,
  formDataToPayload,
  type PostFormData,
} from "@/components/post-form";
import { PostPreview } from "@/components/post-preview";
import { StatusBadge } from "@/components/status-badge";
import { MyPostsList } from "@/components/my-posts-list";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { formatDate, getAuthor } from "@/lib/mock-data";
import type { Article } from "@/lib/mock-data";
import type { ArticleStatus } from "@/lib/articles";

export default function AdminPage() {
  return (
    <RequireAuth role="admin">
      <AdminDashboard />
    </RequireAuth>
  );
}

type FilterTab = "review" | "pending" | "needs_rework" | "approved" | "my_posts" | "all";

function AdminDashboard() {
  const {
    currentUser,
    articles,
    authors,
    CATEGORIES,
    approveArticle,
    sendForRework,
    updateArticle,
    deleteArticle,
    getMyPosts,
    getReviewQueue,
    canApprovePost,
  } = useApp();

  const [tab, setTab] = useState<FilterTab>("review");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [reworkSlug, setReworkSlug] = useState<string | null>(null);
  const [approveSlug, setApproveSlug] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [formData, setFormData] = useState<PostFormData>(defaultPostFormState);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  const myPosts = getMyPosts();
  const reviewQueue = getReviewQueue();

  useEffect(() => {
    if (authors.length > 0 && CATEGORIES.length > 0) {
      setFormData((prev) => ({
        ...prev,
        authorUsername: prev.authorUsername || authors[0].username,
        category: prev.category || CATEGORIES[0].slug,
      }));
    }
  }, [authors, CATEGORIES]);

  const filtered = (() => {
    switch (tab) {
      case "review":
        return reviewQueue;
      case "my_posts":
        return myPosts;
      case "all":
        return articles;
      default:
        return articles.filter((a) => (a.status ?? "approved") === tab);
    }
  })();

  const resetForm = () => {
    setEditingSlug(null);
    setFormData({
      ...defaultPostFormState,
      authorUsername: authors[0]?.username || "",
      category: CATEGORIES[0]?.slug || "",
    });
  };

  const handleEdit = (article: Article) => {
    setEditingSlug(article.slug);
    setFormData(articleToFormData(article));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlug) return;
    try {
      await updateArticle(editingSlug, formDataToPayload(formData));
      toast.success("Post updated.");
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update post.");
    }
  };

  const handleApprove = async () => {
    if (!approveSlug) return;
    try {
      await approveArticle(approveSlug, adminMessage);
      toast.success("Post approved and published.");
      setApproveSlug(null);
      setAdminMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve post.");
    }
  };

  const handleSendForRework = async () => {
    if (!reworkSlug) return;
    if (!adminMessage) {
      alert("Please provide feedback for the author.");
      return;
    }
    try {
      await sendForRework(reworkSlug, adminMessage);
      toast.success("Feedback sent — post returned for rework.");
      setReworkSlug(null);
      setAdminMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send for rework.");
    }
  };

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "review", label: "Needs my review", count: reviewQueue.length },
    {
      id: "pending",
      label: "All pending",
      count: articles.filter((a) => a.status === "pending").length,
    },
    {
      id: "needs_rework",
      label: "Sent for rework",
      count: articles.filter((a) => a.status === "needs_rework").length,
    },
    {
      id: "approved",
      label: "Live",
      count: articles.filter((a) => (a.status ?? "approved") === "approved").length,
    },
    { id: "my_posts", label: "My posts", count: myPosts.length },
    { id: "all", label: "All posts", count: articles.length },
  ];

  return (
    <div className="container-wide py-14">
      <h1 className="font-serif text-4xl font-semibold">Admin dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Review submissions, approve posts to go live, or send them back with feedback.
        Use <strong className="font-medium text-foreground">Write</strong> in the header to create posts — another admin must approve yours.
      </p>

      {editingSlug && (
        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-2xl font-semibold">Edit post (admin)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Admin edits to live posts stay live. Author edits require re-approval.
          </p>
          <div className="mt-6">
            <PostForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={resetForm}
              submitLabel="Save changes"
              editingSlug={editingSlug}
              categories={CATEGORIES}
              authors={authors}
              showAuthorField
              showAuthorMessage={false}
            />
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {tab === "my_posts" ? (
        <div className="mt-8">
          <MyPostsList
            posts={myPosts}
            onEdit={handleEdit}
            onDelete={deleteArticle}
            emptyMessage="You haven't written any posts yet. Use Write in the header."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts in this tab.</p>
          ) : (
            filtered.map((a) => (
              <AdminPostRow
                key={a.slug}
                article={a}
                canApprove={canApprovePost(a.slug)}
                isOwnSubmission={a.submittedBy === currentUser?.id}
                onEdit={() => handleEdit(a)}
                onPreview={() => setPreviewArticle(a)}
                onDelete={() => deleteArticle(a.slug)}
              />
            ))
          )}
        </div>
      )}

      {previewArticle && (
        <PostPreview
          open={!!previewArticle}
          onOpenChange={(open) => !open && setPreviewArticle(null)}
          formData={articleToFormData(previewArticle)}
          categoryName={CATEGORIES.find((c) => c.slug === previewArticle.category)?.name}
        >
          <div className="mt-8 border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
            
            <div className="mb-6">
              <label htmlFor="adminFeedback" className="block text-sm font-medium mb-2">
                Admin Feedback (required for rework)
              </label>
              <Textarea
                id="adminFeedback"
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                placeholder="Enter feedback for the author..."
                className="min-h-[120px]"
              />
            </div>

            <div className="flex flex-wrap gap-3">
                {canApprovePost(previewArticle.slug) && (previewArticle.status === "pending" || previewArticle.status === "needs_rework") && (
                  <button 
                    onClick={() => {
                      approveArticle(previewArticle.slug, adminMessage);
                      toast.success("Post approved and published.");
                      setPreviewArticle(null);
                      setAdminMessage("");
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2.5 text-base font-bold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl"
                  >
                    ✓ Approve & publish
                  </button>
                )}
                
                {canApprovePost(previewArticle.slug) && (previewArticle.status === "pending" || previewArticle.status === "approved") && (
                  <button 
                    onClick={() => {
                      if (!adminMessage) {
                        alert("Please provide feedback for the author.");
                        return;
                      }
                      sendForRework(previewArticle.slug, adminMessage);
                      toast.success("Feedback sent — post returned for rework.");
                      setPreviewArticle(null);
                      setAdminMessage("");
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-2.5 text-base font-bold text-white shadow-lg transition-all hover:bg-amber-600 hover:shadow-xl"
                  >
                    ↻ Send for rework
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    handleEdit(previewArticle);
                    setPreviewArticle(null);
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-slate-600 px-6 py-2.5 text-base font-bold text-white shadow-lg transition-all hover:bg-slate-700 hover:shadow-xl"
                >
                    ✎ Edit post
                </button>
              </div>
          </div>
        </PostPreview>
      )}
    </div>
  );
}

function AdminPostRow({
  article,
  canApprove,
  isOwnSubmission,
  onEdit,
  onDelete,
  onPreview,
}: {
  article: Article;
  canApprove: boolean;
  isOwnSubmission: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
}) {
  const status = (article.status ?? "approved") as ArticleStatus;
  const author = getAuthor(article.authorUsername);

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{article.title}</p>
            <StatusBadge status={status} />
            {isOwnSubmission && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Your submission
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {article.slug} · {author?.name ?? article.authorUsername} · {formatDate(article.publishedAt)}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
          {article.authorMessage && status === "pending" && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium">Author note:</span> {article.authorMessage}
            </p>
          )}
          {article.adminFeedback && status === "needs_rework" && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium">Feedback sent:</span> {article.adminFeedback}
            </p>
          )}
          {isOwnSubmission && status === "pending" && (
            <p className="mt-2 text-xs text-amber-600">
              Another admin must approve this post — you cannot approve your own submission.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={onPreview}>
            Preview
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
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
                <AlertDialogAction onClick={() => { onDelete(); toast.success("Post deleted."); }}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
