import { Collection, Db, ObjectId } from "npm:mongodb";
import { User } from "./user-account.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

// --- Type Definitions ---

export interface Credential {
  _id: ObjectId;
  userID: ObjectId; // Foreign key to User
  mitKerberos: string;
  credentialHash: string;
}

export class AuthenticationConcept {
  private readonly users: Collection<User>;
  private readonly credentials: Collection<Credential>;

  constructor(db: Db) {
    this.users = db.collection<User>("users");
    this.credentials = db.collection<Credential>("credentials");
    // Create indexes for fast, unique lookups
    this.users.createIndex({ username: 1 }, { unique: true });
    this.credentials.createIndex({ mitKerberos: 1 }, { unique: true });
  }

  /**
   * Registers a new user, creating both a User and a Credential document.
   */
  async registerAndCreateAccount(
    params: { username: string; mitKerberos: string; bio: string; credential_data: string } | string,
    mitKerberosParam?: string,
    bioParam?: string,
    credential_dataParam?: string,
  ): Promise<string> {
    // Handle both object and individual parameters for flexibility
    let username: string, mitKerberos: string, bio: string, credential_data: string;
    
    if (typeof params === 'object') {
      ({ username, mitKerberos, bio, credential_data } = params);
    } else {
      username = params;
      mitKerberos = mitKerberosParam!;
      bio = bioParam!;
      credential_data = credential_dataParam!;
    }
    // 1. Check for duplicates
    const existingUser = await this.users.findOne({ username });
    if (existingUser) {
      throw new Error(`Username '${username}' already exists.`);
    }
    const existingCred = await this.credentials.findOne({ mitKerberos });
    if (existingCred) {
      throw new Error(`Kerberos '${mitKerberos}' is already registered.`);
    }

    // 2. Hash the password
    const credentialHash = await bcrypt.hash(credential_data);

    // 3. Create the User document
    const userDoc: Omit<User, "_id"> = {
      username,
      mitKerberos,
      bio,
      createdAt: new Date(),
    };
    const userResult = await this.users.insertOne(userDoc as User);
    const userID = userResult.insertedId;

    // 4. Create the Credential document
    const credDoc: Omit<Credential, "_id"> = {
      userID,
      mitKerberos,
      credentialHash,
    };
    await this.credentials.insertOne(credDoc as Credential);

    return userID.toHexString();
  }

  /**
   * Verifies a user's credentials and returns their userID if valid.
   */
  async verifyCredentials(
    params: { mitKerberos: string; credential_data: string } | string,
    credential_dataParam?: string,
  ): Promise<string | null> {
    // Handle both object and individual parameters for flexibility
    let mitKerberos: string, credential_data: string;
    
    if (typeof params === 'object') {
      ({ mitKerberos, credential_data } = params);
    } else {
      mitKerberos = params;
      credential_data = credential_dataParam!;
    }
    // 1. Find the user by kerberos
    const cred = await this.credentials.findOne({ mitKerberos });
    if (!cred) {
      return null; // No such user
    }

    // 2. Verify the password hash
    const isValid = await bcrypt.compare(credential_data, cred.credentialHash);
    if (!isValid) {
      return null; // Invalid password
    }

    // 3. Success
    return cred.userID.toHexString();
  }
}

export default AuthenticationConcept;
