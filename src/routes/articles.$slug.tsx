import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bookmark, Heart, MessageCircle, Share2, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { formatDate, formatNumber, getAuthor, getCategory } from "@/lib/mock-data";
import { ArticleCard, AuthorAvatar, CategoryPill } from "@/components/article-card";
import { useApp } from "@/lib/app-context";
import { isPublished, getPublishedArticles, getComments, addComment } from "@/lib/articles";
import { renderMarkdown } from "@/lib/markdown";
import { CommentForm, CommentList } from "@/components/comments";
import React from "react";


export const Route = createFileRoute("/articles/$slug")({
  // We'll handle finding the article in the component using app context instead of loader
  // because loader runs on server/initial load and doesn't have access to client-side state
  component: ArticleDetail,
  notFoundComponent: () => (
    <div className="container-wide py-24 text-center">
      <h1 className="font-serif text-3xl font-semibold">Article not found</h1>
      <Link to="/articles" className="mt-4 inline-block text-primary hover:underline">Browse all articles</Link>
    </div>
  ),
});

function ArticleDetail() {
  const params = Route.useParams();
  const { 
    articles, 
    authors, 
    CATEGORIES,
    toggleLike, 
    toggleBookmark, 
    toggleFollow, 
    likedArticles, 
    bookmarkedArticles, 
    followedAuthors 
  } = useApp();

  const currentArticle = articles.find((a) => a.slug === params.slug);

  if (!currentArticle || !isPublished(currentArticle)) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">Article not found</h1>
        <Link to="/articles" className="mt-4 inline-block text-primary hover:underline">Browse all articles</Link>
      </div>
    );
  }

  const author = authors.find((a) => a.username === currentArticle.authorUsername) || getAuthor(currentArticle.authorUsername)!;
  const category = CATEGORIES.find((c) => c.slug === currentArticle.category) || getCategory(currentArticle.category);
  const related = getPublishedArticles(articles)
    .filter((a) => a.category === currentArticle.category && a.slug !== currentArticle.slug)
    .slice(0, 3);
  const moreFromAuthor = getPublishedArticles(articles)
    .filter((a) => a.authorUsername === currentArticle.authorUsername && a.slug !== currentArticle.slug)
    .slice(0, 2);

  const [comments, setComments] = React.useState(() => getComments(currentArticle.slug));

  const handleCommentAdded = () => {
    setComments([...getComments(currentArticle.slug)]);
  };


  const isLiked = likedArticles.has(currentArticle.slug);
  const isBookmarked = bookmarkedArticles.has(currentArticle.slug);
  const isFollowing = followedAuthors.has(author.username);

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
            <Link to="/authors/$username" params={{ username: author.username }} className="flex items-center gap-3">
              <AuthorAvatar username={author.username} size={44} linkToProfile={false} />
              <div>
                <p className="font-medium">{author.name}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(author.followers)} followers · {author.articlesCount} articles</p>
              </div>
            </Link>
            <button 
              onClick={() => toggleFollow(author.username)}
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
              {comments.length}
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
            <AuthorAvatar username={author.username} size={64} linkToProfile={false} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Written by</p>
              <Link to="/authors/$username" params={{ username: author.username }} className="mt-1 block font-serif text-2xl font-semibold tracking-tight hover:text-primary">
                {author.name}
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">{author.bio}</p>
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

        {/* Comments placeholder */}
        <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Comments · {comments.length}</h2>
        <div className="mt-8 space-y-8">
          <CommentForm articleSlug={currentArticle.slug} onCommentAdded={handleCommentAdded} />
          <CommentList comments={comments} />
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