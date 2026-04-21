import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestAdmin } from "../test/helpers";
import { truncateAll } from "../test/setup";
import db from "../db";

describe("Admin Activity Log", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/admin/activity-log", () => {
    it("returns 200 with empty log", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .get("/v1/admin/activity-log")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body).toHaveProperty("meta");
    });

    it("returns log entries after admin actions", async () => {
      const admin = await createTestAdmin();

      await db.query(
        `INSERT INTO activity_log (actor_id, action, entity_type)
         VALUES ($1, 'Test action', 'test')`,
        [admin.id]
      );

      const res = await request(app)
        .get("/v1/admin/activity-log")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0]).toHaveProperty("action");
    });

    it("supports search filter", async () => {
      const admin = await createTestAdmin();

      await db.query(
        `INSERT INTO activity_log (actor_id, action) VALUES ($1, 'Blocked Customer - Test')`,
        [admin.id]
      );
      await db.query(
        `INSERT INTO activity_log (actor_id, action) VALUES ($1, 'Created service')`,
        [admin.id]
      );

      const res = await request(app)
        .get("/v1/admin/activity-log?search=Blocked")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });
});
