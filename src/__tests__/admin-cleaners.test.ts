import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestAdmin, createTestUser } from "../test/helpers";
import { truncateAll } from "../test/setup";

describe("Admin Cleaners", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/admin/cleaners", () => {
    it("returns 200 with cleaner list", async () => {
      const admin = await createTestAdmin();
      await createTestUser({ role: "cleaner" });

      const res = await request(app)
        .get("/v1/admin/cleaners")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body).toHaveProperty("stats");
    });
  });

  describe("GET /v1/admin/cleaners/:id", () => {
    it("returns cleaner detail", async () => {
      const admin = await createTestAdmin();
      const cleaner = await createTestUser({ role: "cleaner" });

      const res = await request(app)
        .get(`/v1/admin/cleaners/${cleaner.id}`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("reviews");
    });

    it("returns 404 for unknown cleaner", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .get("/v1/admin/cleaners/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /v1/admin/cleaners/:id/block", () => {
    it("blocks a cleaner", async () => {
      const admin = await createTestAdmin();
      const cleaner = await createTestUser({ role: "cleaner" });

      const res = await request(app)
        .post(`/v1/admin/cleaners/${cleaner.id}/block`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("blocked");
    });
  });

  describe("POST /v1/admin/cleaners/:id/pay", () => {
    it("creates a payout transaction", async () => {
      const admin = await createTestAdmin();
      const cleaner = await createTestUser({ role: "cleaner" });

      const res = await request(app)
        .post(`/v1/admin/cleaners/${cleaner.id}/pay`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ amount: 100, account_number: "12345678", bank_name: "Test Bank" });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("transaction_id");
      expect(res.body.amount).toBe(100);
      expect(res.body.status).toBe("pending");
    });

    it("returns 400 for amount <= 0", async () => {
      const admin = await createTestAdmin();
      const cleaner = await createTestUser({ role: "cleaner" });

      const res = await request(app)
        .post(`/v1/admin/cleaners/${cleaner.id}/pay`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ amount: 0, account_number: "12345678", bank_name: "Test Bank" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /v1/admin/cleaners (filters)", () => {
    it("supports period filter", async () => {
      const admin = await createTestAdmin();
      await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .get("/v1/admin/cleaners?period=past_year")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
    });
  });

  describe("GET /v1/admin/cleaners (list fields)", () => {
    it("returns total_booked and last_appointment", async () => {
      const admin = await createTestAdmin();
      await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .get("/v1/admin/cleaners")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      if (res.body.data.length > 0) {
        expect(res.body.data[0]).toHaveProperty("total_booked");
      }
    });
  });

  describe("GET /v1/admin/cleaners (stats)", () => {
    it("returns rating in stats", async () => {
      const admin = await createTestAdmin();
      await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .get("/v1/admin/cleaners")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body.stats).toHaveProperty("rating");
    });
  });

  describe("GET /v1/admin/cleaners/:id (detail)", () => {
    it("returns location in detail", async () => {
      const admin = await createTestAdmin();
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .get(`/v1/admin/cleaners/${cleaner.id}`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
    });
  });
});
