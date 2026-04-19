import db from "../db";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../lib/jwt";

export function signTestToken(payload: {
  id: string;
  email: string;
  role: "customer" | "cleaner" | "admin";
}, expiresInSec = 3600): string {
  return signAccessToken(payload, expiresInSec);
}

export function signTestRefreshToken(id: string, expiresInSec = 604800): string {
  return signRefreshToken(id, expiresInSec);
}

interface TestUserOptions {
  email?: string;
  role?: "customer" | "cleaner" | "admin";
  firstName?: string;
  password?: string;
}

export async function createTestUser(opts: TestUserOptions = {}): Promise<{
  id: string;
  email: string;
  role: string;
  token: string;
  refreshToken: string;
}> {
  const email = opts.email ?? `test-${Date.now()}@example.com`;
  const role = opts.role ?? "customer";
  const firstName = opts.firstName ?? "Test";
  const password = opts.password ?? "TestPass1";
  const hash = await bcrypt.hash(password, 4);

  const rows = await db.query(
    `INSERT INTO users (first_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4) RETURNING id, email, role`,
    [firstName, email, hash, role]
  ) as { id: string; email: string; role: string }[];

  const user = rows[0]!;
  const token = signTestToken({ id: user.id, email: user.email, role: user.role as "customer" | "cleaner" | "admin" });
  const refreshToken = signTestRefreshToken(user.id);

  return { id: user.id, email: user.email, role: user.role, token, refreshToken };
}

interface TestAdminOptions {
  email?: string;
  firstName?: string;
  password?: string;
  roleName?: string;
}

export async function createTestAdmin(opts: TestAdminOptions = {}): Promise<{
  id: string;
  email: string;
  role: string;
  token: string;
  refreshToken: string;
}> {
  const email = opts.email ?? `admin-${Date.now()}@example.com`;
  const firstName = opts.firstName ?? "Admin";
  const password = opts.password ?? "AdminPass1";
  const roleName = opts.roleName ?? "super_admin";
  const hash = await bcrypt.hash(password, 4);

  let roleRows = await db.query(
    `SELECT id FROM roles WHERE name = $1`,
    [roleName]
  ) as { id: string }[];

  if (roleRows.length === 0) {
    await db.query(
      `INSERT INTO roles (name, display_name, is_system) VALUES ($1, $1, $2) ON CONFLICT (name) DO NOTHING`,
      [roleName, roleName === "super_admin" || roleName === "admin" || roleName === "manager" || roleName === "support"]
    );
    roleRows = await db.query(`SELECT id FROM roles WHERE name = $1`, [roleName]) as { id: string }[];

    if (roleName === "super_admin") {
      const perms = ["home","bookings","customers","cleaners","services","cost_guides","transactions","support","all_users","control_permissions"];
      for (const p of perms) {
        await db.query(`INSERT INTO role_permissions (role_id, permission) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [roleRows[0]!.id, p]);
      }
    } else if (roleName === "support") {
      for (const p of ["home", "support"]) {
        await db.query(`INSERT INTO role_permissions (role_id, permission) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [roleRows[0]!.id, p]);
      }
    } else if (roleName === "manager") {
      for (const p of ["home", "bookings", "customers", "cleaners"]) {
        await db.query(`INSERT INTO role_permissions (role_id, permission) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [roleRows[0]!.id, p]);
      }
    } else if (roleName === "admin") {
      for (const p of ["home","bookings","customers","cleaners","services","cost_guides","transactions","support"]) {
        await db.query(`INSERT INTO role_permissions (role_id, permission) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [roleRows[0]!.id, p]);
      }
    }
  }

  const roleId = roleRows[0]!.id;

  const rows = await db.query(
    `INSERT INTO users (first_name, email, password_hash, role, admin_role_id, activated_at)
     VALUES ($1, $2, $3, 'admin', $4, NOW()) RETURNING id, email, role`,
    [firstName, email, hash, roleId]
  ) as { id: string; email: string; role: string }[];

  const user = rows[0]!;
  const token = signTestToken({ id: user.id, email: user.email, role: "admin" });
  const refreshToken = signTestRefreshToken(user.id);

  return { id: user.id, email: user.email, role: user.role, token, refreshToken };
}

export async function createTestAddress(userId: string): Promise<{ id: string }> {
  const rows = await db.query(
    `INSERT INTO addresses (user_id, street, label) VALUES ($1, '123 Test Street', 'home') RETURNING id`,
    [userId]
  ) as { id: string }[];
  return rows[0]!;
}

export async function createTestBooking(
  customerId: string,
  addressId: string,
  opts: { cleanerId?: string; status?: string } = {}
): Promise<{ id: string }> {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const rows = await db.query(
    `INSERT INTO bookings (customer_id, address_id, service_type, rooms, floors, bathrooms, scheduled_date, time_start, booking_fee, total_price, status, cleaner_id)
     VALUES ($1, $2, 'domestic', 3, 1, 1, $3, '09:00', 5, 50, $4, $5)
     RETURNING id`,
    [customerId, addressId, tomorrow, opts.status ?? 'unassigned', opts.cleanerId ?? null]
  ) as { id: string }[];
  return rows[0]!;
}

export { default as app } from "../index";
