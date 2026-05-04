import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestAdmin } from "../test/helpers";
import { truncateAll } from "../test/setup";

describe("Admin Cost Guides", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/admin/cost-guides", () => {
    it("returns 200 with cost guide list", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .get("/v1/admin/cost-guides")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("stats");
    });
  });

  describe("POST /v1/admin/cost-guides", () => {
    it("creates a cost guide with content blocks", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .post("/v1/admin/cost-guides")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({
          title: "Cleaning Costs",
          description: "Average cleaning costs",
          content_blocks: [
            { type: "callout", title: "Note", text: "Prices vary by area" },
            { type: "table", rows: [{ service_category: "Domestic", rate: "£22/hr", explanation: "Standard rate" }] },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Cleaning Costs");
    });
  });

  describe("GET /v1/admin/cost-guides/:id", () => {
    it("returns cost guide detail with content blocks", async () => {
      const admin = await createTestAdmin();

      const createRes = await request(app)
        .post("/v1/admin/cost-guides")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({
          title: "Detail Test",
          description: "Test",
          content_blocks: [{ type: "text", text: "Hello" }],
        });

      const res = await request(app)
        .get(`/v1/admin/cost-guides/${createRes.body.id}`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("content_blocks");
      expect(res.body.content_blocks).toBeInstanceOf(Array);
    });
  });

  describe("PATCH /v1/admin/cost-guides/:id", () => {
    it("updates a cost guide", async () => {
      const admin = await createTestAdmin();

      const createRes = await request(app)
        .post("/v1/admin/cost-guides")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ title: "Update Me", description: "Original", content_blocks: [] });

      const res = await request(app)
        .patch(`/v1/admin/cost-guides/${createRes.body.id}`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ title: "Updated Title" });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Updated Title");
    });
  });

  describe("PATCH /v1/admin/cost-guides/:id/archive", () => {
    it("archives a cost guide", async () => {
      const admin = await createTestAdmin();

      const createRes = await request(app)
        .post("/v1/admin/cost-guides")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ title: "Archive Me", description: "Test", content_blocks: [] });

      const res = await request(app)
        .patch(`/v1/admin/cost-guides/${createRes.body.id}/archive`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("archived");
    });
  });

  describe("GET /v1/admin/cost-guides (filters)", () => {
    it("supports status filter", async () => {
      const admin = await createTestAdmin();
      const res = await request(app)
        .get("/v1/admin/cost-guides?status=active")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
    });

    it("supports search filter", async () => {
      const admin = await createTestAdmin();
      await request(app)
        .post("/v1/admin/cost-guides")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ title: "SearchableGuide", description: "Test", content_blocks: [] });
      const res = await request(app)
        .get("/v1/admin/cost-guides?search=Searchable")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("PATCH /v1/admin/cost-guides/:id/unarchive", () => {
    it("unarchives a cost guide", async () => {
      const admin = await createTestAdmin();
      const createRes = await request(app)
        .post("/v1/admin/cost-guides")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ title: "Unarchive Me", description: "Test", content_blocks: [] });
      await request(app)
        .patch(`/v1/admin/cost-guides/${createRes.body.id}/archive`)
        .set("Authorization", `Bearer ${admin.token}`);
      const res = await request(app)
        .patch(`/v1/admin/cost-guides/${createRes.body.id}/unarchive`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("active");
    });
  });
});
