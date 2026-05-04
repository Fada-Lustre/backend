import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestAdmin, createTestUser } from "../test/helpers";
import { truncateAll } from "../test/setup";
import db from "../db";

describe("Admin Transactions", () => {
  beforeEach(async () => { await truncateAll(); });

  async function seedTransaction() {
    const customer = await createTestUser();
    const rows = await db.query(
      `INSERT INTO transactions (ref_number, payer_id, type, amount, status)
       VALUES ($1, $2, 'booking', 50, 'successful')
       RETURNING id`,
      [`REF-${Date.now()}`, customer.id]
    ) as { id: string }[];
    return { transactionId: rows[0]!.id, customer };
  }

  describe("GET /v1/admin/transactions", () => {
    it("returns 200 with transaction list", async () => {
      const admin = await createTestAdmin();
      await seedTransaction();

      const res = await request(app)
        .get("/v1/admin/transactions")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body).toHaveProperty("stats");
    });

    it("supports period filter", async () => {
      const admin = await createTestAdmin();
      await seedTransaction();

      const res = await request(app)
        .get("/v1/admin/transactions?period=today")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
    });
  });

  describe("GET /v1/admin/transactions/:id", () => {
    it("returns transaction detail", async () => {
      const admin = await createTestAdmin();
      const { transactionId } = await seedTransaction();

      const res = await request(app)
        .get(`/v1/admin/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("amount");
      expect(res.body).toHaveProperty("type");
    });

    it("returns 404 for unknown transaction", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .get("/v1/admin/transactions/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /v1/admin/transactions/:id/receipt", () => {
    it("sends a receipt", async () => {
      const admin = await createTestAdmin();
      const { transactionId } = await seedTransaction();

      const res = await request(app)
        .post(`/v1/admin/transactions/${transactionId}/receipt`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Receipt sent");
    });
  });

  describe("GET /v1/admin/transactions (new filters)", () => {
    it("supports location filter", async () => {
      const admin = await createTestAdmin();
      await seedTransaction();
      const res = await request(app)
        .get("/v1/admin/transactions?location=Test")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
    });

    it("supports service filter", async () => {
      const admin = await createTestAdmin();
      await seedTransaction();
      const res = await request(app)
        .get("/v1/admin/transactions?service=domestic")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
    });

    it("returns date and time fields", async () => {
      const admin = await createTestAdmin();
      await seedTransaction();
      const res = await request(app)
        .get("/v1/admin/transactions")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      if (res.body.data.length > 0) {
        expect(res.body.data[0]).toHaveProperty("date");
        expect(res.body.data[0]).toHaveProperty("time");
      }
    });
  });

  describe("GET /v1/admin/transactions/export", () => {
    it("returns CSV data", async () => {
      const admin = await createTestAdmin();
      await seedTransaction();
      const res = await request(app)
        .get("/v1/admin/transactions/export")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toContain("text/csv");
    });
  });
});
