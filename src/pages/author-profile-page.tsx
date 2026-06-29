import { Link } from "@tanstack/react-router";
import { Twitter, Github, Globe, BadgeCheck } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { ArticleCard, AuthorAvatar } from "@/components/article-card";
import { useApp } from "@/lib/app-context";
import { getPublishedArticles } from "@/lib/articles";

export default function AuthorPage({ username }: { username: string }) {
  const { articles, toggleFollow, followedAuthors, authors } = useApp();
  const author = authors.find((a) => a.username === username);

  if (!author) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">Author not found</h1>
        <Link to="/articles" className="mt-4 inline-block text-primary hover:underline">Back to articles</Link>
      </div>
    );
  }

  const authorArticles = getPublishedArticles(articles).filter((a) => a.authorUsername === author?.username);
  const isFollowing = followedAuthors.has(author?.username);

  return (
    <div>
      <header className="border-b border-border bg-surface">
        <div className="container-wide py-16 md:py-20">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
            <AuthorAvatar username={author?.username || ""} size={120} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{author?.username || "Unknown author"}</h1>
                {author?.badges?.includes("Verified") && <BadgeCheck className="h-6 w-6 text-primary" aria-label="Verified" />}
              </div>
              <p className="mt-2 max-w-2xl text-muted-foreground">{author?.bio || "No bio"}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {author?.badges?.map((b: string) => (
                  <span key={b} className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">{b}</span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm">
                <span><span className="font-semibold">{formatNumber(author?.followers)}</span> <span className="text-muted-foreground">followers</span></span>
                <span><span className="font-semibold">{author?.following}</span> <span className="text-muted-foreground">following</span></span>
                <span><span className="font-semibold">{author?.articlesCount}</span> <span className="text-muted-foreground">articles</span></span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button 
                  onClick={() => toggleFollow(author?.username)}
                  className={`inline-flex h-10 items-center rounded-full px-5 text-sm font-medium transition-colors ${
                    isFollowing 
                      ? "bg-muted text-foreground hover:bg-muted/80" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <div className="flex items-center gap-1">
                  {author?.social?.twitter && <a aria-label="Twitter" href="#" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted"><Twitter className="h-4 w-4" /></a>}
                  {author?.social?.github && <a aria-label="GitHub" href="#" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted"><Github className="h-4 w-4" /></a>}
                  {author?.social?.website && <a aria-label="Website" href="#" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted"><Globe className="h-4 w-4" /></a>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="container-wide py-14">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Published articles</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {authorArticles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
        {authorArticles.length === 0 && (
          <p className="mt-6 text-muted-foreground">No articles published yet.</p>
        )}
      </section>
    </div>
  );
}
