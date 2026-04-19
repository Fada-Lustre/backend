import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestAdmin } from "../test/helpers";
import { truncateAll } from "../test/setup";

describe("Admin Dashboard", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/admin/dashboard", () => {
    it("returns 200 with dashboard data", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .get("/v1/admin/dashboard")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("balance");
      expect(res.body).toHaveProperty("pending");
      expect(res.body).toHaveProperty("total_bookings");
      expect(res.body).toHaveProperty("top_clients");
      expect(res.body).toHaveProperty("top_cleaners");
      expect(res.body).toHaveProperty("service_counts");
    });

    it("returns 403 for non-admin", async () => {
      const { createTestUser } = await import("../test/helpers");
      const customer = await createTestUser();

      const res = await request(app)
        .get("/v1/admin/dashboard")
        .set("Authorization", `Bearer ${customer.token}`);

      expect(res.status).toBe(403);
    });
  });
});
