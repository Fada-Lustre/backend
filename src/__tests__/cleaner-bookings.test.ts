import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestUser } from "../test/helpers";
import { truncateAll } from "../test/setup";
import db from "../db";

async function createAssignedBooking(customerId: string, cleanerId: string, status = "scheduled") {
  const addrRows = await db.query(
    `INSERT INTO addresses (user_id, label, street)
     VALUES ($1, 'home', '1 Test Rd') RETURNING id`,
    [customerId]
  ) as { id: string }[];

  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const rows = await db.query(
    `INSERT INTO bookings (customer_id, cleaner_id, address_id, service_type, status, scheduled_date, time_start, rooms, bathrooms, booking_fee, total_price, created_by)
     VALUES ($1, $2, $3, 'domestic', $4, $5, '09:00', 2, 1, 0, 50, $1) RETURNING id`,
    [customerId, cleanerId, addrRows[0]!.id, status, tomorrow]
  ) as { id: string }[];

  return rows[0]!.id;
}

describe("Cleaner Booking endpoints", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/cleaner/bookings", () => {
    it("lists assigned bookings", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      await createAssignedBooking(customer.id, cleaner.id);

      const res = await request(app)
        .get("/v1/cleaner/bookings")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it("rejects customer role with 403", async () => {
      const customer = await createTestUser({ role: "customer" });
      const res = await request(app)
        .get("/v1/cleaner/bookings")
        .set("Authorization", `Bearer ${customer.token}`);
      expect(res.status).toBe(403);
    });
  });

  describe("GET /v1/cleaner/bookings/:id", () => {
    it("returns booking detail for assigned cleaner", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      const bookingId = await createAssignedBooking(customer.id, cleaner.id);

      const res = await request(app)
        .get(`/v1/cleaner/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(bookingId);
    });

    it("returns 403 for unassigned cleaner", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner1 = await createTestUser({ role: "cleaner", email: `c1-${Date.now()}@test.com` });
      const cleaner2 = await createTestUser({ role: "cleaner", email: `c2-${Date.now()}@test.com` });
      const bookingId = await createAssignedBooking(customer.id, cleaner1.id);

      const res = await request(app)
        .get(`/v1/cleaner/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${cleaner2.token}`);
      expect(res.status).toBe(403);
    });
  });

  describe("POST /v1/cleaner/bookings/:id/start", () => {
    it("transitions scheduled -> on_the_way", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      const bookingId = await createAssignedBooking(customer.id, cleaner.id, "scheduled");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/start`)
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("on_the_way");
    });

    it("rejects starting a non-scheduled booking with 409", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      const bookingId = await createAssignedBooking(customer.id, cleaner.id, "done");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/start`)
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(409);
    });
  });

  describe("POST /v1/cleaner/bookings/:id/finish", () => {
    it("transitions on_the_way -> done", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      const bookingId = await createAssignedBooking(customer.id, cleaner.id, "on_the_way");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/finish`)
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("done");
    });

    it("rejects finishing a scheduled booking with 409", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      const bookingId = await createAssignedBooking(customer.id, cleaner.id, "scheduled");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/finish`)
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(409);
    });
  });

  describe("POST /v1/cleaner/bookings/:id/cancel", () => {
    it("cancels a scheduled booking", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      const bookingId = await createAssignedBooking(customer.id, cleaner.id, "scheduled");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/cancel`)
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("cancelled");
    });

    it("rejects cancelling a done booking with 409", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      const bookingId = await createAssignedBooking(customer.id, cleaner.id, "done");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/cancel`)
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(409);
    });
  });

  describe("POST /v1/cleaner/bookings/:id/rate", () => {
    it("rates a customer on a done booking", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      const bookingId = await createAssignedBooking(customer.id, cleaner.id, "done");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/rate`)
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ rating: 5, review: "Great customer" });
      expect(res.status).toBe(201);
      expect(res.body.rating).toBe(5);
    });

    it("rejects invalid rating with 400", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      const bookingId = await createAssignedBooking(customer.id, cleaner.id, "done");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/rate`)
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ rating: 6 });
      expect(res.status).toBe(400);
    });

    it("rejects rating a non-done booking with 409", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      const bookingId = await createAssignedBooking(customer.id, cleaner.id, "scheduled");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/rate`)
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ rating: 4 });
      expect(res.status).toBe(409);
    });

    it("rejects duplicate rating with 409", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      const bookingId = await createAssignedBooking(customer.id, cleaner.id, "done");

      await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/rate`)
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ rating: 5 });

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/rate`)
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ rating: 4 });
      expect(res.status).toBe(409);
      expect(res.body.code).toBe("ALREADY_RATED");
    });
  });

  describe("GET /v1/cleaner/bookings with filters", () => {
    it("filters by upcoming", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      await createAssignedBooking(customer.id, cleaner.id, "scheduled");
      await createAssignedBooking(customer.id, cleaner.id, "done");

      const res = await request(app)
        .get("/v1/cleaner/bookings?filter=upcoming")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe("scheduled");
    });

    it("filters by past", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      await createAssignedBooking(customer.id, cleaner.id, "scheduled");
      await createAssignedBooking(customer.id, cleaner.id, "done");

      const res = await request(app)
        .get("/v1/cleaner/bookings?filter=past")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe("done");
    });

    it("filters by new (scheduled only)", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      await createAssignedBooking(customer.id, cleaner.id, "scheduled");
      await createAssignedBooking(customer.id, cleaner.id, "on_the_way");

      const res = await request(app)
        .get("/v1/cleaner/bookings?filter=new")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe("scheduled");
    });
  });

  describe("GET /v1/cleaner/bookings/:id edge cases", () => {
    it("returns 404 for unknown booking ID", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .get("/v1/cleaner/bookings/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(404);
    });
  });

  describe("Wrong cleaner on mutations", () => {
    it("rejects start by unassigned cleaner with 403", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner1 = await createTestUser({ role: "cleaner", email: `m1-${Date.now()}@test.com` });
      const cleaner2 = await createTestUser({ role: "cleaner", email: `m2-${Date.now()}@test.com` });
      const bookingId = await createAssignedBooking(customer.id, cleaner1.id, "scheduled");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/start`)
        .set("Authorization", `Bearer ${cleaner2.token}`);
      expect(res.status).toBe(403);
    });

    it("rejects finish by unassigned cleaner with 403", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner1 = await createTestUser({ role: "cleaner", email: `m3-${Date.now()}@test.com` });
      const cleaner2 = await createTestUser({ role: "cleaner", email: `m4-${Date.now()}@test.com` });
      const bookingId = await createAssignedBooking(customer.id, cleaner1.id, "on_the_way");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/finish`)
        .set("Authorization", `Bearer ${cleaner2.token}`);
      expect(res.status).toBe(403);
    });

    it("rejects cancel by unassigned cleaner with 403", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner1 = await createTestUser({ role: "cleaner", email: `m5-${Date.now()}@test.com` });
      const cleaner2 = await createTestUser({ role: "cleaner", email: `m6-${Date.now()}@test.com` });
      const bookingId = await createAssignedBooking(customer.id, cleaner1.id, "scheduled");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/cancel`)
        .set("Authorization", `Bearer ${cleaner2.token}`);
      expect(res.status).toBe(403);
    });
  });

  describe("POST /v1/cleaner/bookings/:id/finish from ongoing", () => {
    it("transitions ongoing -> done", async () => {
      const customer = await createTestUser({ role: "customer" });
      const cleaner = await createTestUser({ role: "cleaner" });
      const bookingId = await createAssignedBooking(customer.id, cleaner.id, "ongoing");

      const res = await request(app)
        .post(`/v1/cleaner/bookings/${bookingId}/finish`)
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("done");
    });
  });
});
