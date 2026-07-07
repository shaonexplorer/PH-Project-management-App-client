"use server";

import { cookies } from "next/headers";

export async function getAssignedTasks(userId: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const cookie = cookies();
  const token = (await cookie).get("accessToken")?.value;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const response = await fetch(`${apiUrl}/tasks/team/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${token}`,
    },
  });

  if (!response.ok) {
    // Try to extract an error message from the response body.
    let message = "Failed to fetch assigned tasks";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const result = await response.json();
  console.log("Assigned tasks fetched:", result);
  return result;
}