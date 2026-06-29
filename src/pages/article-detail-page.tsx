import { Link } from "@tanstack/react-router";
import { Bookmark, Heart, MessageCircle, Share2, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import { ArticleCard, AuthorAvatar, CategoryPill } from "@/components/article-card";
import { useApp } from "@/lib/app-context";
import { isPublished, getPublishedArticles } from "@/lib/articles";
import { renderMarkdown } from "@/lib/markdown";
import { toast } from "sonner";
import { CommentForm, CommentList } from "@/components/comments";
import { commentsApi, type CommentData } from "@/lib/api/comments";
import { useEffect, useState, useCallback } from "react";

const fetchedCommentSlugs = new Set<string>();

export default function ArticleDetail({ slug }: { slug: string }) {
  const { 
    articles, 
    authors, 
    categories,
    toggleLike, 
    toggleBookmark, 
    toggleFollow, 
    likedArticles, 
    bookmarkedArticles, 
    followedAuthors 
  } = useApp();

  const currentArticle = articles.find((a) => a.slug === slug);

  const [comments, setComments] = useState<CommentData[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async (slug: string, pageNum: number) => {
    setLoading(true);
    try {
      const res = await commentsApi.list(slug, pageNum);
      if (!res.success) {
        toast.error(res.message || "Failed to load comments.");
        return;
      }
      const items = Array.isArray(res.data?.content) ? res.data.content
        : Array.isArray(res.data) ? res.data
        : [];
      if (pageNum === 0 && items.length === 0) {
        const article = articles.find((a) => a.slug === slug);
        if (article?.comments?.length) {
          const fallbackAuthor = article.authorUsername;
          items.push(...article.comments.map((c) => ({
            id: c.id,
            articleId: article.id,
            articleSlug: slug,
            authorUsername: fallbackAuthor,
            content: c.content,
            createdAt: c.createdAt,
          })));
        }
      }
      if (items.length > 0 || pageNum === 0) {
        setComments((prev) => (pageNum === 0 ? items : [...prev, ...items]));
      }
      setTotalPages(res.data?.totalPages ?? (items.length > 0 ? 1 : 0));
      setPage(pageNum);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [articles]);

  useEffect(() => {
    if (!currentArticle?.slug) return;
    if (fetchedCommentSlugs.has(currentArticle.slug)) return;
    fetchedCommentSlugs.add(currentArticle.slug);
    fetchComments(currentArticle.slug, 0);
  }, [currentArticle?.slug, fetchComments]);

  const handleLoadMore = () => {
    if (!loading && currentArticle && page + 1 < totalPages) {
      fetchComments(currentArticle.slug, page + 1);
    }
  };

  const handleCommentAdded = () => {
    if (currentArticle?.slug) {
      fetchComments(currentArticle.slug, 0);
    }
  };

  if (!currentArticle || !isPublished(currentArticle)) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">Article not found</h1>
        <Link to="/articles" className="mt-4 inline-block text-primary hover:underline">Browse all articles</Link>
      </div>
    );
  }
  const author = authors.find((a) => a.username === currentArticle.authorUsername);
  const authorUsername = author?.username ?? currentArticle.authorUsername;
  const authorName = author?.name ?? authorUsername;

  const category = categories.find((c) => c.slug === currentArticle.category);
  const related = getPublishedArticles(articles)
    .filter((a) => a.category === currentArticle.category && a.slug !== currentArticle.slug)
    .slice(0, 3);
  const moreFromAuthor = getPublishedArticles(articles)
    .filter((a) => a.authorUsername === currentArticle.authorUsername && a.slug !== currentArticle.slug)
    .slice(0, 2);

  const isLiked = likedArticles.has(currentArticle.slug);
  const isBookmarked = bookmarkedArticles.has(currentArticle?.slug);
  const isFollowing = followedAuthors.has(authorUsername);
  const hasMoreComments = page + 1 < totalPages;

  return (
    <article>
      {/* Cover */}
      <div className={`relative h-[42vh] min-h-[320px] w-full overflow-hidden bg-gradient-to-br ${currentArticle.coverGradient}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="container-prose -mt-20 md:-mt-28 relative z-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated md:p-10">
          <div className="flex flex-wrap items-center gap-3">
            {category && <CategoryPill slug={currentArticle.category} />}
            <span className="text-xs text-muted-foreground">{currentArticle.readingMinutes} min read · {formatDate(currentArticle.publishedAt)}</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-balance md:text-5xl">
            {currentArticle.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{currentArticle.excerpt}</p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <Link to="/authors/$username" params={{ username: authorUsername }} className="flex items-center gap-3">
              <AuthorAvatar username={authorUsername} size={44} linkToProfile={false} />
              <div>
                <p className="font-medium">{authorName}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(author?.followers ?? 0)} followers · {author?.articlesCount ?? 0} articles</p>
              </div>
            </Link>
            <button 
              onClick={() => toggleFollow(authorUsername)}
              className={`inline-flex h-9 items-center rounded-full px-4 text-xs font-medium transition-colors ${
                isFollowing 
                  ? "bg-muted text-foreground hover:bg-muted/80" 
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-prose mt-12">
        <div className="prose-article">{renderMarkdown(currentArticle.content)}</div>

        {/* Tags */}
        <div className="mt-12 flex flex-wrap gap-2">
          {currentArticle.tags.map((t: string) => (
            <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">#{t}</span>
          ))}
        </div>

        {/* Action bar */}
        <div className="mt-10 flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4">
          <div className="flex items-center gap-5 text-sm">
            <button 
              onClick={() => toggleLike(currentArticle.slug)}
              className={`inline-flex items-center gap-1.5 transition-colors hover:text-primary ${isLiked ? "text-primary" : "text-muted-foreground"}`}
            >
              <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
              {formatNumber(currentArticle.likes)}
            </button>
            <button className="inline-flex items-center gap-1.5 transition-colors hover:text-primary text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              {comments?.length ?? 0}
            </button>
            <button 
              onClick={() => toggleBookmark(currentArticle.slug)}
              className={`inline-flex items-center gap-1.5 transition-colors hover:text-primary ${isBookmarked ? "text-primary" : "text-muted-foreground"}`}
            >
              <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
              {formatNumber(currentArticle.bookmarks)}
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button aria-label="Share on Twitter" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"><Twitter className="h-3.5 w-3.5" /></button>
            <button aria-label="Share on LinkedIn" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"><Linkedin className="h-3.5 w-3.5" /></button>
            <button aria-label="Copy link" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"><LinkIcon className="h-3.5 w-3.5" /></button>
            <button aria-label="Share" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"><Share2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        {/* Author card */}
        <div className="mt-12 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="flex items-start gap-5">
            <AuthorAvatar username={authorUsername} size={64} linkToProfile={false} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Written by</p>
              <Link to="/authors/$username" params={{ username: authorUsername }} className="mt-1 block font-serif text-2xl font-semibold tracking-tight hover:text-primary">
                {authorName}
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">{author?.bio ?? ""}</p>
              {moreFromAuthor.length > 0 && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {moreFromAuthor.map((a) => (
                    <ArticleCard key={a.slug} article={a} variant="compact" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments */}
        <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Comments · {comments?.length ?? 0}</h2>
        <div className="mt-8 space-y-8">
          <CommentForm articleId={currentArticle.id} articleSlug={currentArticle.slug} onCommentAdded={handleCommentAdded} />
          <CommentList
            comments={comments ?? []}
            onLoadMore={handleLoadMore}
            hasMore={hasMoreComments}
            loading={loading}
          />
        </div>
      </section>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-border bg-surface py-16">
          <div className="container-wide">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">More in {category?.name}</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Related articles</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
