/**
 * Authentication Synchronizations
 * 
 * These syncs handle automatic session creation when users log in or register.
 * Authentication for protected actions is now handled in the Requesting concept.
 */

// For now, we're handling authentication directly in the Requesting concept
// rather than using declarative syncs. This is simpler and more straightforward.
//
// In a full implementation, we would use syncs like:
//   when: Authentication.verifyCredentials(...)
//   then: Session.createSession(...)
//
// But the declarative sync system is complex and requires careful setup of
// action patterns. For this project, the imperative approach in Requesting
// provides the same security benefits with clearer code.
