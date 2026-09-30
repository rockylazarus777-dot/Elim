/**
 * Test-only: an in-process Postgres (PGlite) with just enough of Supabase
 * (anon / authenticated / service_role roles, auth.users, auth.uid()) to run
 * the REAL migration in supabase/migrations/ — so tests exercise the actual
 * wa_ingest_inbound / wa_apply_status functions, grants and triggers.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";

const MIGRATIONS_DIR = join(process.cwd(), "supabase", "migrations");

export async function createTestDatabase(): Promise<PGlite> {
  const db = new PGlite({ extensions: { pg_trgm } });
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    create schema auth;
    create schema extensions;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(coalesce(current_setting('request.jwt.claim.sub', true),
                             (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')), '')::uuid
    $$;
    grant usage on schema auth, public, extensions to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
  `);
  for (const file of readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort()) {
    await db.exec(readFileSync(join(MIGRATIONS_DIR, file), "utf8"));
  }
  return db;
}

const RPC_FUNCTIONS = new Set(["wa_ingest_inbound", "wa_apply_status"]);

/**
 * Minimal stand-in for supabase-js `rpc()`: runs the function as the given
 * database role and returns `{ data, error }` like PostgREST does.
 */
export function rpcAs(db: PGlite, role: "service_role" | "authenticated" | "anon") {
  return async (fn: string, params: Record<string, unknown>) => {
    if (!RPC_FUNCTIONS.has(fn)) throw new Error(`unexpected rpc ${fn}`);
    const keys = Object.keys(params);
    const args = keys.map((k, i) => `${k} => $${i + 1}`).join(", ");
    await db.exec(`set role ${role}`);
    try {
      const { rows } = await db.query<{ result: unknown }>(`select public.${fn}(${args}) as result`, keys.map((k) => params[k]));
      return { data: rows[0]?.result ?? null, error: null };
    } catch (e) {
      const err = e as { code?: string; message?: string };
      return { data: null, error: { code: err.code, message: err.message } };
    } finally {
      await db.exec("reset role");
    }
  };
}
