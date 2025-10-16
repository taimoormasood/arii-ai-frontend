import { z } from "zod";

/**
 * This file is used to define the schema for your environment variables.
 * It uses Zod to validate the variables at build time.
 *
 * You can add your server-side variables to the `server` object.
 * You can add your client-side variables to the `client` object.
 *
 * Client-side variables MUST be prefixed with `NEXT_PUBLIC_`.
 */

// Schema for client-side (public) environment variables
const client = z.object({
  NEXT_PUBLIC_API_URL: z.string().url({
    message: "API URL must be a valid URL.",
  }),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1, {
    message: "Google Maps API Key cannot be empty.",
  }),
});

// Schema for server-side (private) environment variables
const server = z.object({
  // Example for a server variable, you can add your own here
  // DATABASE_URL: z.string().url(),
});

// We need to manually destruct `process.env` to make it available for client-side code.
// This is because Next.js edge runtimes don't support `process.env` destructuring.
const processEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  // Add server variables here if you have any
  // DATABASE_URL: process.env.DATABASE_URL,
};

// Merge and parse the schemas
// We will parse client and server variables separately to provide better error messages.
const parsedClient = client.safeParse(processEnv);
const parsedServer = server.safeParse(processEnv);

if (!parsedClient.success) {
  throw new Error(
    "Invalid client-side environment variables.",
    parsedClient.error.flatten().fieldErrors
  );
}

if (!parsedServer.success) {
  throw new Error(
    "Invalid server-side environment variables.",
    parsedServer.error.flatten().fieldErrors
  );
}

// Export the validated and typed environment variables
export const env = {
  ...parsedClient.data,
  ...parsedServer.data,
};
