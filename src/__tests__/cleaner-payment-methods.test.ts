import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestUser } from "../test/helpers";
import { truncateAll } from "../test/setup";

describe("Cleaner Payment Method endpoints", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/cleaner/payment-methods", () => {
    it("returns empty list for new cleaner", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .get("/v1/cleaner/payment-methods")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("rejects customer role with 403", async () => {
      const customer = await createTestUser({ role: "customer" });
      const res = await request(app)
        .get("/v1/cleaner/payment-methods")
        .set("Authorization", `Bearer ${customer.token}`);
      expect(res.status).toBe(403);
    });
  });

  describe("POST /v1/cleaner/payment-methods", () => {
    it("creates a bank account", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .post("/v1/cleaner/payment-methods")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ account_number: "12345678", account_holder: "Test User", bank_name: "Test Bank" });
      expect(res.status).toBe(201);
      expect(res.body.type).toBe("bank_account");
      expect(res.body.bank_name).toBe("Test Bank");
    });
  });

  describe("DELETE /v1/cleaner/payment-methods/:id", () => {
    it("soft-deletes own payment method", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const create = await request(app)
        .post("/v1/cleaner/payment-methods")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ account_number: "12345678", account_holder: "Test", bank_name: "Bank" });
      const pmId = create.body.id;

      const res = await request(app)
        .delete(`/v1/cleaner/payment-methods/${pmId}`)
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(204);

      const list = await request(app)
        .get("/v1/cleaner/payment-methods")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(list.body).toEqual([]);
    });

    it("rejects deleting another cleaner's payment method with 403", async () => {
      const cleaner1 = await createTestUser({ role: "cleaner", email: `c1-${Date.now()}@test.com` });
      const cleaner2 = await createTestUser({ role: "cleaner", email: `c2-${Date.now()}@test.com` });
      const create = await request(app)
        .post("/v1/cleaner/payment-methods")
        .set("Authorization", `Bearer ${cleaner1.token}`)
        .send({ account_number: "12345678", account_holder: "Test", bank_name: "Bank" });
      const pmId = create.body.id;

      const res = await request(app)
        .delete(`/v1/cleaner/payment-methods/${pmId}`)
        .set("Authorization", `Bearer ${cleaner2.token}`);
      expect(res.status).toBe(403);
    });

    it("returns 404 when deleting non-existent payment method", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .delete("/v1/cleaner/payment-methods/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(404);
    });
  });
});
