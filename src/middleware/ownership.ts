import { ApplicationError } from "../errors";

export function assertOwnership(resourceUserId: string, requestUserId: string): void {
  if (resourceUserId !== requestUserId) {
    throw new ApplicationError(403, "You do not have permission to access this resource", "FORBIDDEN");
  }
}
