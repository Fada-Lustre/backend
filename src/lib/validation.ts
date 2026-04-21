import { ApplicationError } from "../errors";

export const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function validatePassword(password: string): void {
  if (!PASSWORD_RE.test(password)) {
    throw new ApplicationError(
      400,
      "Password must be at least 8 characters with uppercase, lowercase, and a digit",
      "VALIDATION_ERROR"
    );
  }
}

export function clampPagination(
  page: number,
  limit: number,
  opts: { maxLimit?: number } = {}
): { page: number; limit: number } {
  const maxLimit = opts.maxLimit ?? 100;
  return {
    page: Math.max(page, 1),
    limit: Math.min(Math.max(limit, 1), maxLimit),
  };
}
