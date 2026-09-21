import { nanoid } from "nanoid";

export function generateUniqueReference(prefex = "PAY") {
  return `${prefex}-${nanoid(16)}`;
}
