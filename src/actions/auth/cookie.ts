"use server";

import { cookies } from "next/headers";

/**
 * Server action to retrieve the value of a cookie by its name.
 * Returns the cookie value as a string, or `null` if the cookie is not set.
 * This runs on the server, so the cookie store is accessed via Next.js's
 * `next/headers` API.
 */
export async function getCookieByName(name: string): Promise<string | null> {
  const cookieStore = cookies();
  const cookie = (await cookieStore).get(name);
  return cookie ? cookie.value : null;
}
