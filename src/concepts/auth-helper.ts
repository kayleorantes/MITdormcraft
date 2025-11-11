/**
 * Authentication Helper Concept
 * Provides convenience methods that combine authentication + session creation
 * This makes frontend integration simpler by reducing the number of API calls needed
 */

export class AuthHelperConcept {
  private concepts: any;

  setConcepts(concepts: any) {
    this.concepts = concepts;
  }

  /**
   * Combined registration + login endpoint
   * Creates a user account AND returns a session token in one call
   */
  async register(args: {
    username: string;
    mitKerberos: string;
    password: string;
    bio?: string;
  }): Promise<{
    userID: string;
    username: string;
    token: string;
  }> {
    const { username, mitKerberos, password, bio = "" } = args;

    // 1. Register the user
    const userID = await this.concepts.Authentication.registerAndCreateAccount({
      username,
      mitKerberos,
      bio,
      credential_data: password,
    });

    // 2. Create a session
    const token = await this.concepts.Session.createSession({ userID });

    // 3. Return user info + token
    return {
      userID,
      username,
      token,
    };
  }

  /**
   * Combined login endpoint
   * Verifies credentials AND returns a session token in one call
   */
  async login(args: {
    mitKerberos: string;
    password: string;
  }): Promise<{
    userID: string;
    token: string;
  } | null> {
    const { mitKerberos, password } = args;

    // 1. Verify credentials
    const userID = await this.concepts.Authentication.verifyCredentials({
      mitKerberos,
      credential_data: password,
    });

    if (!userID) {
      return null; // Invalid credentials
    }

    // 2. Create a session
    const token = await this.concepts.Session.createSession({ userID });

    // 3. Return user ID + token
    return {
      userID,
      token,
    };
  }

  /**
   * Logout endpoint
   * Ends the session for the given token
   */
  async logout(args: { token: string }): Promise<boolean> {
    const { token } = args;
    return await this.concepts.Session.endSession({ token });
  }
}

