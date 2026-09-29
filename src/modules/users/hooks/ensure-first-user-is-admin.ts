import type { FieldHook } from "payload";
import { ROLE } from "@/constant";
import type { User } from "@/payload-types";

export const ensureFirstUserIsAdmin: FieldHook<User> = async ({
  operation,
  req,
  value,
}) => {
  if (operation !== "create") {
    return value;
  }

  const users = await req.payload.find({
    collection: "users",
    depth: 0,
    limit: 1,
    req,
  });

  if (users.totalDocs === 0) {
    return ROLE.ADMIN;
  }

  return value;
};
