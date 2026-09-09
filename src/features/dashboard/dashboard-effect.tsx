"use client";

import { useEffect } from "react";
import type { User } from "@/payload-types";
import { useAuthActions } from "@/stores/user-store";

interface DashboardEffectProp {
  user: User | null;
}

export function DashboardEffect({ user }: DashboardEffectProp) {
  const { setUser } = useAuthActions();

  useEffect(() => {
    setUser(user);
  }, [setUser, user]);

  return null;
}
