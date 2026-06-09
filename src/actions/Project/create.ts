// src/actions/Project/create.ts
// Server action to create a new project.
// Expects an object with name, optional description, optional memberId, and dueDate.
// Sends a POST request to the API endpoint `${NEXT_PUBLIC_API_URL}/projects`.
// Returns the parsed JSON response or throws an error with a helpful message.

"use server";

import { cookies } from "next/headers";

export async function createProjectAction(data: {
  name: string;
  description?: string;
  memberId?: string;
  dueDate: string;
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
    deadline: data.dueDate,
  };

  const response = await fetch(`${apiUrl}/projects/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // Try to extract an error message from the response body.
    let message = "Failed to create project";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const result = await response.json();
  console.log("Project created:", result);
  return result;
}
