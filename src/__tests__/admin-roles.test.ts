import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestAdmin } from "../test/helpers";
import { truncateAll } from "../test/setup";

describe("Admin Roles", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/admin/roles", () => {
    it("returns 200 with seeded roles", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .get("/v1/admin/roles")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("POST /v1/admin/roles", () => {
    it("creates a new role", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .post("/v1/admin/roles")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ name: "test_role", display_name: "Test Role", access: ["home", "bookings"] });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("test_role");
      expect(res.body.access).toEqual(["home", "bookings"]);
    });

    it("returns 409 for duplicate role name", async () => {
      const admin = await createTestAdmin();

      await request(app)
        .post("/v1/admin/roles")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ name: "dup_role", display_name: "Dup", access: ["home"] });

      const res = await request(app)
        .post("/v1/admin/roles")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ name: "dup_role", display_name: "Dup2", access: ["home"] });

      expect(res.status).toBe(409);
    });

    it("returns 400 for invalid permission", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .post("/v1/admin/roles")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ name: "bad_role", display_name: "Bad", access: ["invalid_perm"] });

      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /v1/admin/roles/:id", () => {
    it("updates a role", async () => {
      const admin = await createTestAdmin();

      const createRes = await request(app)
        .post("/v1/admin/roles")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ name: "update_me", display_name: "Update Me", access: ["home"] });

      const res = await request(app)
        .patch(`/v1/admin/roles/${createRes.body.id}`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ display_name: "Updated", access: ["home", "bookings"] });

      expect(res.status).toBe(200);
      expect(res.body.display_name).toBe("Updated");
    });
  });

  describe("PATCH /v1/admin/roles/:id/archive", () => {
    it("archives a custom role", async () => {
      const admin = await createTestAdmin();

      const createRes = await request(app)
        .post("/v1/admin/roles")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ name: "archive_me", display_name: "Archive Me", access: ["home"] });

      const res = await request(app)
        .patch(`/v1/admin/roles/${createRes.body.id}/archive`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("archived");
    });

    it("returns 400 for system role", async () => {
      const admin = await createTestAdmin();

      const rolesRes = await request(app)
        .get("/v1/admin/roles")
        .set("Authorization", `Bearer ${admin.token}`);

      const systemRole = rolesRes.body.data.find((r: Record<string, unknown>) => r.is_system === true);

      const res = await request(app)
        .patch(`/v1/admin/roles/${systemRole.id}/archive`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(400);
    });

    it("returns 400 when role has users assigned", async () => {
      const admin = await createTestAdmin();

      const createRes = await request(app)
        .post("/v1/admin/roles")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ name: "has_users", display_name: "Has Users", access: ["home"] });

      const roleId = createRes.body.id;
      await createTestAdmin({ roleName: "has_users" });

      const res = await request(app)
        .patch(`/v1/admin/roles/${roleId}/archive`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(400);
    });
  });
});
