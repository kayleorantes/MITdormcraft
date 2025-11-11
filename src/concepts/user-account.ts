import { Collection, Db, ObjectId } from "npm:mongodb";

// --- Type Definitions ---

/**
 * Represents a User document in the database.
 * This interface matches the 'state' defined in the User concept.
 */
export interface User {
  _id: ObjectId;
  username: string;
  mitKerberos: string;
  bio: string;
  createdAt: Date;
}

// --- Concept Implementation ---

/**
 * Implements the User concept.
 * Manages user profile data, but NOT authentication.
 */
export class UserConcept {
  private readonly users: Collection<User>;

  constructor(db: Db) {
    this.users = db.collection<User>("users");
  }

  /**
   * Retrieves a user by their unique ID.
   * Corresponds to the `getUser` action.
   */
  async getUser(args: { userID: string }): Promise<{
    userID: string;
    username: string;
    mitKerberos: string;
    bio: string;
    createdAt: string;
  } | null> {
    const { userID } = args;
    // Validate that the userID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(userID)) {
      return null;
    }
    const user = await this.users.findOne({ _id: new ObjectId(userID) });
    
    if (!user) {
      return null;
    }
    
    // Convert to JSON-serializable format
    return {
      userID: user._id.toHexString(),
      username: user.username,
      mitKerberos: user.mitKerberos,
      bio: user.bio,
      createdAt: user.createdAt.toISOString(),
    };
  }

  /**
   * Retrieves a user by their public, unique username.
   * Corresponds to the `getUserByUsername` action.
   */
  async getUserByUsername(args: { username: string }): Promise<{
    userID: string;
    username: string;
    mitKerberos: string;
    bio: string;
    createdAt: string;
  } | null> {
    const { username } = args;
    // Find user by the 'username' field
    const user = await this.users.findOne({ username });
    
    if (!user) {
      return null;
    }
    
    // Convert to JSON-serializable format
    return {
      userID: user._id.toHexString(),
      username: user.username,
      mitKerberos: user.mitKerberos,
      bio: user.bio,
      createdAt: user.createdAt.toISOString(),
    };
  }

  /**
   * Updates a user's profile biography.
   * Corresponds to the `updateUserProfile` action.
   */
  async updateUserProfile(args: { userID: string; bio: string }): Promise<boolean> {
    const { userID, bio } = args;
    
    if (!ObjectId.isValid(userID)) {
      return false;
    }

    // Update only the 'bio' field
    const result = await this.users.updateOne(
      { _id: new ObjectId(userID) },
      { $set: { bio: bio } },
    );

    // Return true if exactly one document was modified
    return result.modifiedCount === 1;
  }

  // Note: `createUser` is intentionally omitted.
  // As per the design notes, user creation is handled by the
  // `AuthenticationConcept` to ensure separation of concerns.
}
