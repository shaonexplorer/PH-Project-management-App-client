"use server";

import { cookies } from "next/headers";

export async function updateTask(data: {
  taskId: string;
  status?: string;
  title?: string;
  description?: string;
  priority?: "Low" | "Medium" | "High" | "Critical";
  deadline?: string;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const cookie = cookies();
  const token = (await cookie).get("accessToken")?.value;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const payload: Record<string, unknown> = {};
  if (data.status !== undefined) payload.status = data.status;
  if (data.title !== undefined) payload.title = data.title;
  if (data.description !== undefined) payload.description = data.description;
  if (data.priority !== undefined) payload.priority = data.priority;
  if (data.deadline !== undefined) payload.dueDate = data.deadline;

  const response = await fetch(`${apiUrl}/tasks/${data.taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // Try to extract an error message from the response body.
    let message = "Failed to update task";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const result = await response.json();
  console.log("task updated:", result);
  return result;
}
