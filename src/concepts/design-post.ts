import { Collection, Db, ObjectId } from "npm:mongodb";

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
    // Create index on createdAt for efficient sorting
    this.posts.createIndex({ createdAt: -1 });
    // Create index on templateID for efficient filtering
    this.posts.createIndex({ templateID: 1 });
    // Create index on authorID for efficient filtering
    this.posts.createIndex({ authorID: 1 });
  }

  /**
   * Creates a new post.
   * Corresponds to the `createPost` action.
   */
  async createPost(args: {
    authorID: string;
    templateID: string;
    title: string;
    description: string;
    imageURL: string;
  }): Promise<string> {
    const { authorID, templateID, title, description, imageURL } = args;
    
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

    // Return only the string ID, as per the spec
    return result.insertedId.toHexString();
  }

  /**
   * Retrieves a single post by its ID.
   * Corresponds to the `getPost` action.
   */
  async getPost(args: { postID: string }): Promise<{
    _id: string;
    postID: string;
    authorID: string;
    templateID: string;
    title: string;
    description: string;
    imageURL: string;
    createdAt: string;
  } | null> {
    const { postID } = args;
    if (!ObjectId.isValid(postID)) return null;
    const post = await this.posts.findOne({ _id: new ObjectId(postID) });
    
    if (!post) return null;
    
    // Serialize ObjectIds to strings for JSON response
    return {
      _id: post._id.toHexString(),
      postID: post._id.toHexString(), // Add postID for frontend compatibility
      authorID: post.authorID.toHexString(),
      templateID: post.templateID.toHexString(),
      title: post.title,
      description: post.description,
      imageURL: post.imageURL,
      createdAt: post.createdAt.toISOString(),
    };
  }

  /**
   * Finds all posts (no filtering).
   * Corresponds to the `findPosts` action.
   * Returns up to 1000 most recent posts to avoid memory issues.
   */
  async findPosts(args?: { limit?: number; offset?: number; includeImages?: boolean }): Promise<Array<{
    _id: string;
    postID: string;
    authorID: string;
    templateID: string;
    title: string;
    description: string;
    imageURL: string;
    createdAt: string;
  }>> {
    const rawLimit = args?.limit ?? 10; // Default to 10 posts (images are large base64)
    const limit = Math.max(1, Math.min(rawLimit, 50)); // Max 50 posts at once
    const offset = Math.max(0, args?.offset ?? 0);
    const includeImages = args?.includeImages ?? true; // Include images by default
    
    // Use projection to exclude imageURL if not needed (improves performance)
    const projection = includeImages ? {} : { imageURL: 0 };
    
    const posts = await this.posts.find({}, { projection })
      .sort({ createdAt: -1 }) // Sort newest first
      .skip(offset)
      .limit(limit)
      .toArray();
    
    // Serialize ObjectIds to strings for JSON response
    return posts.map(post => ({
      _id: post._id.toHexString(),
      postID: post._id.toHexString(), // Add postID for frontend compatibility
      authorID: post.authorID.toHexString(),
      templateID: post.templateID.toHexString(),
      title: post.title,
      description: post.description,
      imageURL: includeImages ? post.imageURL : '', // Empty string if not included
      createdAt: post.createdAt.toISOString(),
    }));
  }

  /**
   * Finds all posts associated with a specific room template.
   * Corresponds to the `findPostsByTemplate` action.
   */
  async findPostsByTemplate(args: { templateID: string; limit?: number; offset?: number }): Promise<Array<{
    _id: string;
    postID: string;
    authorID: string;
    templateID: string;
    title: string;
    description: string;
    imageURL: string;
    createdAt: string;
  }>> {
    const { templateID } = args;
    const rawLimit = args?.limit ?? 50;
    const limit = Math.max(1, Math.min(rawLimit, 200));
    const offset = Math.max(0, args?.offset ?? 0);
    if (!ObjectId.isValid(templateID)) return [];
    const posts = await this.posts.find({ templateID: new ObjectId(templateID) })
      .sort({ createdAt: -1 }) // Sort newest first
      .skip(offset)
      .limit(limit)
      .toArray();
    
    // Serialize ObjectIds to strings for JSON response
    return posts.map(post => ({
      _id: post._id.toHexString(),
      postID: post._id.toHexString(), // Add postID for frontend compatibility
      authorID: post.authorID.toHexString(),
      templateID: post.templateID.toHexString(),
      title: post.title,
      description: post.description,
      imageURL: post.imageURL,
      createdAt: post.createdAt.toISOString(),
    }));
  }

  /**
   * Finds all posts created by a specific author.
   * Corresponds to the `findPostsByAuthor` action.
   */
  async findPostsByAuthor(args: { authorID: string; limit?: number; offset?: number }): Promise<Array<{
    _id: string;
    postID: string;
    authorID: string;
    templateID: string;
    title: string;
    description: string;
    imageURL: string;
    createdAt: string;
  }>> {
    const { authorID } = args;
    const rawLimit = args?.limit ?? 50;
    const limit = Math.max(1, Math.min(rawLimit, 200));
    const offset = Math.max(0, args?.offset ?? 0);
    if (!ObjectId.isValid(authorID)) return [];
    const posts = await this.posts.find({ authorID: new ObjectId(authorID) })
      .sort({ createdAt: -1 }) // Sort newest first
      .skip(offset)
      .limit(limit)
      .toArray();
    
    // Serialize ObjectIds to strings for JSON response
    return posts.map(post => ({
      _id: post._id.toHexString(),
      postID: post._id.toHexString(), // Add postID for frontend compatibility
      authorID: post.authorID.toHexString(),
      templateID: post.templateID.toHexString(),
      title: post.title,
      description: post.description,
      imageURL: post.imageURL,
      createdAt: post.createdAt.toISOString(),
    }));
  }

  /**
   * Edits the content of a post, checking for ownership.
   * Corresponds to the `editPost` action.
   */
  async editPost(args: {
    postID: string;
    userID: string;
    title?: string;
    description?: string;
    imageURL?: string;
  }): Promise<boolean> {
    const { postID, userID, title, description, imageURL } = args;
    
    if (!ObjectId.isValid(postID) || !ObjectId.isValid(userID)) {
      return false;
    }

    // Build an update object with only the fields that were provided
    const updateFields: Partial<
      Omit<Post, "_id" | "authorID" | "templateID" | "createdAt">
    > = {};
    if (title) {
      updateFields.title = title;
    }
    if (description) {
      updateFields.description = description;
    }
    if (imageURL) {
      updateFields.imageURL = imageURL;
    }

    // If no fields to update, return true (as no-op is successful)
    if (Object.keys(updateFields).length === 0) {
      return true;
    }

    const result = await this.posts.updateOne(
      {
        _id: new ObjectId(postID),
        authorID: new ObjectId(userID), // Enforces ownership
      },
      { $set: updateFields },
    );

    // modifiedCount will be 1 only if the post was found AND the user was the author
    return result.modifiedCount === 1;
  }

  /**
   * Deletes a post, checking for ownership.
   * Corresponds to the `deletePost` action.
   */
  async deletePost(args: { postID: string; userID: string }): Promise<boolean> {
    const { postID, userID } = args;
    
    if (!ObjectId.isValid(postID) || !ObjectId.isValid(userID)) {
      return false;
    }
    const result = await this.posts.deleteOne({
      _id: new ObjectId(postID),
      authorID: new ObjectId(userID), // Enforces only the author can delete
    });
    return result.deletedCount === 1;
  }
}

export default DesignPostConcept;
