"use client";

import { useEffect } from "react";
import { useAuthActions } from "@/modules/users/stores/user-store";
import type { User } from "@/payload-types";

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
