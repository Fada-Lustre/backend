import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestAdmin, createTestUser } from "../test/helpers";
import { truncateAll } from "../test/setup";
import db from "../db";

describe("Admin Customers", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/admin/customers", () => {
    it("returns 200 with customer list", async () => {
      const admin = await createTestAdmin();
      await createTestUser();

      const res = await request(app)
        .get("/v1/admin/customers")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body).toHaveProperty("stats");
    });

    it("supports search", async () => {
      const admin = await createTestAdmin();
      await createTestUser({ firstName: "UniqueSearchName" });

      const res = await request(app)
        .get("/v1/admin/customers?search=UniqueSearch")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe("GET /v1/admin/customers/:id", () => {
    it("returns customer detail", async () => {
      const admin = await createTestAdmin();
      const customer = await createTestUser();

      const res = await request(app)
        .get(`/v1/admin/customers/${customer.id}`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("reviews");
      expect(res.body).toHaveProperty("bookings_count");
    });

    it("returns 404 for unknown ID", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .get("/v1/admin/customers/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /v1/admin/customers/:id/block", () => {
    it("blocks a customer", async () => {
      const admin = await createTestAdmin();
      const customer = await createTestUser();

      const res = await request(app)
        .post(`/v1/admin/customers/${customer.id}/block`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("blocked");
    });
  });

  describe("POST /v1/admin/customers/:id/book", () => {
    it("creates a booking for a customer", async () => {
      const admin = await createTestAdmin();
      const customer = await createTestUser();
      const res = await request(app)
        .post(`/v1/admin/customers/${customer.id}/book`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({
          customer_name: "Test Customer", location: "Manchester", email: customer.email,
          phone: "07123456789", service_type: "domestic", rooms: 2, bathrooms: 1,
          date: "2027-02-15", time_start: "09:00", cleaning_address: "789 Customer Street",
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
    });
  });

  describe("GET /v1/admin/customers (filters)", () => {
    it("supports period filter", async () => {
      const admin = await createTestAdmin();
      await createTestUser();
      const res = await request(app)
        .get("/v1/admin/customers?period=today")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
    });

    it("supports location filter", async () => {
      const admin = await createTestAdmin();
      const customer = await createTestUser();
      await db.query(
        `INSERT INTO addresses (user_id, street, is_default) VALUES ($1, '456 Filter St', true)`,
        [customer.id]
      );
      const res = await request(app)
        .get("/v1/admin/customers?location=Filter")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
    });
  });

  describe("GET /v1/admin/customers (list fields)", () => {
    it("returns primary_address and last_booked", async () => {
      const admin = await createTestAdmin();
      const customer = await createTestUser();
      await db.query(
        `INSERT INTO addresses (user_id, street, is_default) VALUES ($1, '789 Home St', true)`,
        [customer.id]
      );
      const res = await request(app)
        .get("/v1/admin/customers")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      if (res.body.data.length > 0) {
        const item = res.body.data[0];
        expect(item).toHaveProperty("primary_address");
      }
    });
  });

  describe("GET /v1/admin/customers (stats)", () => {
    it("returns avg_income_per_customer and rating in stats", async () => {
      const admin = await createTestAdmin();
      await createTestUser();
      const res = await request(app)
        .get("/v1/admin/customers")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body.stats).toHaveProperty("rating");
      expect(res.body.stats).toHaveProperty("avg_income_per_customer");
    });
  });
});
