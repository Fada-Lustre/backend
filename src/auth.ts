import { Request } from "express";
import { ApplicationError } from "./errors";
import { verifyAccessToken } from "./lib/jwt";
import * as userRepo from "./repositories/user.repository";

interface JwtPayload {
  id: string;
  email: string;
  role: "customer" | "cleaner" | "admin";
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<JwtPayload> {
  if (securityName !== "jwt") {
    throw new ApplicationError(500, `Unknown security scheme: ${securityName}`, "AUTH_SCHEME_ERROR");
  }

  const header = request.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApplicationError(401, "Authorization header with Bearer token is required", "AUTH_REQUIRED");
  }

  const token = header.slice(7);

  let decoded: JwtPayload;
  try {
    decoded = verifyAccessToken<JwtPayload>(token);
  } catch {
    throw new ApplicationError(401, "Invalid or expired token", "AUTH_INVALID");
  }

  request.user = decoded;

  const statusRow = await userRepo.findStatusById(decoded.id);
  if (statusRow?.status === "blocked") {
    throw new ApplicationError(403, "Account is blocked", "ACCOUNT_BLOCKED");
  }

  if (scopes && scopes.length > 0) {
    const requiredRoles = scopes.map((s) => s.split(":")[0]!);

    // FORBIDDEN: the user's primary role doesn't match any of the required roles
    if (!requiredRoles.includes(decoded.role)) {
      throw new ApplicationError(403, `Required role: ${requiredRoles.join(" or ")}`, "FORBIDDEN");
    }

    if (decoded.role === "admin") {
      const requiredPermissions = scopes
        .filter((s) => s.includes(":"))
        .map((s) => s.split(":")[1]!);

      // INSUFFICIENT_PERMISSIONS: the user has the correct role but lacks
      // the granular RBAC permission for this specific admin section
      if (requiredPermissions.length > 0) {
        const hasPerm = await userRepo.hasPermission(decoded.id, requiredPermissions);
        if (!hasPerm) {
          throw new ApplicationError(403, "Insufficient permissions", "INSUFFICIENT_PERMISSIONS");
        }
      }
    }
  }

  return decoded;
}
