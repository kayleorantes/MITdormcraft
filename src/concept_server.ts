import { Hono } from "jsr:@hono/hono";
import { cors } from "jsr:@hono/hono/cors"; // FIX: Add CORS for frontend access
import { getDb } from "@utils/database.ts";
import { walk } from "jsr:@std/fs";
import { parseArgs } from "jsr:@std/cli/parse-args";
import { toFileUrl } from "jsr:@std/path/to-file-url";
import { parse } from "jsr:@std/path/parse"; // FIX: Import 'parse' to get filenames

// Parse command-line arguments for port and base URL
const flags = parseArgs(Deno.args, {
  string: ["port", "baseUrl"],
  default: {
    port: "8000",
    baseUrl: "/api",
  },
});

const PORT = parseInt(flags.port, 10);
const BASE_URL = flags.baseUrl;
const CONCEPTS_DIR = "src/concepts";

/**
 * Main server function to initialize DB, load concepts, and start the server.
 */
async function main() {
  const [db] = await getDb();
  const app = new Hono();

  // FIX: Add CORS middleware. This is CRITICAL for the frontend to work.
  app.use(
    `${BASE_URL}/*`,
    cors({
      origin: "*", // Allow all origins for development
      allowMethods: ["GET", "POST", "OPTIONS"],
    }),
  );

  app.get("/", (c) => c.text("Concept Server is running."));

  // --- Dynamic Concept Loading and Routing ---
  console.log(`Scanning for concepts in ./${CONCEPTS_DIR}...`);

  // FIX: Change 'walk' to look for files, not directories, and skip test files.
  for await (
    const entry of walk(CONCEPTS_DIR, {
      maxDepth: 1,
      includeDirs: false, // Find files
      includeFiles: true, // Not directories
      exts: [".ts"], // Only look for TypeScript files
      skip: [/\.test\.ts$/], // Ignore test files
    })
  ) {
    if (entry.path === CONCEPTS_DIR) continue;

    // FIX: Get the concept name from the filename (e.g., "user" from "user.ts")
    const conceptFileName = parse(entry.path).name;
    const conceptFilePath = entry.path; // The direct path to the file

    try {
      const modulePath = toFileUrl(Deno.realPathSync(conceptFilePath)).href;
      const module = await import(modulePath);
      // FIX: Dynamically find the exported class that ends with 'Concept'
      const ConceptClass = Object.values(module).find(
        (m) => typeof m === "function" && m.name.endsWith("Concept"),
      ) as any;

      if (!ConceptClass) {
        console.warn(
          `! No valid concept class found in ${conceptFilePath}. Skipping.`,
        );
        continue;
      }

      const instance = new ConceptClass(db);
      // FIX: The API name should match the filename (e.g., "room-template")
      const conceptApiName = conceptFileName; // FIX: Keep the dash
      console.log(
        `- Registering concept: ${conceptFileName} at ${BASE_URL}/${conceptApiName}`,
      );

      const methodNames = Object.getOwnPropertyNames(
        Object.getPrototypeOf(instance),
      )
        .filter((name) =>
          name !== "constructor" && typeof instance[name] === "function"
        );

      for (const methodName of methodNames) {
        const actionName = methodName;
        const route = `${BASE_URL}/${conceptApiName}/${actionName}`;

        // FIX: Add logic to create GET routes for read methods.
        if (actionName.startsWith("get") || actionName.startsWith("find")) {
          app.get(route, async (c) => {
            try {
              const params = c.req.query();
              const result = await instance[methodName](params);
              return c.json(result);
            } catch (e) {
              console.error(`Error in ${conceptFileName}.${methodName}:`, e);
              return c.json({ error: e.message }, 500);
            }
          });
          console.log(`  - Endpoint: GET ${route}`);
        } else {
          // Keep original POST logic for all other methods.
          app.post(route, async (c) => {
            try {
              const body = await c.req.json().catch(() => ({}));
              // FIX: Spread the values from the body as arguments.
              const result = await instance[methodName](
                ...Object.values(body),
              );
              return c.json(result);
            } catch (e) {
              console.error(`Error in ${conceptFileName}.${methodName}:`, e);
              return c.json({ error: e.message }, 500);
            }
          });
          console.log(`  - Endpoint: POST ${route}`);
        }
      }
    } catch (e) {
      console.error(
        `! Error loading concept from ${conceptFilePath}:`,
        e,
      );
    }
  }

  console.log(`\nServer listening on http://localhost:${PORT}`);
  Deno.serve({ port: PORT }, app.fetch);
}

// Run the server
main();
