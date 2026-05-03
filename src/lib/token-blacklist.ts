const blacklist = new Map<string, number>();

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [token, expiresAt] of blacklist) {
    if (expiresAt <= now) blacklist.delete(token);
  }
}, CLEANUP_INTERVAL_MS).unref();

export function blacklistToken(token: string, expiresAtSec: number): void {
  blacklist.set(token, expiresAtSec * 1000);
}

export function isBlacklisted(token: string): boolean {
  const expiresAt = blacklist.get(token);
  if (expiresAt === undefined) return false;
  if (expiresAt <= Date.now()) {
    blacklist.delete(token);
    return false;
  }
  return true;
}
