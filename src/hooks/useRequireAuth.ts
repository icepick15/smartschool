"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, type SessionRole } from "@/lib/session";

export function useRequireAuth(requiredRole: SessionRole): boolean {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      // No session — go to login, no redirect param to avoid loops
      router.replace("/login");
    } else if (session.role !== requiredRole) {
      // Logged in but wrong portal — send them to their own portal
      router.replace(`/${session.role}`);
    } else {
      setReady(true);
    }
  }, [requiredRole, router]);

  return ready;
}
