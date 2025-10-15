import { Collection, Db, ObjectId } from "mongodb";

// --- Type Definitions ---
export interface User {
  _id: ObjectId;
  username: string;
  mitKerberos: string;
  bio: string;
  createdAt: Date;
}

export class UserAccountConcept {
  private readonly users: Collection<User>;

  constructor(db: Db) {
    this.users = db.collection<User>("users");
  }

  /**
   * Creates a new user account.
   */
  async createUser(
    username: string,
    mitKerberos: string,
    bio: string,
  ): Promise<User> {
    const existingUser = await this.users.findOne({
      $or: [{ username }, { mitKerberos }],
    });
    if (existingUser) {
      throw new Error("Username or Kerberos already exists.");
    }

    const user: Omit<User, "_id"> = {
      username,
      mitKerberos,
      bio,
      createdAt: new Date(),
    };

    const result = await this.users.insertOne(user as User);
    return { _id: result.insertedId, ...user };
  }

  /**
   * Retrieves a user by their ID.
   */
  async getUser(userID: string): Promise<User | null> {
    if (!ObjectId.isValid(userID)) {
      return null;
    }
    return await this.users.findOne({ _id: new ObjectId(userID) });
  }

  /**
   * Updates a user's biography.
   */
  async updateBio(userID: string, newBio: string): Promise<boolean> {
    if (!ObjectId.isValid(userID)) {
      return false;
    }
    const result = await this.users.updateOne(
      { _id: new ObjectId(userID) },
      { $set: { bio: newBio } },
    );
    return result.modifiedCount === 1;
  }
}
