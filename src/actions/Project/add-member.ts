"use server";

import { cookies } from "next/headers";

export async function addNewProjectMember({
  data,
  projectId,
}: {
  data: {
    name: string;
    email: string;
    password: string;
  };
  projectId: string;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const cookie = cookies();
  const token = (await cookie).get("accessToken")?.value;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
  };

  const response = await fetch(`${apiUrl}/projects/${projectId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // Try to extract an error message from the response body.
    let message = "Failed to add member to project";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const result = await response.json();
  console.log("member added to the project:", result);
  return result;
}

export async function addOldProjectMember({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const cookie = cookies();
  const token = (await cookie).get("accessToken")?.value;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const payload = {
    userId: userId,
  };

  const response = await fetch(`${apiUrl}/projects/${projectId}/members/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // Try to extract an error message from the response body.
    let message = "Failed to add member to project";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const result = await response.json();
  console.log("member added to the project:", result);
  return result;
}
