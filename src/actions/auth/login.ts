"use server";

import { cookies } from "next/headers"; // Server-side cookie helper

/**
 * Server action to perform user login.
 * Expects an object with `email` and `password` fields.
 * Reads the API base URL from the environment variable `NEXT_PUBLIC_API_URL`.
 * Sends a POST request to `${apiUrl}/auth/login` and returns the parsed JSON.
 * Throws an Error with a meaningful message on failure.
 * If the response contains a `token`, it is stored as an HTTP‑only cookie.
 */
export async function loginAction(data: { email: string; password: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    // Try to extract a message from the response body
    let message = "Login failed";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch (_) {
      // ignore JSON parse error
    }
    throw new Error(message);
  }
  const result = await response.json();
  console.log("Login successful:", result);

  if (result.token) {
    // Store token in an HTTP‑only cookie (adjust options as needed)

    (await cookies()).set({
      name: "accessToken",
      value: result.token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      // Example: 7‑day expiry
      maxAge: 60 * 60 * 24 * 7,
    });

    (await cookies()).set({
      name: "userEmail",
      value: result.user?.email || "",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      // Example: 7‑day expiry
      maxAge: 60 * 60 * 24 * 7,
    });

    (await cookies()).set({
      name: "userName",
      value: result.user?.name || "",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      // Example: 7‑day expiry
      maxAge: 60 * 60 * 24 * 7,
    });

    (await cookies()).set({
      name: "userRole",
      value: result.user?.role || "",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      // Example: 7‑day expiry
      maxAge: 60 * 60 * 24 * 7,
    });

    (await cookies()).set({
      name: "userId",
      value: result.user?.id || "",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      // Example: 7‑day expiry
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return result;
}
