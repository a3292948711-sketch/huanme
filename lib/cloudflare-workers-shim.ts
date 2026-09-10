/**
 * Vercel compatibility shim.
 *
 * Vinext replaces `cloudflare:workers` with real Worker bindings when the
 * project is built for Sites/Cloudflare. Standard Next.js builds do not have
 * that module, so Vercel resolves it to this deliberately empty environment.
 */
export const env = {
  DB: undefined,
  BUCKET: undefined,
};
