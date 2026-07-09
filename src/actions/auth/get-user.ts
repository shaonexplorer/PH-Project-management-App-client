"use server";

import { cookies } from "next/headers";

/**
 * Server action to get the current authenticated user's info.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const cookieStore = cookies();

  const accessToken = (await cookieStore).get("accessToken")?.value;
  if (!accessToken) {
    return null;
  }

  const userId = (await cookieStore).get("userId")?.value || "";
  const userEmail = (await cookieStore).get("userEmail")?.value || "";
  const userName = (await cookieStore).get("userName")?.value || "";
  const userRole = (await cookieStore).get("userRole")?.value || "";

  return {
    id: userId,
    email: userEmail,
    name: userName,
    role: userRole,
    accessToken,
  };
}