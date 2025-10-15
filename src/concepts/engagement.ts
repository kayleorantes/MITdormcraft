import { Collection, Db, ObjectId } from "mongodb";

// --- Type Definitions ---
export interface Comment {
  commentID: ObjectId;
  authorID: ObjectId;
  text: string;
  createdAt: Date;
}

export interface Engagement {
  _id: ObjectId; // Corresponds to postID
  upvotes: ObjectId[];
  comments: Comment[];
}

export class EngagementConcept {
  private readonly engagements: Collection<Engagement>;

  constructor(db: Db) {
    this.engagements = db.collection<Engagement>("engagements");
  }

  async getEngagementForPost(postID: string): Promise<Omit<Engagement, "_id">> {
    if (!ObjectId.isValid(postID)) {
      return { upvotes: [], comments: [] };
    }
    const engagement = await this.engagements.findOne({
      _id: new ObjectId(postID),
    });
    if (!engagement) {
      return { upvotes: [], comments: [] };
    }
    return { upvotes: engagement.upvotes, comments: engagement.comments };
  }

  async toggleUpvote(
    postID: string,
    userID: string,
  ): Promise<{ upvoted: boolean; total: number }> {
    if (!ObjectId.isValid(postID) || !ObjectId.isValid(userID)) {
      throw new Error("Invalid ID provided.");
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
      update = { $addToSet: { upvotes: userOID } }; // Add
    }

    const result = await this.engagements.findOneAndUpdate(
      { _id: postOID },
      update,
      { upsert: true, returnDocument: "after" }, // Create doc if not exist
    );

    const newTotal = result?.upvotes?.length ?? (isCurrentlyUpvoted ? 0 : 1);
    return { upvoted: !isCurrentlyUpvoted, total: newTotal };
  }

  async addComment(
    postID: string,
    userID: string,
    text: string,
  ): Promise<Comment> {
    if (!ObjectId.isValid(postID) || !ObjectId.isValid(userID)) {
      throw new Error("Invalid ID provided.");
    }
    const newComment: Comment = {
      commentID: new ObjectId(),
      authorID: new ObjectId(userID),
      text,
      createdAt: new Date(),
    };

    await this.engagements.updateOne(
      { _id: new ObjectId(postID) },
      { $push: { comments: { $each: [newComment], $sort: { createdAt: 1 } } } }, // Add and keep sorted
      { upsert: true },
    );
    return newComment;
  }
}
