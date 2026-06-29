export type Category = {
  slug: string;
  name: string;
  description: string;
  color: string; // tailwind gradient classes
  icon: string;
};

export type Author = {
  id?: string;
  username: string;
  name: string;
  bio: string;
  headline?: string;
  location?: string;
  company?: string;
  avatarGradient?: string;
  initials?: string;
  coverImage?: string;
  followers: number;
  following: number;
  articlesCount: number;
  totalViews?: number;
  totalLikes?: number;
  totalComments?: number;
  readingTime?: number;
  totalBookmarks?: number;
  badges: string[];
  social: { twitter?: string; github?: string; website?: string; linkedin?: string };
  skills?: string[];
  interests?: string[];
  experience?: { title: string; company: string; startDate: string; endDate?: string; description?: string }[];
  education?: { degree: string; institution: string; year: string }[];
  achievements?: { name: string; icon: string; description: string }[];
  joinedAt?: string;
  lastActive?: string;
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
  createdAt?: string;
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

