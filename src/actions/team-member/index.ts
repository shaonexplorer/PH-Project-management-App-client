"use server";

import { cookies } from "next/headers";

export async function getTeamMembers() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const cookie = cookies();
  const token = (await cookie).get("accessToken")?.value;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const response = await fetch(`${apiUrl}/team-member/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${token}`,
    },
  });

  if (!response.ok) {
    // Try to extract an error message from the response body.
    let message = "Failed to fetch team members";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const result = await response.json();
  console.log({ result });
  return result;
}

export async function getTeamMembersByProject(projectId: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const cookie = cookies();
  const token = (await cookie).get("accessToken")?.value;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const response = await fetch(
    `${apiUrl}/team-member/project/${projectId}/members`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${token}`,
      },
    },
  );

  if (!response.ok) {
    // Try to extract an error message from the response body.
    let message = "Failed to fetch team members";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const result = await response.json();
  console.log({ result });
  return result;
}

/**
 * Get all members under a specific Project Manager, excluding members
 * already assigned to a specific project.
 * @param managerId ID of the Project Manager
 * @param projectId Optional project ID to exclude members already in this project
 */
export async function getMembersByProjectManager(
  managerId: string,
  projectId?: string,
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const cookie = cookies();
  const token = (await cookie).get("accessToken")?.value;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const params = new URLSearchParams();
  if (projectId) params.append("excludeProjectId", projectId);

  const response = await fetch(
    `${apiUrl}/team-member/manager/${managerId}/members?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${token}`,
      },
    },
  );

  if (!response.ok) {
    // Try to extract an error message from the response body.
    let message = "Failed to fetch members by project manager";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const result = await response.json();
  console.log({ result });
  return result;
}
