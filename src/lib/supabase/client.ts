"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/** Single shared browser client so realtime channels aren't duplicated. */
let browserClient: ReturnType<typeof createBrowserClient> | null = null;
export function getBrowserClient() {
  if (!browserClient) browserClient = createClient();
  return browserClient;
}

export const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@seniorhub.app";
