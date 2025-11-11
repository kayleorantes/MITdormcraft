import { Collection, Db, ObjectId } from "npm:mongodb";

// --- Type Definitions ---
// Represents the sub-document for a single comment
export interface Comment {
  commentID: ObjectId;
  authorID: ObjectId;
  text: string;
  createdAt: Date;
}

// Represents the Engagement document in the database
export interface Engagement {
  _id: ObjectId; // Corresponds to postID
  upvotes: ObjectId[]; // Set of userIDs (as ObjectIds)
  comments: Comment[];
}

export class EngagementConcept {
  private readonly engagements: Collection<Engagement>;

  constructor(db: Db) {
    this.engagements = db.collection<Engagement>("engagements");
  }

  /**
   * Retrieves all engagements for a post.
   * Corresponds to the `getEngagementForPost` action.
   */
  async getEngagementForPost(args: {
    postID: string;
  }): Promise<{ upvotes: string[]; comments: Array<{
    commentID: string;
    authorID: string;
    text: string;
    createdAt: string;
  }> }> {
    const { postID } = args;
    
    if (!ObjectId.isValid(postID)) {
      return { upvotes: [], comments: [] }; // Return empty arrays
    }
    const engagement = await this.engagements.findOne({
      _id: new ObjectId(postID),
    });

    if (!engagement) {
      return { upvotes: [], comments: [] }; // Return empty arrays
    }

    // Convert ObjectId[] to string[] for proper JSON serialization
    const upvotes = engagement.upvotes.map((id) => id.toHexString());

    // Convert comments with ObjectId fields to strings
    const comments = engagement.comments.map((comment) => ({
      commentID: comment.commentID.toHexString(),
      authorID: comment.authorID.toHexString(),
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
    }));

    return { upvotes, comments };
  }

  /**
   * Toggles a user's upvote on a post.
   * Corresponds to the `toggleUpvote` action.
   */
  async toggleUpvote(args: {
    postID: string;
    userID: string;
  }): Promise<{ upvoted: boolean; total: number }> {
    const { postID, userID } = args;
    
    if (!ObjectId.isValid(postID) || !ObjectId.isValid(userID)) {
      throw new Error("Invalid postID or userID provided.");
    }
    const postOID = new ObjectId(postID);
    const userOID = new ObjectId(userID);

    const engagement = await this.engagements.findOne({ _id: postOID });
    const isCurrentlyUpvoted =
      engagement?.upvotes?.some((id) => id.equals(userOID)) ?? false;

    let update;
    if (isCurrentlyUpvoted) {
      update = { $pull: { upvotes: userOID } }; // Remove
    } else {
      update = { $addToSet: { upvotes: userOID } }; // Add (won't add duplicates)
    }

    const result = await this.engagements.findOneAndUpdate(
      { _id: postOID },
      update,
      { upsert: true, returnDocument: "after" }, // Create doc if not exist, return new doc
    );

    const newTotal = result?.upvotes?.length ?? (isCurrentlyUpvoted ? 0 : 1);
    return { upvoted: !isCurrentlyUpvoted, total: newTotal };
  }

  /**
   * Adds a comment to a post.
   * Corresponds to the `addComment` action.
   */
  async addComment(args: {
    postID: string;
    authorID: string;
    text: string;
  }): Promise<{
    commentID: string;
    authorID: string;
    text: string;
    createdAt: string;
  }> {
    const { postID, authorID, text } = args;
    
    if (!ObjectId.isValid(postID) || !ObjectId.isValid(authorID)) {
      throw new Error("Invalid postID or authorID provided.");
    }
    const newComment: Comment = {
      commentID: new ObjectId(),
      authorID: new ObjectId(authorID),
      text,
      createdAt: new Date(),
    };

    // Atomically push the new comment
    await this.engagements.updateOne(
      { _id: new ObjectId(postID) },
      { $push: { comments: newComment } },
      { upsert: true }, // Create engagement doc if it doesn't exist
    );
    
    // Return serialized version for JSON response
    return {
      commentID: newComment.commentID.toHexString(),
      authorID: newComment.authorID.toHexString(),
      text: newComment.text,
      createdAt: newComment.createdAt.toISOString(),
    };
  }

  /**
   * Deletes a comment from a post, checking for ownership.
   * Corresponds to the `deleteComment` action.
   */
  async deleteComment(args: {
    postID: string;
    commentID: string;
    userID: string;
  }): Promise<boolean> {
    const { postID, commentID, userID } = args;
    
    if (
      !ObjectId.isValid(postID) ||
      !ObjectId.isValid(commentID) ||
      !ObjectId.isValid(userID)
    ) {
      return false;
    }

    const result = await this.engagements.updateOne(
      { _id: new ObjectId(postID) },
      {
        $pull: {
          comments: {
            commentID: new ObjectId(commentID),
            authorID: new ObjectId(userID), // Enforces ownership
          },
        },
      },
    );

    // modifiedCount will be 1 only if a comment was found AND removed
    return result.modifiedCount === 1;
  }

  /**
   * Edits a comment on a post, checking for ownership.
   * Corresponds to the `editComment` action.
   */
  async editComment(args: {
    postID: string;
    commentID: string;
    userID: string;
    newText: string;
  }): Promise<boolean> {
    const { postID, commentID, userID, newText } = args;
    
    if (
      !ObjectId.isValid(postID) ||
      !ObjectId.isValid(commentID) ||
      !ObjectId.isValid(userID)
    ) {
      return false;
    }

    const result = await this.engagements.updateOne(
      {
        _id: new ObjectId(postID),
        // Find the specific comment authored by the user
        "comments.commentID": new ObjectId(commentID),
        "comments.authorID": new ObjectId(userID),
      },
      {
        // Use the $ positional operator to update the text of the matched comment
        $set: { "comments.$.text": newText },
      },
    );

    // modifiedCount will be 1 only if the comment was found AND updated
    return result.modifiedCount === 1;
  }
}
