import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";
import {
  GlobalErrorCode,
  GlobalErrorMessageMap,
} from "../errors/global-errors";
import { payload } from "../payload/utils/payload";

export const publicActionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",

  handleServerError: (error) => ({
    code:
      error instanceof Error && "code" in error
        ? String(error.code)
        : GlobalErrorCode.SERVER_ERROR,

    message:
      error instanceof Error
        ? error.message
        : GlobalErrorMessageMap.SERVER_ERROR,
  }),
});

export const authenticatedActionClient = publicActionClient.use(
  async ({ next }) => {
    const requestHeaders = await headers();

    const { user } = await payload.auth({
      headers: requestHeaders,
    });

    if (!user) {
      throw Object.assign(
        new Error(GlobalErrorMessageMap.AUTH_ACCOUNT_REQUIRED),
        {
          code: GlobalErrorCode.AUTH_ACCOUNT_REQUIRED,
        }
      );
    }

    return next({
      ctx: {
        user,
      },
    });
  }
);
