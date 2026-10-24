"use client";

import { useEffect } from "react";

import type { Gift } from "@/payload-types";
import { useGiftActions } from "../store/gift-store";

interface Props {
  gifts: Gift[];
}

export function HydrateGiftStore({ gifts }: Props) {
  const { setGifts } = useGiftActions();

  useEffect(() => {
    setGifts(gifts);
  }, [gifts, setGifts]);

  return null;
}
