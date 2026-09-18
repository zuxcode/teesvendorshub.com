import { headers } from "next/headers";
import { createSafeActionClient, returnServerError } from "next-safe-action";
import { ErrorMessageMap } from "./errors/codes";
import { payload } from "./services/payload";

export const publicActionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
});

export const authenticatedActionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
  handleServerError: (e) => {
    console.log(e);
  },
}).use(async ({ next }) => {
  const requestHeaders = await headers();

  const { user } = await payload.auth({
    headers: requestHeaders,
  });

  if (!user) {
    return returnServerError(ErrorMessageMap.AUTH_ACCOUNT_REQUIRED);
  }

  return next({
    ctx: {
      user,
    },
  });
});
