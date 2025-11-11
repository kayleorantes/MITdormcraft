import { Collection, Db, ObjectId } from "npm:mongodb";

/**
 * Session Concept
 * Manages user sessions for authentication and authorization.
 * A session associates a token with a user for a limited time.
 */

export interface Session {
  _id: ObjectId;
  userID: ObjectId;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

export class SessionConcept {
  private readonly sessions: Collection<Session>;
  private readonly SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor(db: Db) {
    this.sessions = db.collection<Session>("sessions");
    // Create index for fast token lookups
    this.sessions.createIndex({ token: 1 }, { unique: true });
    // Auto-delete expired sessions
    this.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  }

  /**
   * Creates a new session for a user.
   * Returns the session token.
   */
  async createSession(params: { userID: string } | string): Promise<string> {
    const userID = typeof params === 'object' ? params.userID : params;
    
    if (!ObjectId.isValid(userID)) {
      throw new Error("Invalid user ID");
    }

    // Generate a secure random token
    const token = this.generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_DURATION_MS);

    const sessionDoc: Omit<Session, "_id"> = {
      userID: new ObjectId(userID),
      token,
      createdAt: now,
      expiresAt,
    };

    await this.sessions.insertOne(sessionDoc as Session);
    return token;
  }

  /**
   * Validates a session token and returns the associated user ID.
   * Returns null if the token is invalid or expired.
   */
  async validateSession(params: { token: string } | string): Promise<string | null> {
    const token = typeof params === 'object' ? params.token : params;
    const session = await this.sessions.findOne({
      token,
      expiresAt: { $gt: new Date() }, // Check not expired
    });

    if (!session) {
      return null;
    }

    return session.userID.toHexString();
  }

  /**
   * Ends a session by deleting it.
   */
  async endSession(args: { token: string }): Promise<boolean> {
    const { token } = args;
    const result = await this.sessions.deleteOne({ token });
    return result.deletedCount === 1;
  }

  /**
   * Ends all sessions for a specific user.
   */
  async endAllUserSessions(userID: string): Promise<number> {
    if (!ObjectId.isValid(userID)) {
      return 0;
    }
    const result = await this.sessions.deleteMany({
      userID: new ObjectId(userID),
    });
    return result.deletedCount;
  }

  /**
   * Generates a secure random token.
   */
  private generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
}

