import type { User } from "@concepts/user-account.ts";
import type { Post } from "@concepts/design-post.ts";
import type { Comment } from "@concepts/engagement.ts";

export function sanitizeUser(user: User) {
  return {
    userID: user._id.toHexString(),
    username: user.username,
    mitKerberos: user.mitKerberos,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
  };
}

export function sanitizePost(post: Post | any) {
  // Handle both Post type and enriched post objects with template data
  const basePost = {
    postID: post._id?.toHexString() || post.postID,
    authorID: post.authorID?.toHexString ? post.authorID.toHexString() : post.authorID,
    templateID: post.templateID?.toHexString ? post.templateID.toHexString() : post.templateID,
    title: post.title,
    description: post.description,
    imageURL: post.imageURL,
    createdAt: post.createdAt?.toISOString ? post.createdAt.toISOString() : post.createdAt,
  };
  
  // Include dormName and roomType if present
  if (post.dormName !== undefined || post.roomType !== undefined) {
    return {
      ...basePost,
      dormName: post.dormName || "",
      roomType: post.roomType || "",
    };
  }
  
  return basePost;
}

export function sanitizeComment(comment: Comment) {
  return {
    commentID: comment.commentID.toHexString(),
    authorID: comment.authorID.toHexString(),
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
  };
}

export function getTemplateAdmins(): Set<string> {
  const env = Deno.env.get("TEMPLATE_ADMIN_KERBEROS") ?? "";
  return new Set(
    env.split(",")
      .map((token) => token.trim().toLowerCase())
      .filter((token) => token.length > 0),
  );
}

export function isTemplateAdmin(user: { mitKerberos: string }): boolean {
  const admins = getTemplateAdmins();
  return admins.size === 0 || admins.has(user.mitKerberos.toLowerCase());
}
