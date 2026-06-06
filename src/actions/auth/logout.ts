"use server";

import { cookies } from "next/headers";

/**
 * Server action to log the user out by clearing authentication cookies.
 * It removes any cookies that were set during login (access token and user info).
 * Returns a simple success payload.
 */
export async function logoutAction() {
  const cookieStore = cookies();
  const cookieNames = ["accessToken", "userEmail", "userName", "userRole"];
  cookieNames.forEach(async (name) => {
    (await cookieStore).set({
      name,
      value: "",
      path: "/",
      // Setting maxAge to 0 expires the cookie immediately
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
      // In production the cookie should be secure; use env check
      secure: process.env.NODE_ENV === "production",
    });
  });

  return { success: true };
}
