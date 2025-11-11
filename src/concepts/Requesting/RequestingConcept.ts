import { Hono } from "jsr:@hono/hono";
import { cors } from "jsr:@hono/hono/cors";
import { parseArgs } from "jsr:@std/cli/parse-args";

/**
 * The Requesting concept handles HTTP requests and routes them either:
 * 1. Directly to concept actions (included actions - default)
 * 2. As request actions for syncing (excluded actions)
 * 
 * This allows for secure authentication and synchronization patterns.
 */

// Configuration for which actions to include (pass through) or exclude (sync)
const INCLUDED_ACTIONS: Set<string> = new Set([
  // Read-only actions that don't need authentication
  "RoomTemplate/getTemplate",
  "RoomTemplate/findTemplates",
  "DesignPost/getPost",
  "DesignPost/findPosts",
  "DesignPost/findPostsByTemplate",
  "DesignPost/findPostsByAuthor",
  "Engagement/getEngagementForPost",
  "UserAccount/getUser",
  "UserAccount/getUserByUsername",
  
  // Authentication actions (create/verify sessions)
  "Authentication/registerAndCreateAccount",
  "Authentication/verifyCredentials",
  "Session/createSession",
  "Session/validateSession",
  "Session/endSession",
  
  // Auth helper endpoints (convenience methods)
  "AuthHelper/register",
  "AuthHelper/login",
  "AuthHelper/logout",
  
  // Room template creation (public - anyone can add templates)
  "RoomTemplate/addTemplate",
]);

const EXCLUDED_ACTIONS: Set<string> = new Set([
  // Write actions that require authentication
  "DesignPost/createPost",
  "DesignPost/editPost",
  "DesignPost/deletePost",
  "Engagement/toggleUpvote",
  "Engagement/addComment",
  "Engagement/editComment",
  "Engagement/deleteComment",
  "UserAccount/updateUserProfile",
  // "RoomTemplate/addTemplate",  // Moved to INCLUDED - public endpoint
  "RoomTemplate/updateTemplate",  // Keep these protected (admin only)
  "RoomTemplate/deleteTemplate",
]);

export class RequestingConcept {
  private concepts: any;

  /**
   * Set the concepts instance so we can route to them
   */
  setConcepts(concepts: any) {
    this.concepts = concepts;
  }

  /**
   * The respond action - sends a response back to the requester.
   * This is called by syncs after processing a request.
   */
  async respond(args: { request: string; [key: string]: any }): Promise<void> {
    // In a real implementation, this would send the response back to the client
    // For now, we just log it
    console.log("Response for request:", args.request, "=>", args);
  }

  /**
   * The request action - called for excluded actions.
   * This handles authentication and routing for protected actions.
   */
  async request(args: { path: string; params: Record<string, any> }): Promise<any> {
    const { path, params } = args;
    
    if (!this.concepts) {
      throw new Error("Concepts not initialized");
    }

    let userID: string | null = null;

    // Try to authenticate via token first
    if (params.token) {
      userID = await this.concepts.Session.validateSession({ token: params.token });
      if (!userID) {
        throw new Error("Unauthorized: Invalid or expired session");
      }
    }
    // If no token but authorID is provided (for backwards compatibility)
    else if (params.authorID) {
      userID = params.authorID;
    }
    // If no authentication provided at all
    else {
      throw new Error("Unauthorized: No authentication provided (token or authorID required)");
    }

    // Route to the appropriate action based on path
    const [conceptName, actionName] = path.split("/");
    const concept = this.concepts[conceptName];

    if (!concept || typeof concept[actionName] !== "function") {
      throw new Error(`Action ${path} not found`);
    }

    // Call the action with the authenticated user
    return await this.routeAction(concept, actionName, userID, params);
  }

  /**
   * Route authenticated requests to the appropriate concept action
   */
  private async routeAction(
    concept: any,
    actionName: string,
    userID: string,
    params: Record<string, any>
  ): Promise<any> {
    // Remove token from params since we've already validated it
    const { token, ...actionParams } = params;

    switch (actionName) {
      // Design Post actions
      case "createPost":
        // createPost({authorID, templateID, title, description, imageURL})
        return await concept.createPost({
          authorID: userID,
          templateID: actionParams.templateID,
          title: actionParams.title,
          description: actionParams.description,
          imageURL: actionParams.imageURL
        });

      case "editPost":
        // editPost({postID, userID, title?, description?, imageURL?})
        return await concept.editPost({
          postID: actionParams.postID,
          userID,
          title: actionParams.title,
          description: actionParams.description,
          imageURL: actionParams.imageURL
        });

      case "deletePost":
        // deletePost({postID, userID})
        return await concept.deletePost({
          postID: actionParams.postID,
          userID
        });

      // Engagement actions
      case "toggleUpvote":
        // toggleUpvote({postID, userID})
        return await concept.toggleUpvote({
          postID: actionParams.postID,
          userID
        });

      case "addComment":
        // addComment({postID, authorID, text})
        return await concept.addComment({
          postID: actionParams.postID,
          authorID: userID,
          text: actionParams.text
        });

      case "editComment":
        // editComment({postID, commentID, userID, newText})
        return await concept.editComment({
          postID: actionParams.postID,
          commentID: actionParams.commentID,
          userID,
          newText: actionParams.newText
        });

      case "deleteComment":
        // deleteComment({postID, commentID, userID})
        return await concept.deleteComment({
          postID: actionParams.postID,
          commentID: actionParams.commentID,
          userID
        });

      // User Account actions
      case "updateUserProfile":
        // updateUserProfile({userID, bio})
        return await concept.updateUserProfile({
          userID,
          bio: actionParams.bio
        });

      // Room Template actions (admin only - for now just require auth)
      case "addTemplate":
        // addTemplate({dormName, roomType})
        return await concept.addTemplate({
          dormName: actionParams.dormName,
          roomType: actionParams.roomType
        });

      case "updateTemplate":
        // updateTemplate({templateID, dormName?, roomType?})
        return await concept.updateTemplate({
          templateID: actionParams.templateID,
          dormName: actionParams.dormName,
          roomType: actionParams.roomType
        });

      case "deleteTemplate":
        // deleteTemplate({templateID})
        return await concept.deleteTemplate({
          templateID: actionParams.templateID
        });

      default:
        throw new Error(`Action ${actionName} not supported`);
    }
  }

  /**
   * Check if an action is explicitly included
   */
  static isIncluded(path: string): boolean {
    return INCLUDED_ACTIONS.has(path);
  }

  /**
   * Check if an action is explicitly excluded
   */
  static isExcluded(path: string): boolean {
    return EXCLUDED_ACTIONS.has(path);
  }

  /**
   * Check if an action is verified (either included or excluded)
   */
  static isVerified(path: string): boolean {
    return INCLUDED_ACTIONS.has(path) || EXCLUDED_ACTIONS.has(path);
  }
}

/**
 * Start the HTTP server that routes requests to concepts
 */
export async function startRequestingServer(concepts: any) {
  const flags = parseArgs(Deno.args, {
    string: ["port", "baseUrl"],
    default: {
      port: "8000",
      baseUrl: "/api",
    },
  });

  const PORT = parseInt(flags.port, 10);
  const BASE_URL = flags.baseUrl;

  const app = new Hono();

  // Enable CORS for frontend access
  app.use(
    `${BASE_URL}/*`,
    cors({
      origin: "*", // Allow all origins for development
      allowMethods: ["GET", "POST", "OPTIONS"],
    }),
  );

  app.get("/", (c) => c.text("Concept Server with Syncs is running."));

  // Extract all concept names from the imported concepts
  const conceptNames = Object.keys(concepts).filter(
    (name) => name !== "Engine" && name !== "db" && name !== "client"
  );

  console.log("\nRegistering routes...");
  const unverifiedRoutes: string[] = [];
  const includedRoutes: string[] = [];
  const excludedRoutes: string[] = [];

  // Register routes for all concept actions
  for (const conceptName of conceptNames) {
    const concept = concepts[conceptName];
    if (!concept || typeof concept !== "object") continue;

    // Get all methods from the concept
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(concept)
    ).filter((name) => name !== "constructor" && typeof concept[name] === "function");

    for (const methodName of methodNames) {
      const path = `${conceptName}/${methodName}`;
      const route = `${BASE_URL}/${path}`;

      // Check if this action is verified
      if (!RequestingConcept.isVerified(path)) {
        unverifiedRoutes.push(path);
      } else if (RequestingConcept.isIncluded(path)) {
        includedRoutes.push(path);
      } else if (RequestingConcept.isExcluded(path)) {
        excludedRoutes.push(path);
      }

      // Register the route
      app.post(route, async (c) => {
        try {
          const body = await c.req.json().catch(() => ({}));

          // If excluded, trigger the request action for syncing
          if (RequestingConcept.isExcluded(path)) {
            const requestingConcept = concepts.Requesting;
            if (!requestingConcept) {
              return c.json({ error: "Requesting concept not found" }, 500);
            }

            // Extract authentication from headers or body
            const tokenFromHeader = c.req.header("Authorization")?.replace("Bearer ", "") || 
                                   c.req.header("X-Session-Token");
            const userIDFromHeader = c.req.header("X-User-ID");
            const tokenFromBody = body.token;
            const token = tokenFromBody || tokenFromHeader;

            // Build params with authentication
            let params = { ...body };
            if (token) {
              params.token = token;
            } else if (userIDFromHeader && !params.authorID) {
              // If no token but userID in header, use it as authorID for authentication
              params.authorID = userIDFromHeader;
            }

            // Trigger Requesting.request action (will be handled by syncs)
            console.log(`[EXCLUDED] ${path} -> Requesting.request`);
            const result = await requestingConcept.request({ path, params });
            return c.json(result);
          }

          // Otherwise, pass through directly to the concept action (included)
          console.log(`[INCLUDED] ${path} -> ${conceptName}.${methodName}`);
          // Pass body object directly (or empty object if no body)
          const result = await concept[methodName](Object.keys(body).length > 0 ? body : {});
          return c.json(result);
        } catch (e: any) {
          console.error(`Error in ${path}:`, e);
          return c.json({ error: e.message }, 500);
        }
      });
    }
  }

  // Print route status
  if (unverifiedRoutes.length > 0) {
    console.log("\n⚠️  UNVERIFIED ROUTES (not explicitly included or excluded):");
    unverifiedRoutes.forEach(route => console.log(`  - ${route}`));
  }

  if (includedRoutes.length > 0) {
    console.log("\n✅ INCLUDED ROUTES (passed through directly):");
    includedRoutes.forEach(route => console.log(`  - ${route}`));
  }

  if (excludedRoutes.length > 0) {
    console.log("\n🔒 EXCLUDED ROUTES (require syncs):");
    excludedRoutes.forEach(route => console.log(`  - ${route}`));
  }

  console.log(`\n🚀 Server listening on http://localhost:${PORT}`);
  Deno.serve({ port: PORT }, app.fetch);
}

