 

"use client";

import { useEffect, useState } from "react";

/**
 * Hook to fetch and provide the user role from cookies.
 * This is a client-side hook that reads the userRole cookie.
 * Returns null while loading, and the role string once available.
 */
export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use setTimeout to ensure async execution after render
    // This avoids the "Calling setState synchronously" warning
    const timer = setTimeout(() => {
      (async () => {
        try {
          const { getCookieByName } = await import(
            "@/actions/auth/cookie"
          );
          const userRole = await getCookieByName("userRole");
          setRole(userRole);
        } catch (error) {
          console.error("Error fetching user role:", error);
        } finally {
          setIsLoading(false);
        }
      })();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return { role, isLoading };
}

/**
 * Hook that returns true if the current user is a Team_Member.
 */
export function useIsTeamMember() {
  const { role, isLoading } = useUserRole();
  return { isTeamMember: role === "Team_Member", isLoading };
}

/**
 * Hook that returns true if the current user is NOT a Team_Member.
 * Useful for showing/hiding edit/delete buttons.
 */
export function useCanEdit() {
  const { role, isLoading } = useUserRole();
  return { canEdit: role !== "Team_Member" && role !== null, isLoading };
}