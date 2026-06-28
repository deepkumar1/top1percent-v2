export type Category = {
  slug: string;
  name: string;
  description: string;
  color: string; // tailwind gradient classes
  icon: string;
};

export type Author = {
  username: string;
  name: string;
  bio: string;
  avatarGradient: string;
  initials: string;
  followers: number;
  following: number;
  articlesCount: number;
  badges: string[];
  social: { twitter?: string; github?: string; website?: string };
};

export type ArticleStatus = "approved" | "pending" | "needs_rework";

export type Comment = {
  id: string;
  author: {
    id: string;
    name: string;
  };
  content: string;
  createdAt: string;
};

export type Article = {
  id: string;
  slug: string;
  title:string;
  excerpt: string;
  content: string;
  authorUsername: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingMinutes: number;
  likes: number;
  bookmarks: number;
  comments: Comment[];
  coverGradient: string;
  status?: ArticleStatus;
  /** Latest note from author when submitting or resubmitting */
  authorMessage?: string;
  /** Latest feedback from admin when sending for rework */
  adminFeedback?: string;
  /** Full message thread — sync with backend when using API */
  messages?: import("./api/types").PostMessage[];
  submittedBy?: string;
  featured?: boolean;
  trending?: boolean;
};

export const CATEGORIES: Category[] = [
  { slug: "java", name: "Java", description: "Modern Java, JVM internals, and ecosystem.", color: "from-orange-500 to-rose-500", icon: "☕" },
  { slug: "spring-boot", name: "Spring Boot", description: "Build production-grade services with Spring.", color: "from-emerald-500 to-teal-600", icon: "🌱" },
  { slug: "angular", name: "Angular", description: "Components, signals, and SSR at scale.", color: "from-red-500 to-pink-600", icon: "🅰️" },
  { slug: "javascript", name: "JavaScript", description: "The language that powers the web.", color: "from-yellow-400 to-amber-500", icon: "𝙅𝙎" },
  { slug: "typescript", name: "TypeScript", description: "Type-safe patterns and advanced generics.", color: "from-blue-500 to-indigo-600", icon: "𝙏𝙎" },
  { slug: "microservices", name: "Microservices", description: "Distributed systems done right.", color: "from-violet-500 to-purple-600", icon: "🧩" },
  { slug: "system-design", name: "System Design", description: "Design interviews and real-world architectures.", color: "from-slate-600 to-slate-900", icon: "🏛" },
  { slug: "ai", name: "AI", description: "Applied machine learning and AI engineering.", color: "from-fuchsia-500 to-pink-600", icon: "✨" },
  { slug: "genai", name: "GenAI", description: "LLMs, RAG, agents, and prompt design.", color: "from-cyan-500 to-blue-600", icon: "🤖" },
  { slug: "docker", name: "Docker", description: "Containerize anything, ship faster.", color: "from-sky-500 to-blue-600", icon: "🐳" },
  { slug: "kubernetes", name: "Kubernetes", description: "Cluster ops, operators, and platform engineering.", color: "from-indigo-500 to-blue-700", icon: "⎈" },
  { slug: "cloud", name: "Cloud", description: "AWS, GCP, Azure, and beyond.", color: "from-sky-400 to-cyan-600", icon: "☁️" },
  { slug: "career", name: "Career", description: "Grow as an engineer, leader, and human.", color: "from-amber-500 to-orange-600", icon: "🚀" },
  { slug: "kafka", name: "Kafka", description: "Event streaming, brokers, and distributed messaging.", color: "from-orange-500 to-yellow-600", icon: "⚡" },
  { slug: "interview-questions", name: "Interview Questions", description: "Crack the technical interview, calmly.", color: "from-rose-500 to-red-600", icon: "🎯" },
];

export const AUTHORS: Author[] = [
  { username: "ananya-rao", name: "Ananya Rao", bio: "Principal Engineer · Distributed systems, JVM performance, calm code review.", avatarGradient: "from-violet-500 to-fuchsia-600", initials: "AR", followers: 24180, following: 142, articlesCount: 86, badges: ["Top 1%", "Verified", "Editor's Pick"], social: { twitter: "ananya", github: "ananya-rao" } },
  { username: "marcus-lee", name: "Marcus Lee", bio: "Staff Engineer at a fintech. Writes about Spring, Kafka, and shipping reliably.", avatarGradient: "from-emerald-500 to-teal-600", initials: "ML", followers: 18420, following: 89, articlesCount: 54, badges: ["Top 1%", "Verified"], social: { twitter: "marcuslee", github: "marcuslee" } },
  { username: "priya-shah", name: "Priya Shah", bio: "Frontend architect. Angular, signals, accessible design systems.", avatarGradient: "from-rose-500 to-pink-600", initials: "PS", followers: 15630, following: 211, articlesCount: 41, badges: ["Verified"], social: { twitter: "priyacodes" } },
  { username: "daniel-okafor", name: "Daniel Okafor", bio: "Platform engineer. Kubernetes, observability, and developer experience.", avatarGradient: "from-indigo-500 to-blue-700", initials: "DO", followers: 12940, following: 76, articlesCount: 38, badges: ["Verified"], social: { github: "danokafor" } },
  { username: "lena-kowalski", name: "Lena Kowalski", bio: "AI engineer working on retrieval, evals, and agentic workflows.", avatarGradient: "from-fuchsia-500 to-purple-700", initials: "LK", followers: 21380, following: 130, articlesCount: 47, badges: ["Top 1%", "Verified"], social: { twitter: "lenak" } },
  { username: "jonas-meyer", name: "Jonas Meyer", bio: "Author of two books on system design. Helping engineers level up.", avatarGradient: "from-slate-600 to-slate-900", initials: "JM", followers: 31200, following: 58, articlesCount: 102, badges: ["Top 1%", "Verified", "Author"], social: { website: "jonasmeyer.dev" } },
];

const SAMPLE_CONTENT = `Most production incidents I've debugged in the last decade trace back to one of three things: a misunderstood timeout, a leaked resource, or a silent retry storm. None of them are exotic. All of them are preventable.

## The shape of the problem

When you onboard to a new service, you inherit a topology of upstream and downstream dependencies. Each edge in that graph has a budget — for latency, for failures, and for the number of in-flight requests you'll allow before saying no.

The first thing I do on any new codebase is draw that graph. Not in a diagramming tool — on paper. The act of writing forces honesty.

> If you can't draw your dependency graph in five minutes, you don't understand your service yet.

## Timeouts are a contract

A timeout isn't a "just in case" — it's a promise to the caller. If you set a 30s timeout on a downstream call from an API that responds within 200ms p99, you've told every retrying client that your worst case is 30 seconds. Threads pile up. The pool exhausts. Things fall over.

\`\`\`java
WebClient.create()
    .get()
    .uri("/users/{id}", id)
    .retrieve()
    .bodyToMono(User.class)
    .timeout(Duration.ofMillis(800))
    .retryWhen(Retry.backoff(2, Duration.ofMillis(50))
        .filter(this::isTransient));
\`\`\`

Tight timeouts. Bounded retries. Filtered to transient errors only. That's the baseline.

## Retries should be a budget, not a habit

The mistake I see most often: retries configured at every layer of the stack. The client retries. The gateway retries. The service retries the downstream call. A single user request can fan out into 27 attempts on a struggling dependency, which is exactly when you most need to back off.

Pick **one** layer to own retries — usually the client closest to the user — and disable them everywhere else.

## Closing thought

The boring practices — timeouts, bulkheads, circuit breakers, and shedding load when you must — are what separate a service that survives a bad Tuesday from one that takes the whole org down with it. Get them right, and the exciting work stays exciting.`;

export const ARTICLES: Article[] = [
  { id: "550e8400-e29b-41d4-a716-446655440001", slug: "production-resilience-three-mistakes", title: "The three mistakes that cause most production incidents", excerpt: "After a decade of on-call rotations, almost every postmortem comes back to one of three patterns. Here's how to spot and fix them.", content: SAMPLE_CONTENT, authorUsername: "ananya-rao", category: "system-design", tags: ["reliability", "java", "spring-boot"], publishedAt: "2026-06-21", readingMinutes: 9, likes: 1842, bookmarks: 612, comments: [], coverGradient: "from-indigo-600 via-violet-600 to-fuchsia-600", featured: true, trending: true },
  { id: "550e8400-e29b-41d4-a716-446655440002", slug: "spring-boot-3-virtual-threads", title: "Virtual threads in Spring Boot 3.5: a field report", excerpt: "We migrated 14 services to Loom-backed virtual threads. Throughput, pitfalls, and the surprising thing nobody tells you.", content: SAMPLE_CONTENT, authorUsername: "marcus-lee", category: "spring-boot", tags: ["java", "performance", "loom"], publishedAt: "2026-06-19", readingMinutes: 12, likes: 2410, bookmarks: 894, comments: [], coverGradient: "from-emerald-500 via-teal-600 to-cyan-700", featured: true, trending: true },
  { id: "550e8400-e29b-41d4-a716-446655440003", slug: "angular-signals-architecture", title: "Architecting large Angular apps with signals", excerpt: "Signals change the shape of a well-designed Angular app. A practical pattern for state, derived data, and side effects.", content: SAMPLE_CONTENT, authorUsername: "priya-shah", category: "angular", tags: ["angular", "signals", "rxjs"], publishedAt: "2026-06-18", readingMinutes: 11, likes: 1620, bookmarks: 540, comments: [], coverGradient: "from-rose-500 via-pink-600 to-fuchsia-700", featured: true },
  { id: "550e8400-e29b-41d4-a716-446655440004", slug: "rag-evals-that-matter", title: "RAG evals that actually predict production quality", excerpt: "Most teams measure the wrong things. A pragmatic evaluation harness that catches regressions before users do.", content: SAMPLE_CONTENT, authorUsername: "lena-kowalski", category: "genai", tags: ["llm", "rag", "evals"], publishedAt: "2026-06-17", readingMinutes: 14, likes: 2980, bookmarks: 1124, comments: [], coverGradient: "from-fuchsia-600 via-purple-600 to-indigo-700", trending: true },
  { id: "550e8400-e29b-41d4-a716-446655440005", slug: "k8s-platform-team-of-three", title: "Running a Kubernetes platform with a team of three", excerpt: "Lessons from operating 40+ clusters with a tiny team. What we automated, what we deleted, and what we said no to.", content: SAMPLE_CONTENT, authorUsername: "daniel-okafor", category: "kubernetes", tags: ["kubernetes", "platform", "sre"], publishedAt: "2026-06-15", readingMinutes: 13, likes: 1340, bookmarks: 478, comments: [], coverGradient: "from-indigo-500 via-blue-600 to-sky-700", trending: true },
  { id: "550e8400-e29b-41d4-a716-446655440006", slug: "system-design-rate-limiter", title: "Designing a distributed rate limiter, end to end", excerpt: "The full design walkthrough — token bucket, sliding window, Redis tradeoffs, and what to say when the interviewer pushes back.", content: SAMPLE_CONTENT, authorUsername: "jonas-meyer", category: "system-design", tags: ["interviews", "redis", "design"], publishedAt: "2026-06-14", readingMinutes: 18, likes: 4120, bookmarks: 2103, comments: [], coverGradient: "from-slate-700 via-slate-800 to-slate-900", trending: true },
  { id: "550e8400-e29b-41d4-a716-446655440007", slug: "typescript-discriminated-unions", title: "Discriminated unions are the API design tool you're not using", excerpt: "How a small TypeScript pattern eliminates entire categories of bugs and makes your APIs feel obvious.", content: SAMPLE_CONTENT, authorUsername: "priya-shah", category: "typescript", tags: ["typescript", "patterns"], publishedAt: "2026-06-12", readingMinutes: 8, likes: 1480, bookmarks: 612, comments: [], coverGradient: "from-blue-600 via-indigo-600 to-violet-700" },
  { id: "550e8400-e29b-41d4-a716-446655440008", slug: "docker-multistage-prod", title: "Docker multistage builds for production Java services", excerpt: "Tiny images, fast builds, and a base layer strategy that keeps your security team happy.", content: SAMPLE_CONTENT, authorUsername: "marcus-lee", category: "docker", tags: ["docker", "java", "ci"], publishedAt: "2026-06-10", readingMinutes: 7, likes: 980, bookmarks: 412, comments: [], coverGradient: "from-sky-500 via-blue-600 to-indigo-700" },
  { id: "550e8400-e29b-41d4-a716-446655440009", slug: "career-staff-engineer-archetypes", title: "The four archetypes of a staff engineer", excerpt: "Tech lead, architect, solver, right-hand — the same title, very different jobs. Find the one that fits you.", content: SAMPLE_CONTENT, authorUsername: "jonas-meyer", category: "career", tags: ["career", "leadership"], publishedAt: "2026-06-08", readingMinutes: 10, likes: 3210, bookmarks: 1840, comments: [], coverGradient: "from-amber-500 via-orange-600 to-rose-600" },
  { id: "550e8400-e29b-41d4-a716-446655440010", slug: "microservices-when-not-to", title: "When not to use microservices", excerpt: "A modular monolith is almost always the right starting point. The signals that tell you it isn't.", content: SAMPLE_CONTENT, authorUsername: "ananya-rao", category: "microservices", tags: ["architecture"], publishedAt: "2026-06-06", readingMinutes: 11, likes: 2180, bookmarks: 920, comments: [], coverGradient: "from-violet-600 via-purple-600 to-pink-600" },
  { id: "550e8400-e29b-41d4-a716-446655440011", slug: "interview-low-latency", title: "How I prepare for low-latency systems interviews", excerpt: "A four-week plan that focuses on the things interviewers actually probe, not the things books cover.", content: SAMPLE_CONTENT, authorUsername: "jonas-meyer", category: "interview-questions", tags: ["interviews", "career"], publishedAt: "2026-06-04", readingMinutes: 9, likes: 1740, bookmarks: 1023, comments: [], coverGradient: "from-rose-600 via-red-600 to-orange-600" },
  { id: "550e8400-e29b-41d4-a716-446655440012", slug: "cloud-cost-cuts", title: "We cut our cloud bill 62% without rewriting anything", excerpt: "The unglamorous, high-leverage moves: right-sizing, commitment math, and killing the thing nobody owned.", content: SAMPLE_CONTENT, authorUsername: "daniel-okafor", category: "cloud", tags: ["cloud", "finops"], publishedAt: "2026-06-02", readingMinutes: 10, likes: 2640, bookmarks: 1380, comments: [], coverGradient: "from-cyan-500 via-sky-600 to-blue-700" },
];

export const getAuthor = (username: string) =>
  AUTHORS.find((a) => a.username === username);

export const getCategory = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);

export const getArticle = (slug: string, articles: Article[]) =>
  articles.find((a) => a.slug === slug);

export const articlesByCategory = (slug: string) =>
  ARTICLES.filter((a) => a.category === slug);

export const articlesByAuthor = (username: string) =>
  ARTICLES.filter((a) => a.authorUsername === username);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const formatNumber = (n: number | null | undefined) => {
  if (n == null) return "0";
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k";
  return n.toString();
};