import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestAdmin } from "../test/helpers";
import { truncateAll } from "../test/setup";
import db from "../db";

async function seedAddOn(name = "Oven", slug = "oven"): Promise<string> {
  const rows = await db.query(
    `INSERT INTO add_ons (name, slug, hours_added) VALUES ($1, $2, 1.0) RETURNING id`,
    [name, slug]
  ) as { id: string }[];
  return rows[0]!.id;
}

const PNG = Buffer.from([0xff, 0xd8, 0xff]);

describe("Admin Add-ons", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/admin/add-ons", () => {
    it("lists add-ons with a null image_url before any upload", async () => {
      const admin = await createTestAdmin();
      await seedAddOn();

      const res = await request(app)
        .get("/v1/admin/add-ons")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0]).toHaveProperty("image_url", null);
      expect(res.body.data[0].slug).toBe("oven");
    });

    it("rejects unauthenticated requests", async () => {
      const res = await request(app).get("/v1/admin/add-ons");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /v1/admin/add-ons/:id/image", () => {
    it("uploads an image and returns a signed image_url", async () => {
      const admin = await createTestAdmin();
      const id = await seedAddOn();

      const res = await request(app)
        .post(`/v1/admin/add-ons/${id}/image`)
        .set("Authorization", `Bearer ${admin.token}`)
        .attach("image", PNG, { filename: "addon.png", contentType: "image/png" });

      expect(res.status).toBe(200);
      expect(typeof res.body.image_url).toBe("string");
      expect(res.body.image_url).toContain("add-ons");
    });

    it("surfaces the signed image on GET /v1/pricing", async () => {
      const admin = await createTestAdmin();
      const id = await seedAddOn();

      await request(app)
        .post(`/v1/admin/add-ons/${id}/image`)
        .set("Authorization", `Bearer ${admin.token}`)
        .attach("image", PNG, { filename: "addon.png", contentType: "image/png" });

      const res = await request(app).get("/v1/pricing");
      expect(res.status).toBe(200);
      const addOn = res.body.add_ons.find((a: { id: string }) => a.id === id);
      expect(addOn).toBeDefined();
      expect(typeof addOn.image_url).toBe("string");
      expect(addOn.image_url).toContain("add-ons");
    });

    it("returns 404 for an unknown add-on", async () => {
      const admin = await createTestAdmin();
      const res = await request(app)
        .post("/v1/admin/add-ons/00000000-0000-0000-0000-000000000000/image")
        .set("Authorization", `Bearer ${admin.token}`)
        .attach("image", PNG, { filename: "addon.png", contentType: "image/png" });
      expect(res.status).toBe(404);
    });

    it("returns 400 when no file is provided", async () => {
      const admin = await createTestAdmin();
      const id = await seedAddOn();
      const res = await request(app)
        .post(`/v1/admin/add-ons/${id}/image`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(400);
    });

    it("returns 400 for a malformed (non-UUID) add-on id", async () => {
      const admin = await createTestAdmin();
      const res = await request(app)
        .post("/v1/admin/add-ons/not-a-uuid/image")
        .set("Authorization", `Bearer ${admin.token}`)
        .attach("image", PNG, { filename: "addon.png", contentType: "image/png" });
      expect(res.status).toBe(400);
    });
  });
});
