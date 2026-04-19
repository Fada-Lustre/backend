import { sign, verify } from "jsonwebtoken";
import { env } from "../env";

export const JWT_SIGN_OPTIONS = { issuer: "fada-lustre", audience: "fada-lustre-api" } as const;
export const JWT_VERIFY_OPTIONS = { issuer: "fada-lustre", audience: "fada-lustre-api" } as const;

export function signAccessToken(payload: { id: string; email: string; role: string }, expiresIn: number | `${number}${"s" | "m" | "h" | "d"}` = "1h"): string {
  return sign(payload, env.JWT_SECRET, { expiresIn, ...JWT_SIGN_OPTIONS });
}

export function signRefreshToken(id: string, expiresIn: number | `${number}${"s" | "m" | "h" | "d"}` = "7d"): string {
  return sign({ id }, env.JWT_REFRESH_SECRET, { expiresIn, ...JWT_SIGN_OPTIONS });
}

export function signActivationToken(userId: string, email: string): string {
  return sign({ id: userId, email, purpose: "activation" }, env.JWT_SECRET, {
    expiresIn: "1h",
    ...JWT_SIGN_OPTIONS,
  });
}

export function verifyAccessToken<T = unknown>(token: string): T {
  return verify(token, env.JWT_SECRET, JWT_VERIFY_OPTIONS) as T;
}

export function verifyRefreshToken<T = unknown>(token: string): T {
  return verify(token, env.JWT_REFRESH_SECRET, JWT_VERIFY_OPTIONS) as T;
}
