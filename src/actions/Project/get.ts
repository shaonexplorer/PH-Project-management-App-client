"use server";

import { cookies } from "next/headers";

export async function getMyProjects() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const cookie = cookies();
  const token = (await cookie).get("accessToken")?.value;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const response = await fetch(`${apiUrl}/projects/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${token}`,
    },
  });

  if (!response.ok) {
    // Try to extract an error message from the response body.
    let message = "Failed to fetch projects";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const result = await response.json();
  console.log("Project fetched:", result);
  return result;
}

/**
 * Get a single project by ID.
 * Used to fetch project details including the creator (Project Manager).
 * @param projectId ID of the project
 */
export async function getProjectById(projectId: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const cookie = cookies();
  const token = (await cookie).get("accessToken")?.value;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const response = await fetch(`${apiUrl}/projects/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${token}`,
    },
  });

  if (!response.ok) {
    // Try to extract an error message from the response body.
    let message = "Failed to fetch project";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const result = await response.json();
  console.log("Project fetched by ID:", result);
  return result;
}
