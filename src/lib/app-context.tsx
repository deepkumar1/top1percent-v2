import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import type { Article, Author, Category } from "./mock-data";
import { categoriesApi } from "./api/categories";
import { authorsApi } from "./api/authors";
import type { SessionUser } from "./auth";
import { authApi, decodeJwtUser, mapSpringRole } from "./api/auth";
import { setAuthToken, registerUnauthorizedHandler, unregisterUnauthorizedHandler } from "./api/client";
import { normalizeArticles } from "./articles";
import {
  applyApprove,
  applyRework,
  assertAdminCanDelete,
  filterOwnPosts,
  filterReviewQueue,
} from "./api/post-actions";
import { canAdminApprovePost } from "./api/post-permissions";
import type { SubmitPostInput, UpdatePostInput } from "./api/types";
import { postsApi } from "./api/posts";

const STORAGE_KEY = "wordspark-forge-data";
let didFetchArticles = false;
let didFetchCategories = false;
let didFetchAuthors = false;

interface AppState {
  likedArticles: Set<string>;
  bookmarkedArticles: Set<string>;
  followedAuthors: Set<string>;
  newsletterSubscribed: boolean;
  articles: Article[];
  authors: Author[];
  categories: Category[];
  currentUser: SessionUser | null;
}

interface AppContextValue extends AppState {
  toggleLike: (slug: string) => void;
  toggleBookmark: (slug: string) => void;
  toggleFollow: (username: string) => void;
  subscribeNewsletter: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  /** Submit a new post for review (author or admin). */
  submitArticle: (input: SubmitPostInput) => Promise<void>;
  /** Author edits own post — live posts go back to pending for re-approval. */
  updateOwnPost: (slug: string, input: UpdatePostInput) => void;
  /** Author deletes own post. */
  deleteOwnPost: (slug: string) => void;
  approveArticle: (slug: string, adminMessage?: string) => Promise<void>;
  sendForRework: (slug: string, adminMessage: string) => Promise<void>;
  /** Admin direct edit (stays live if already approved). */
  updateArticle: (slug: string, updates: Partial<Article>) => Promise<void>;
  deleteArticle: (slug: string) => void;
  getMyPosts: () => Article[];
  getReviewQueue: () => Article[];
  canApprovePost: (slug: string) => boolean;
  addCategory: (category: Category) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function loadInitialState(): AppState {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          likedArticles: new Set(parsed.likedArticles || []),
          bookmarkedArticles: new Set(parsed.bookmarkedArticles || []),
          followedAuthors: new Set(parsed.followedAuthors || []),
          articles: normalizeArticles(parsed.articles?.length ? parsed.articles : []),
          authors: parsed.authors?.length ? parsed.authors : [],
          categories: parsed.categories?.length ? parsed.categories : [],
          currentUser: parsed.currentUser ?? null,
        };
      } catch (e) {
        console.error("Failed to parse saved data:", e);
      }
    }
  }
  return {
    likedArticles: new Set(),
    bookmarkedArticles: new Set(),
    followedAuthors: new Set(),
    newsletterSubscribed: false,
    articles: normalizeArticles([]),
    authors: [],
    categories: [],
    currentUser: null,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadInitialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          likedArticles: Array.from(state.likedArticles),
          bookmarkedArticles: Array.from(state.bookmarkedArticles),
          followedAuthors: Array.from(state.followedAuthors),
          newsletterSubscribed: state.newsletterSubscribed,
          currentUser: state.currentUser,
        }),
      );
    }
  }, [
    state.likedArticles,
    state.bookmarkedArticles,
    state.followedAuthors,
    state.newsletterSubscribed,
    state.currentUser,
  ]);

  useEffect(() => {
    if (didFetchArticles) return;
    didFetchArticles = true;
    postsApi.list().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setState((prev) => ({ ...prev, articles: res.data as unknown as Article[] }));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (didFetchCategories) return;
    didFetchCategories = true;
    categoriesApi.list().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setState((prev) => ({ ...prev, categories: res.data }));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (didFetchAuthors) return;
    didFetchAuthors = true;
    authorsApi.list().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setState((prev) => ({ ...prev, authors: res.data as unknown as Author[] }));
      }
    }).catch(() => {});
  }, []);

  const requireUser = useCallback((): SessionUser => {
    if (!state.currentUser) throw new Error("Authentication required.");
    return state.currentUser;
  }, [state.currentUser]);

  const toggleLike = (slug: string) => {
    setState((prev) => {
      const newLiked = new Set(prev.likedArticles);
      const newArticles = prev.articles.map((a) => {
        if (a.slug === slug) {
          return { ...a, likes: newLiked.has(slug) ? a.likes - 1 : a.likes + 1 };
        }
        return a;
      });
      if (newLiked.has(slug)) newLiked.delete(slug);
      else newLiked.add(slug);
      return { ...prev, likedArticles: newLiked, articles: newArticles };
    });
  };

  const toggleBookmark = (slug: string) => {
    setState((prev) => {
      const newBookmarked = new Set(prev.bookmarkedArticles);
      const newArticles = prev.articles.map((a) => {
        if (a.slug === slug) {
          return {
            ...a,
            bookmarks: newBookmarked.has(slug) ? a.bookmarks - 1 : a.bookmarks + 1,
          };
        }
        return a;
      });
      if (newBookmarked.has(slug)) newBookmarked.delete(slug);
      else newBookmarked.add(slug);
      return { ...prev, bookmarkedArticles: newBookmarked, articles: newArticles };
    });
  };

  const toggleFollow = (username: string) => {
    setState((prev) => {
      const newFollowed = new Set(prev.followedAuthors);
      const newAuthors = prev.authors.map((a) => {
        if (a.username === username) {
          return {
            ...a,
            followers: newFollowed.has(username) ? a.followers - 1 : a.followers + 1,
          };
        }
        return a;
      });
      if (newFollowed.has(username)) newFollowed.delete(username);
      else newFollowed.add(username);
      return { ...prev, followedAuthors: newFollowed, authors: newAuthors };
    });
  };

  const subscribeNewsletter = () => {
    setState((prev) => ({ ...prev, newsletterSubscribed: true }));
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      if (!res || typeof res !== 'object' || !res.success || !res.data) {
        return false;
      }
      const d = res.data;
      if (!d.token || typeof d.token !== 'string') {
        return false;
      }
      setAuthToken(d.token);
      const decoded = decodeJwtUser(d.token);
      const role = mapSpringRole(decoded.role || d.role);
      const name = decoded.username || email;
      setState((prev) => ({
        ...prev,
        currentUser: {
          id: String(decoded.id || d.id),
          email: decoded.email || d.email,
          name,
          role,
          authorUsername: decoded.username || name,
        },
      }));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setState((prev) => ({ ...prev, currentUser: null }));
  };

  const submitArticle = async (input: SubmitPostInput) => {
    const user = requireUser();
    const res = await postsApi.create({ ...input, submittedBy: user.id });
    if (!res.success) {
      throw new Error(res.message || "Failed to create post");
    }
    const article = res.data as unknown as Article;
    setState((prev) => ({
      ...prev,
      articles: prev.articles.some((a) => a.slug === article.slug)
        ? prev.articles.map((a) => (a.slug === article.slug ? article : a))
        : [article, ...prev.articles],
    }));
  };

  const updateOwnPost = async (slug: string, input: UpdatePostInput) => {
    const user = requireUser();
    const res = await postsApi.update(slug, { ...input, submittedBy: user.id });
    if (!res.success) {
      throw new Error(res.message || "Failed to update post");
    }
    const updated = res.data as unknown as Article;
    setState((prev) => {
      const exists = prev.articles.some((a) => a.slug === slug);
      return {
        ...prev,
        articles: exists
          ? prev.articles.map((a) => (a.slug === slug ? updated : a))
          : [...prev.articles, updated],
      };
    });
  };

  const deleteOwnPost = async (slug: string) => {
    const user = requireUser();
    const res = await postsApi.delete(slug);
    if (!res.success) {
      throw new Error(res.message || "Failed to delete post");
    }
    setState((prev) => ({
      ...prev,
      articles: prev.articles.filter((a) => a.slug !== slug),
    }));
  };

  const approveArticle = async (slug: string, adminMessage?: string) => {
    const user = requireUser();
    try {
      const res = await postsApi.approve(slug, adminMessage);
      if (res.success) {
        setState((prev) => {
          const exists = prev.articles.some((a) => a.slug === slug);
          return {
            ...prev,
            articles: exists
              ? prev.articles.map((a) =>
                  a.slug === slug ? { ...a, ...res.data, status: "approved" as const } : a,
                )
              : [...prev.articles, res.data as unknown as Article],
          };
        });
        return;
      }
    } catch {
      // API unavailable — fall back to local state
    }
    setState((prev) => {
      const exists = prev.articles.some((a) => a.slug === slug);
      return {
        ...prev,
        articles: exists
          ? prev.articles.map((a) =>
              a.slug === slug ? applyApprove(a, user, adminMessage) : a,
            )
          : prev.articles,
      };
    });
  };

  const sendForRework = async (slug: string, adminMessage: string) => {
    const user = requireUser();
    try {
      const res = await postsApi.sendForRework(slug, adminMessage);
      if (res.success) {
        setState((prev) => {
          const exists = prev.articles.some((a) => a.slug === slug);
          return {
            ...prev,
            articles: exists
              ? prev.articles.map((a) =>
                  a.slug === slug ? { ...a, ...res.data, status: "needs_rework" as const } : a,
                )
              : [...prev.articles, res.data as unknown as Article],
          };
        });
        return;
      }
    } catch {
      // API unavailable — fall back to local state
    }
    setState((prev) => {
      const exists = prev.articles.some((a) => a.slug === slug);
      return {
        ...prev,
        articles: exists
          ? prev.articles.map((a) =>
              a.slug === slug ? applyRework(a, user, adminMessage) : a,
            )
          : prev.articles,
      };
    });
  };

  const updateArticle = async (slug: string, updates: Partial<Article>) => {
    const user = requireUser();
    const res = await postsApi.update(slug, updates as UpdatePostInput);
    if (!res.success) {
      throw new Error(res.message || "Failed to update post");
    }
    setState((prev) => {
      const exists = prev.articles.some((a) => a.slug === slug);
      return {
        ...prev,
        articles: exists
          ? prev.articles.map((a) =>
              a.slug === slug ? { ...a, ...res.data } : a,
            )
          : [...prev.articles, res.data as Article],
      };
    });
  };

  const deleteArticle = (slug: string) => {
    const user = requireUser();
    assertAdminCanDelete(user);
    setState((prev) => ({
      ...prev,
      articles: prev.articles.filter((a) => a.slug !== slug),
    }));
  };

  const getMyPosts = useCallback(
    () => (state.currentUser ? filterOwnPosts(state.currentUser, state.articles) : []),
    [state.currentUser, state.articles],
  );

  const getReviewQueue = useCallback(
    () => (state.currentUser ? filterReviewQueue(state.currentUser, state.articles) : []),
    [state.currentUser, state.articles],
  );

  const canApprovePost = useCallback(
    (slug: string) => {
      if (!state.currentUser) return false;
      const article = state.articles.find((a) => a.slug === slug);
      if (!article) return false;
      return canAdminApprovePost(state.currentUser, article);
    },
    [state.currentUser, state.articles],
  );

  const addCategory = useCallback((category: Category) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.some((c) => c.slug === category.slug)
        ? prev.categories
        : [...prev.categories, category],
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      toggleLike,
      toggleBookmark,
      toggleFollow,
      subscribeNewsletter,
      login,
      logout,
      submitArticle,
      updateOwnPost,
      deleteOwnPost,
      approveArticle,
      sendForRework,
      updateArticle,
      deleteArticle,
      getMyPosts,
      getReviewQueue,
      canApprovePost,
      addCategory,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, addCategory],
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
