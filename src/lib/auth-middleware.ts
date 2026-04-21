import { Request, Response, NextFunction } from "express";
import { expressAuthentication } from "../auth";

export function requireJwtScopes(...scopes: string[]) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await expressAuthentication(req, "jwt", scopes);
      next();
    } catch (err) {
      next(err);
    }
  };
}
