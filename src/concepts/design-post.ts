import { Collection, Db, ObjectId } from "mongodb";

// --- Type Definitions ---
export interface Post {
  _id: ObjectId;
  authorID: ObjectId;
  templateID: ObjectId;
  title: string;
  description: string;
  imageURL: string;
  createdAt: Date;
}

export class DesignPostConcept {
  private readonly posts: Collection<Post>;

  constructor(db: Db) {
    this.posts = db.collection<Post>("posts");
  }

  async createPost(
    authorID: string,
    templateID: string,
    title: string,
    description: string,
    imageURL: string,
  ): Promise<Post> {
    if (!ObjectId.isValid(authorID) || !ObjectId.isValid(templateID)) {
      throw new Error("Invalid author or template ID.");
    }
    const post: Omit<Post, "_id"> = {
      authorID: new ObjectId(authorID),
      templateID: new ObjectId(templateID),
      title,
      description,
      imageURL,
      createdAt: new Date(),
    };
    const result = await this.posts.insertOne(post as Post);
    return { _id: result.insertedId, ...post };
  }

  async getPost(postID: string): Promise<Post | null> {
    if (!ObjectId.isValid(postID)) return null;
    return await this.posts.findOne({ _id: new ObjectId(postID) });
  }

  async findPosts(templateID: string): Promise<Post[]> {
    if (!ObjectId.isValid(templateID)) return [];
    return await this.posts.find({ templateID: new ObjectId(templateID) })
      .sort({ createdAt: -1 }) // Sort newest first
      .toArray();
  }

  async deletePost(postID: string, userID: string): Promise<boolean> {
    if (!ObjectId.isValid(postID) || !ObjectId.isValid(userID)) {
      return false;
    }
    const result = await this.posts.deleteOne({
      _id: new ObjectId(postID),
      authorID: new ObjectId(userID), // Ensures only the author can delete
    });
    return result.deletedCount === 1;
  }
}
