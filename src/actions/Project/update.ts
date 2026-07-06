// src/actions/Project/update.ts
// Server action to update an existing project.
// Sends a PUT request to the API endpoint `${NEXT_PUBLIC_API_URL}/projects/${projectId}`.
// Returns the parsed JSON response or throws an error with a helpful message.

"use server";

import { cookies } from "next/headers";

export async function updateProjectAction(data: {
  projectId: string;
  name: string;
  description?: string;
  deadline?: string;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const cookie = cookies();
  const token = (await cookie).get("accessToken")?.value;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const payload = {
    name: data.name,
    description: data.description,
    deadline: data.deadline,
  };

  const response = await fetch(`${apiUrl}/projects/${data.projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // Try to extract an error message from the response body.
    let message = "Failed to update project";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const result = await response.json();
  console.log("Project updated:", result);
  return result;
}