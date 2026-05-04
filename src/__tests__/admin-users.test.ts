import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestAdmin, createTestUser } from "../test/helpers";
import { truncateAll } from "../test/setup";
import db from "../db";

describe("Admin Users", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/admin/users", () => {
    it("returns 200 with admin user list", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .get("/v1/admin/users")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("meta");
    });

    it("returns 403 for non-admin user", async () => {
      const customer = await createTestUser();

      const res = await request(app)
        .get("/v1/admin/users")
        .set("Authorization", `Bearer ${customer.token}`);

      expect(res.status).toBe(403);
    });

    it("returns 403 for admin without all_users permission", async () => {
      const admin = await createTestAdmin({ roleName: "support" });

      const res = await request(app)
        .get("/v1/admin/users")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("POST /v1/admin/users (invite)", () => {
    it("returns 201 for valid invitation", async () => {
      const admin = await createTestAdmin();
      await createTestAdmin({ roleName: "admin", email: `seed-admin-role-${Date.now()}@example.com` });
      const roleRows = await db.query(`SELECT id FROM roles WHERE name = 'admin'`) as { id: string }[];

      const res = await request(app)
        .post("/v1/admin/users")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({
          first_name: "New",
          last_name: "User",
          email: `new-${Date.now()}@example.com`,
          role_id: roleRows[0]!.id,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.message).toBe("Invitation email sent");
    });

    it("returns 409 for duplicate invitation", async () => {
      const admin = await createTestAdmin();
      await createTestAdmin({ roleName: "admin", email: `seed-admin-role2-${Date.now()}@example.com` });
      const roleRows = await db.query(`SELECT id FROM roles WHERE name = 'admin'`) as { id: string }[];
      const email = `dup-${Date.now()}@example.com`;

      await request(app)
        .post("/v1/admin/users")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ first_name: "A", last_name: "B", email, role_id: roleRows[0]!.id });

      const res = await request(app)
        .post("/v1/admin/users")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ first_name: "A", last_name: "B", email, role_id: roleRows[0]!.id });

      expect(res.status).toBe(409);
    });
  });

  describe("POST /v1/admin/users/:id/block", () => {
    it("blocks an admin user", async () => {
      const admin = await createTestAdmin();
      const target = await createTestAdmin({ email: `target-${Date.now()}@example.com` });

      const res = await request(app)
        .post(`/v1/admin/users/${target.id}/block`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("blocked");
    });

    it("returns 400 when blocking self", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .post(`/v1/admin/users/${admin.id}/block`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /v1/admin/users/:id (edit)", () => {
    it("edits an admin user", async () => {
      const admin = await createTestAdmin();
      const target = await createTestAdmin({ email: `edit-target-${Date.now()}@example.com` });
      const res = await request(app)
        .patch(`/v1/admin/users/${target.id}`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ first_name: "Updated", phone: "07999999999" });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("updated");
    });

    it("returns 404 for non-admin user", async () => {
      const admin = await createTestAdmin();
      const customer = await createTestUser();
      const res = await request(app)
        .patch(`/v1/admin/users/${customer.id}`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ first_name: "NoUpdate" });
      expect(res.status).toBe(404);
    });
  });

  describe("POST /v1/admin/users/:id/unblock", () => {
    it("unblocks a blocked admin", async () => {
      const admin = await createTestAdmin();
      const target = await createTestAdmin({ email: `unblock-${Date.now()}@example.com` });
      await request(app)
        .post(`/v1/admin/users/${target.id}/block`)
        .set("Authorization", `Bearer ${admin.token}`);
      const res = await request(app)
        .post(`/v1/admin/users/${target.id}/unblock`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("active");
    });

    it("returns 400 if user is not blocked", async () => {
      const admin = await createTestAdmin();
      const target = await createTestAdmin({ email: `active-${Date.now()}@example.com` });
      const res = await request(app)
        .post(`/v1/admin/users/${target.id}/unblock`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(400);
    });
  });
});
