import type { AppErrorConstruct } from "@/shared/types";

export const AuthErrorCode = {
  AUTH_ACCOUNT_REQUIRED: "AUTH_ACCOUNT_REQUIRED",
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

export const AuthErrorMessageMap = {
  AUTH_ACCOUNT_REQUIRED: "Authentication is required.",
} satisfies Record<AuthErrorCode, string>;

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor({
    code,
    message = AuthErrorMessageMap[code],
    options,
  }: AppErrorConstruct<AuthErrorCode>) {
    super(message, options);

    this.name = new.target.name;
    this.code = code;
  }
}
