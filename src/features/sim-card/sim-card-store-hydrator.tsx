"use client";

import { useEffect } from "react";

import type { SimCard } from "@/payload-types";
import { useSimCardActions } from "@/stores/sim-card-store";

interface SimCardStoreHydratorProps {
  simCards: SimCard[];
}

export function SimCardStoreHydrator({ simCards }: SimCardStoreHydratorProps) {
  const { setSimCards } = useSimCardActions();

  useEffect(() => {
    setSimCards(simCards);
  }, [simCards, setSimCards]);

  return null;
}
