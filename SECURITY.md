# Security & Supply-Chain Posture

This document records how dependency / supply-chain risk is managed for the
Fada Lustre backend, and the steps required to finish wiring up Socket.dev.

## Dependency CVE baseline

Run `npm audit` to check the dependency tree against known CVEs.

| Scope | Command | Status |
|-------|---------|--------|
| **Production** deps | `npm audit --omit=dev --audit-level=high` | ✅ **0 vulnerabilities** |
| Full tree (incl. dev) | `npm audit` | 9 advisories — all dev/build-only (see below) |

The runtime-facing advisories (express, body-parser, qs, resend → svix → uuid,
express-rate-limit, etc.) were resolved with a non-breaking `npm audit fix`
(lockfile-only change; no `package.json` edits).

### Accepted risk: `@vercel/node` build chain (dev-only)

The remaining 9 advisories (6 high, 3 moderate) all originate from
**`@vercel/node`**, a **devDependency** used only by Vercel's build/deploy
tooling — `undici`, `path-to-regexp`, `minimatch`, `ajv`, `smol-toml`,
`@vercel/build-utils`, `@vercel/python-analysis`, `@vercel/static-config`.

- They are **not reachable from the production runtime** (`npm audit --omit=dev`
  is clean), so they are not exposed in the deployed request path.
- npm's only offered fix is a **major _downgrade_ to `@vercel/node@4`**, which is
  a regression and is **not** applied.
- **Action:** track upstream and bump `@vercel/node` when a patched `5.x`
  publishes clean transitive deps. Re-check with `npm audit`.

This is why CI gates on `--omit=dev` (see below) — so genuinely new production
CVEs fail the build, while the known dev-only chain does not create permanent red.

## Automated checks (CI)

Two workflows run on every push and pull request:

- **`.github/workflows/socket-security.yml`** — Socket Firewall
  ([`SocketDev/action@v1.3.1`](https://github.com/SocketDev/action), `firewall-free`
  mode, no token). `sfw npm ci` blocks the install if any package matches Socket's
  malware / supply-chain risk signals.
- **`.github/workflows/dependency-audit.yml`** — `npm audit`. Gates on
  high/critical CVEs in **production** deps; reports the full tree non-blocking.
  Also runs weekly to catch newly disclosed CVEs.

## Connecting the repo to Socket.dev (manual, one-time)

The CI firewall above is automatic, but Socket's PR-level **CVE reports and
supply-chain attack tracking** come from the **Socket GitHub App**, which a
repo/org **admin must install via the web** (it cannot be scripted):

1. Go to **https://github.com/apps/socket-security** and click **Install**.
2. Select this repository (or the whole org).
3. Done — Socket now comments on PRs that add/change dependencies and publishes
   project reports, honoring the rules in [`socket.yml`](./socket.yml).

### Optional: Socket Enterprise / API token

For Enterprise features or running the Socket CLI in CI, create a Socket API
token and store it as the repo secret **`SOCKET_API_KEY`**, then switch the
Socket workflow to `mode: firewall-enterprise` with
`socket-token: ${{ secrets.SOCKET_API_KEY }}`. The free firewall mode needs none.

## Local commands

```bash
npm audit                          # full tree (incl. dev)
npm audit --omit=dev --audit-level=high   # production gate (matches CI)
npm audit fix                      # apply non-breaking fixes
npx @socketsecurity/cli scan create .     # ad-hoc Socket scan (needs token)
```
