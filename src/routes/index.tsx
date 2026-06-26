import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, TrendingUp, Mail } from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";
import { ArticleCard, AuthorAvatar } from "@/components/article-card";
import { useApp } from "@/lib/app-context";
import { getPublishedArticles } from "@/lib/articles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Top 1 Percent — Engineering writing worth your time" },
      { name: "description", content: "Deeply considered articles on Java, Spring, Angular, AI, system design, and the craft of software — from engineers in the top 1% of their field." },
      { property: "og:title", content: "Top 1 Percent — Engineering writing worth your time" },
      { property: "og:description", content: "A premium publication for engineers who want to think clearly and ship reliably." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { articles, authors, subscribeNewsletter, newsletterSubscribed } = useApp();
  const published = getPublishedArticles(articles);
  const featured = published.filter((a) => a.featured);
  const trending = published.filter((a) => a.trending).slice(0, 5);
  const latest = published.slice(0, 6);
  const topAuthors = [...authors].sort((a, b) => b.followers - a.followers).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,oklch(0.95_0.04_264/0.6),transparent_70%)]" />
        <div className="container-wide grid items-center gap-10 py-10 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> A publication for serious engineers
            </span>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
              Writing for the <span className="text-primary">top 1%</span> of engineers.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Long-form essays, postmortems, and design walkthroughs from staff and principal engineers. No fluff, no SEO bait — just the writing you wish your senior had time to send you.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/articles" className="inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-6 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90">
                Start reading <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/categories" className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted">
                Browse categories
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {authors.slice(0, 4).map((a) => (
                  <AuthorAvatar key={a.username} username={a.username} size={32} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">2,400+ engineers</span> publishing this month
              </p>
            </div>
          </div>

          {/* Hero cover */}
          <div className="relative">
            <div className={`relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br ${featured[0]?.coverGradient ?? "from-indigo-600 to-fuchsia-600"} shadow-glow`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_60%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur">Featured</span>
                {featured[0] && (
                  <Link to="/articles/$slug" params={{ slug: featured[0].slug }} className="mt-4 block">
                    <h3 className="font-serif text-2xl font-semibold leading-tight tracking-tight text-balance md:text-3xl">
                      {featured[0].title}
                    </h3>
                    <p className="mt-2 text-sm text-white/80 line-clamp-2">{featured[0].excerpt}</p>
                  </Link>
                )}
              </div>
            </div>
            <div className="absolute -right-4 -top-4 hidden h-20 w-20 rotate-6 rounded-2xl bg-primary-soft md:block" aria-hidden />
            <div className="absolute -bottom-4 -left-4 hidden h-16 w-16 -rotate-12 rounded-2xl bg-secondary md:block" aria-hidden />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-wide py-10">
        <SectionHeader eyebrow="Editor's pick" title="Featured this week" href="/articles" />
        <div className="mt-10 grid gap-12">
          {featured.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="feature" />
          ))}
        </div>
      </section>

      {/* Trending + Authors */}
      <section className="border-y border-border bg-surface py-10">
        <div className="container-wide grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">Trending now</h2>
            </div>
            <ol className="mt-8 grid gap-7">
              {trending.map((a, i) => (
                <li key={a.slug} className="grid grid-cols-[auto_1fr] items-start gap-5">
                  <span className="font-serif text-4xl font-semibold text-border-strong">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <ArticleCard article={a} variant="compact" />
                </li>
              ))}
            </ol>
          </div>

          <div>
            <SectionHeader eyebrow="Voices" title="Top authors" />
            <div className="mt-8 grid gap-4">
              {topAuthors.map((a) => (
                <Link
                  key={a.username}
                  to="/authors/$username"
                  params={{ username: a.username }}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-border-strong hover:shadow-soft"
                >
                  <AuthorAvatar username={a.username} size={48} linkToProfile={false} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium group-hover:text-primary">{a.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.bio}</p>
                  </div>
                  <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary">Follow</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="container-wide py-10">
        <SectionHeader eyebrow="Fresh" title="Latest articles" href="/articles" />
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-border bg-surface py-10">
        <div className="container-wide">
          <SectionHeader eyebrow="By topic" title="Browse categories" href="/categories" />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/categories/$slug"
                params={{ slug: c.slug }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:border-border-strong hover:shadow-soft"
              >
                <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${c.color} opacity-15 transition-opacity group-hover:opacity-25`} />
                <p className="text-2xl">{c.icon}</p>
                <p className="mt-3 font-serif text-lg font-semibold tracking-tight">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-wide py-10">
        <div className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-10 text-secondary-foreground md:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(50%_70%_at_80%_0%,oklch(0.55_0.22_264/0.45),transparent_70%)]" aria-hidden />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                <Mail className="h-3.5 w-3.5" /> Newsletter
              </span>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-balance md:text-4xl">
                The week's best engineering writing, in your inbox every Sunday.
              </h2>
              <p className="mt-3 max-w-lg text-sm text-white/70">
                Hand-picked articles from the top 1%. No tracking, no growth hacks. Unsubscribe in one click.
              </p>
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => { 
                e.preventDefault();
                subscribeNewsletter(); 
              }}
            >
              {newsletterSubscribed ? (
                <div className="h-12 flex-1 flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 text-sm text-white font-medium">
                  Thanks for subscribing!
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="h-12 flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/40"
                  />
                  <button
                    type="submit"
                    className="h-12 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Subscribe
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, href }: { eyebrow: string; title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link to={href} className="hidden shrink-0 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex">
          View all →
        </Link>
      )}
    </div>
  );
}