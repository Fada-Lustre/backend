import { ApplicationError } from "../errors";

export const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export function validatePassword(password: string): void {
  if (!PASSWORD_RE.test(password)) {
    throw new ApplicationError(
      400,
      "Password must be at least 8 characters with uppercase, lowercase, and a digit",
      "VALIDATION_ERROR"
    );
  }
}

/**
 * Validate an optional ISO-8601 date/datetime query param. Returns the value
 * unchanged when valid/absent, and throws a descriptive 400 when malformed —
 * preventing an invalid value from reaching a Postgres date cast (which would
 * otherwise surface as a 500 Internal Server Error).
 */
export function validateIsoDateParam(value: string | undefined, paramName: string): string | undefined {
  if (value === undefined || value === "") return value;
  const ts = Date.parse(value);
  if (Number.isNaN(ts)) {
    throw new ApplicationError(
      400,
      `${paramName} must be a valid ISO-8601 date (e.g. 2026-06-13 or 2026-06-13T23:00:00.000Z)`,
      "VALIDATION_ERROR"
    );
  }
  return value;
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
