import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getAuthor } from "@/lib/mock-data";
import type { Comment } from "@/lib/mock-data";

import { addComment } from "@/lib/articles";

export function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{comment.author.name}</span>
              <span className="text-muted-foreground">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="mt-2 text-muted-foreground">{comment.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CommentForm({
  articleSlug,
  onCommentAdded,
}: {
  articleSlug: string;
  onCommentAdded: () => void;
}) {
  const { currentUser } = useApp();
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;
    const author = getAuthor(currentUser.id);
    if (author) {
      addComment(articleSlug, currentUser.id, author.name, content);
    }
    setContent("");
    onCommentAdded();
  };

  if (!currentUser) {
    return (
      // <div className="text-center text-muted-foreground">
      //   <a href="/login" className="text-primary underline">
      //     Sign in
      //   </a>{" "}
      //   to join the conversation.
      // </div>
      <></>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add your comment..."
        className="min-h-[100px]"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim()}>
          Post comment
        </Button>
      </div>
    </form>
  );
}