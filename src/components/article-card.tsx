import { Link } from "@tanstack/react-router";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { CATEGORIES, formatDate, formatNumber, getCategory, type Article } from "@/lib/mock-data";
import { useApp } from "@/lib/app-context";

export function AuthorAvatar({ username, size = 32, linkToProfile = true }: { username: string; size?: number; linkToProfile?: boolean }) {
  const { authors } = useApp();
  const author = authors.find(a => a.username === username);
  if (!author) return null;
  const AvatarContent = (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${author.avatarGradient} font-sans text-xs font-semibold text-white ring-1 ring-black/5`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-label={author.name}
    >
      {author.initials}
    </div>
  );
  if (!linkToProfile) return AvatarContent;
  return (
    <Link
      to="/authors/$username"
      params={{ username }}
    >
      {AvatarContent}
    </Link>
  );
}

export function CategoryPill({ slug }: { slug: string }) {
  const c = getCategory(slug);
  if (!c) return null;
  return (
    <Link
      to="/categories/$slug"
      params={{ slug }}
      className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      {c.name}
    </Link>
  );
}

export function ArticleCard({ article, variant = "default" }: { article: Article; variant?: "default" | "compact" | "feature" }) {
  const { authors, toggleLike, toggleBookmark, likedArticles, bookmarkedArticles, articles } = useApp();
  const author = authors.find(a => a.username === article.authorUsername);
  const currentArticle = articles.find(a => a.slug === article.slug) || article;

  if (variant === "feature") {
    return (
      <article className="group grid gap-6 md:grid-cols-2 md:gap-10">
        <Link
          to="/articles/$slug"
          params={{ slug: currentArticle.slug }}
          className={`relative block aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br ${currentArticle.coverGradient} shadow-elevated`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90">
            <span className="rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
              {getCategory(currentArticle.category)?.name}
            </span>
            <span className="text-[11px]">{currentArticle.readingMinutes} min read</span>
          </div>
        </Link>
        <div className="flex flex-col justify-center">
          <CategoryPill slug={currentArticle.category} />
          <Link to="/articles/$slug" params={{ slug: currentArticle.slug }} className="mt-3">
            <h2 className="font-serif text-3xl font-semibold leading-[1.1] tracking-tight text-balance transition-colors group-hover:text-primary md:text-4xl">
              {currentArticle.title}
            </h2>
          </Link>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{currentArticle.excerpt}</p>
          <div className="mt-5 flex items-center gap-3">
            <AuthorAvatar username={currentArticle.authorUsername} size={36} linkToProfile={false} />
            <div className="min-w-0">
              <Link to="/authors/$username" params={{ username: currentArticle.authorUsername }} className="text-sm font-medium hover:text-primary">
                {author?.name}
              </Link>
              <p className="text-xs text-muted-foreground">{formatDate(currentArticle.publishedAt)} · {formatNumber(currentArticle.likes)} likes</p>
            </div>
          </div>
        </div>
      </article>
    );
  }

  
  if (variant === "compact") {
    return (
      <article className="group flex gap-4">
        <Link
          to="/articles/$slug"
          params={{ slug: currentArticle.slug }}
          className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${currentArticle.coverGradient}`}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AuthorAvatar username={currentArticle.authorUsername} size={20} linkToProfile={false} />
              <span className="truncate">{author?.name}</span>
            </div>
          <Link to="/articles/$slug" params={{ slug: currentArticle.slug }}>
            <h3 className="mt-1.5 font-serif text-base font-semibold leading-snug tracking-tight line-clamp-2 group-hover:text-primary">
              {currentArticle.title}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">{currentArticle.readingMinutes} min · {formatNumber(currentArticle.likes)} likes</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-border-strong hover:shadow-elevated">
      <Link
        to="/articles/$slug"
        params={{ slug: currentArticle.slug }}
        className={`relative block aspect-[16/9] overflow-hidden bg-gradient-to-br ${currentArticle.coverGradient}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_60%)]" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <CategoryPill slug={currentArticle.category} />
          <span className="text-xs text-muted-foreground">· {currentArticle.readingMinutes} min read</span>
        </div>
        <Link to="/articles/$slug" params={{ slug: currentArticle.slug }} className="mt-3">
          <h3 className="font-serif text-xl font-semibold leading-snug tracking-tight text-balance line-clamp-2 transition-colors group-hover:text-primary">
            {currentArticle.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{currentArticle.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex items-center gap-2">
            <AuthorAvatar username={currentArticle.authorUsername} size={28} linkToProfile={false} />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">{author?.name}</p>
              <p className="text-[11px] text-muted-foreground">{formatDate(currentArticle.publishedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleLike(currentArticle.slug);
              }}
              className={`inline-flex items-center gap-1 transition-colors hover:text-primary ${likedArticles.has(currentArticle.slug) ? "text-primary" : ""}`}
            >
              <Heart className="h-3.5 w-3.5" fill={likedArticles.has(currentArticle.slug) ? "currentColor" : "none"} />
              {formatNumber(currentArticle.likes)}
            </button>
            <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{currentArticle.comments}</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleBookmark(currentArticle.slug);
              }}
              className={`inline-flex items-center gap-1 transition-colors hover:text-primary ${bookmarkedArticles.has(currentArticle.slug) ? "text-primary" : ""}`}
            >
              <Bookmark className="h-3.5 w-3.5" fill={bookmarkedArticles.has(currentArticle.slug) ? "currentColor" : "none"} />
              {formatNumber(currentArticle.bookmarks)}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export { CATEGORIES };
