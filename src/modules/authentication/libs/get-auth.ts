"use server";

import { headers as getHeaders } from "next/headers";
import { payload } from "@/shared/payload/utils/payload";

export const getAuthenticateUser = async () => {
  const headers = await getHeaders();

  const { user } = await payload.auth({
    headers,
  });

  return { user };
};
