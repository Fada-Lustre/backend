import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { app, createTestAdmin } from "../test/helpers";
import { truncateAll } from "../test/setup";
import db from "../db";

describe("Admin Auth", () => {
  beforeEach(async () => { await truncateAll(); });

  async function seedInvitation(email: string, tempPassword: string, roleId?: string) {
    const admin = await createTestAdmin();
    if (!roleId) {
      const roles = await db.query(`SELECT id FROM roles WHERE name = 'admin'`) as { id: string }[];
      if (roles.length === 0) {
        await db.query(`INSERT INTO roles (name, display_name, is_system) VALUES ('admin', 'Admin', true) ON CONFLICT (name) DO NOTHING`);
        const inserted = await db.query(`SELECT id FROM roles WHERE name = 'admin'`) as { id: string }[];
        roleId = inserted[0]!.id;
      } else {
        roleId = roles[0]!.id;
      }
    }
    const hash = await bcrypt.hash(tempPassword, 4);
    await db.query(
      `INSERT INTO admin_invitations (email, role_id, temp_password_hash, invited_by, expires_at)
       VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')`,
      [email, roleId, hash, admin.id]
    );
    return admin;
  }

  describe("POST /v1/auth/activate", () => {
    it("returns 200 with activation token for valid invitation", async () => {
      const email = `invite-${Date.now()}@example.com`;
      await seedInvitation(email, "TempPass1");

      const res = await request(app)
        .post("/v1/auth/activate")
        .send({ email, temporary_password: "TempPass1" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("activation_token");
      expect(res.body.requires_profile_setup).toBe(true);
    });

    it("returns 404 for unknown email", async () => {
      const res = await request(app)
        .post("/v1/auth/activate")
        .send({ email: "unknown@example.com", temporary_password: "TempPass1" });

      expect(res.status).toBe(404);
    });

    it("returns 401 for wrong temp password", async () => {
      const email = `invite-${Date.now()}@example.com`;
      await seedInvitation(email, "TempPass1");

      const res = await request(app)
        .post("/v1/auth/activate")
        .send({ email, temporary_password: "WrongPass1" });

      expect(res.status).toBe(401);
    });
  });

  describe("POST /v1/auth/setup-profile", () => {
    it("returns 201 with tokens after valid setup", async () => {
      const email = `invite-${Date.now()}@example.com`;
      await seedInvitation(email, "TempPass1");

      const activateRes = await request(app)
        .post("/v1/auth/activate")
        .send({ email, temporary_password: "TempPass1" });

      const token = activateRes.body.activation_token;

      const res = await request(app)
        .post("/v1/auth/setup-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          first_name: "John",
          last_name: "Doe",
          phone: "+447700900000",
          password: "NewPass123",
          confirm_password: "NewPass123",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("refresh_token");
    });

    it("returns 400 for mismatched passwords", async () => {
      const email = `invite-${Date.now()}@example.com`;
      await seedInvitation(email, "TempPass1");

      const activateRes = await request(app)
        .post("/v1/auth/activate")
        .send({ email, temporary_password: "TempPass1" });

      const res = await request(app)
        .post("/v1/auth/setup-profile")
        .set("Authorization", `Bearer ${activateRes.body.activation_token}`)
        .send({
          first_name: "John",
          last_name: "Doe",
          phone: "+447700900000",
          password: "NewPass123",
          confirm_password: "DifferentPass1",
        });

      expect(res.status).toBe(400);
    });

    it("returns 401 without activation token", async () => {
      const res = await request(app)
        .post("/v1/auth/setup-profile")
        .send({ first_name: "John", last_name: "Doe", phone: "+44", password: "Pass1234", confirm_password: "Pass1234" });

      expect(res.status).toBe(401);
    });
  });
});
