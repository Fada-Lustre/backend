import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestAdmin } from "../test/helpers";
import { truncateAll } from "../test/setup";

describe("Admin Services", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/admin/services", () => {
    it("returns 200 with services list", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .get("/v1/admin/services")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("stats");
    });
  });

  describe("POST /v1/admin/services (multipart)", () => {
    it("creates a service", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .post("/v1/admin/services")
        .set("Authorization", `Bearer ${admin.token}`)
        .field("name", "Test Service")
        .field("description", "A test service description");

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.name).toBe("Test Service");
      expect(res.body.status).toBe("active");
    });

    it("returns 400 without name", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .post("/v1/admin/services")
        .set("Authorization", `Bearer ${admin.token}`)
        .field("description", "Missing name");

      expect(res.status).toBe(400);
    });
  });

  describe("GET /v1/admin/services/:id", () => {
    it("returns service detail", async () => {
      const admin = await createTestAdmin();
      const createRes = await request(app)
        .post("/v1/admin/services")
        .set("Authorization", `Bearer ${admin.token}`)
        .field("name", "Detail Service")
        .field("description", "For detail test");
      const res = await request(app)
        .get(`/v1/admin/services/${createRes.body.id}`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Detail Service");
    });

    it("returns 404 for unknown service", async () => {
      const admin = await createTestAdmin();
      const res = await request(app)
        .get("/v1/admin/services/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /v1/admin/services/:id/archive", () => {
    it("archives a service", async () => {
      const admin = await createTestAdmin();

      const createRes = await request(app)
        .post("/v1/admin/services")
        .set("Authorization", `Bearer ${admin.token}`)
        .field("name", "Archive Me")
        .field("description", "Will be archived");

      const res = await request(app)
        .patch(`/v1/admin/services/${createRes.body.id}/archive`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("archived");
    });
  });

  describe("GET /v1/admin/services (filters)", () => {
    it("supports status filter", async () => {
      const admin = await createTestAdmin();
      const res = await request(app)
        .get("/v1/admin/services?status=active")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
    });

    it("supports search filter", async () => {
      const admin = await createTestAdmin();
      await request(app)
        .post("/v1/admin/services")
        .set("Authorization", `Bearer ${admin.token}`)
        .field("name", "SearchableService")
        .field("description", "Test");
      const res = await request(app)
        .get("/v1/admin/services?search=Searchable")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("supports period filter", async () => {
      const admin = await createTestAdmin();
      const res = await request(app)
        .get("/v1/admin/services?period=past_year")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
    });
  });

  describe("PATCH /v1/admin/services/:id/unarchive", () => {
    it("unarchives a service", async () => {
      const admin = await createTestAdmin();
      const createRes = await request(app)
        .post("/v1/admin/services")
        .set("Authorization", `Bearer ${admin.token}`)
        .field("name", "Unarchive Me")
        .field("description", "Will be unarchived");
      await request(app)
        .patch(`/v1/admin/services/${createRes.body.id}/archive`)
        .set("Authorization", `Bearer ${admin.token}`);
      const res = await request(app)
        .patch(`/v1/admin/services/${createRes.body.id}/unarchive`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("active");
    });

    it("returns 404 for non-archived service", async () => {
      const admin = await createTestAdmin();
      const createRes = await request(app)
        .post("/v1/admin/services")
        .set("Authorization", `Bearer ${admin.token}`)
        .field("name", "Already Active")
        .field("description", "Test");
      const res = await request(app)
        .patch(`/v1/admin/services/${createRes.body.id}/unarchive`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(404);
    });
  });
});
