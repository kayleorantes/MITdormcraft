/**
 * Entry point for an application built with concepts + synchronizations.
 * Requires the Requesting concept as a bootstrap concept.
 * Please run "deno run import" or "generate_imports.ts" to prepare "@concepts".
 */
import * as concepts from "@concepts";

// Use the following line instead to run against the test database, which resets each time.
// import * as concepts from "@test-concepts";

const { Engine, Requesting } = concepts;
import { Logging } from "@engine";
import { startRequestingServer } from "@concepts/Requesting/RequestingConcept.ts";
import syncs from "@syncs";

/**
 * Available logging levels:
 *   Logging.OFF
 *   Logging.TRACE - display a trace of the actions.
 *   Logging.VERBOSE - display full record of synchronization.
 */
Engine.logging = Logging.TRACE;

// Give Requesting concept access to all concepts for routing authenticated requests
if (Requesting && typeof Requesting === "object" && "setConcepts" in Requesting) {
  (Requesting as any).setConcepts(concepts);
}

// Give AuthHelper concept access to all concepts
const { AuthHelper } = concepts;
if (AuthHelper && typeof AuthHelper === "object" && "setConcepts" in AuthHelper) {
  (AuthHelper as any).setConcepts(concepts);
}

// Register synchronizations
Engine.register(syncs);

// Start a server to provide the Requesting concept with external/system actions.
startRequestingServer(concepts);
