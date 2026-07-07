"use server";

import { cookies } from "next/headers";

export async function getTasksByProject(projectId: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const cookie = cookies();
  const token = (await cookie).get("accessToken")?.value;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const response = await fetch(`${apiUrl}/tasks/project/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${token}`,
    },
  });

  if (!response.ok) {
    // Try to extract an error message from the response body.
    let message = "Failed to fetch project tasks";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const result = await response.json();
  console.log("Project tasks fetched:", result);
  return result;
}