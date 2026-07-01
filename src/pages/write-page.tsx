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
import { MyPostsList } from "@/components/my-posts-list";
import type { Article } from "@/lib/mock-data";

export default function WritePage() {
  return (
    <RequireAuth>
      <WriteDashboard />
    </RequireAuth>
  );
}

function WriteDashboard() {
  const {
    currentUser,
    categories: CATEGORIES,
    authors,
    submitArticle,
    updateOwnPost,
    deleteOwnPost,
    getMyPosts,
    addCategory,
  } = useApp();

  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<PostFormData>(defaultPostFormState);
  const [errors, setErrors] = useState<Partial<PostFormData>>({});
  const [editorKey, setEditorKey] = useState(0);

  const authorUsername =
    currentUser?.authorUsername ?? formData.authorUsername ?? authors[0]?.username ?? "admin";
  const myPosts = getMyPosts();
  const isAdmin = currentUser?.role === "admin";
  const showAuthorPicker = isAdmin && !currentUser?.authorUsername;

  useEffect(() => {
    if (CATEGORIES.length > 0 && authorUsername) {
      setFormData((prev) => ({
        ...prev,
        authorUsername,
        category: prev.category || CATEGORIES[0].slug,
      }));
    }
  }, [CATEGORIES, authorUsername]);

  const resetForm = () => {
    setEditingSlug(null);
    setFormData({
      ...defaultPostFormState,
      authorUsername,
      category: CATEGORIES[0]?.slug || "",
    });
    setErrors({});
    setEditorKey((k) => k + 1);
  };

  const handleEdit = (article: Article) => {
    setEditingSlug(article.slug);
    setFormData(articleToFormData(article));
    setEditorKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: Partial<PostFormData> = {};
    if (!formData.title) validationErrors.title = "Title is required";
    if (!formData.slug) validationErrors.slug = "Slug is required";
    if (!formData.excerpt) validationErrors.excerpt = "Excerpt is required";
    if (!formData.category) validationErrors.category = "Category is required";
    if (!formData.content) validationErrors.content = "Content is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = formDataToPayload({
      ...formData,
      authorUsername: formData.authorUsername || authorUsername,
    });

    try {
      if (editingSlug) {
        await updateOwnPost(editingSlug, payload);
        toast.success("Post submitted for re-approval.");
      } else {
        await submitArticle(payload);
        toast.success("Post submitted for review.");
      }
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit post";
      toast.error(message);
    }
  };

  const editingArticle = editingSlug ? myPosts.find((a) => a.slug === editingSlug) : undefined;
  const editingWasLive = !!editingSlug && (editingArticle?.status ?? "approved") === "approved";

  if (!authorUsername && !isAdmin) {
    return (
      <div className="container-wide py-14 text-center">
        <h1 className="font-serif text-3xl font-semibold">Author profile missing</h1>
        <p className="mt-2 text-muted-foreground">
          Your account is not linked to an author profile.
        </p>
      </div>
    );
  }

  const handleCategoryCreated = (category: import("@/lib/mock-data").Category) => {
    addCategory(category);
    setFormData((prev) => ({ ...prev, category: category.slug }));
  };

  const submitLabel = editingSlug
    ? editingWasLive
      ? "Save & submit for re-approval"
      : "Save & resubmit for review"
    : isAdmin
      ? "Submit for admin review"
      : "Submit for review";

  return (
    <div className="container-wide py-14">
      <h1 className="font-serif text-4xl font-semibold">
        {editingSlug ? "Edit post" : "Create a post"}
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {isAdmin
          ? "Your post will be reviewed by another admin before going live."
          : "Submit your article for admin review. Edits to live posts require re-approval before publishing again."}
      </p>

      <div className="mt-10 grid gap-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <PostForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={editingSlug ? resetForm : undefined}
            submitLabel={submitLabel}
            editingSlug={editingSlug}
            categories={CATEGORIES}
            authors={authors}
            lockAuthor={!showAuthorPicker && !!currentUser?.authorUsername}
            showAuthorField={showAuthorPicker}
            adminFeedback={editingArticle?.adminFeedback}
            editingWasLive={editingWasLive}
            errors={errors}
            onCategoryCreated={handleCategoryCreated}
            editorKey={String(editorKey)}
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-2xl font-semibold">Your posts ({myPosts.length})</h2>
          <MyPostsList
            posts={myPosts}
            onEdit={handleEdit}
            onDelete={deleteOwnPost}
            emptyMessage="No posts yet. Create your first article above."
          />
        </div>
      </div>
    </div>
  );
}
