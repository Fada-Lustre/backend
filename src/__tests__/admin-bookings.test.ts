import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestAdmin, createTestUser } from "../test/helpers";
import { truncateAll } from "../test/setup";
import db from "../db";

describe("Admin Bookings", () => {
  beforeEach(async () => { await truncateAll(); });

  async function createBookingData() {
    const customer = await createTestUser();
    const addrRows = await db.query(
      `INSERT INTO addresses (user_id, street) VALUES ($1, '123 Test St') RETURNING id`,
      [customer.id]
    ) as { id: string }[];
    const bookingRows = await db.query(
      `INSERT INTO bookings (customer_id, address_id, service_type, rooms, bathrooms, scheduled_date, time_start, booking_fee, total_price, status)
       VALUES ($1, $2, 'domestic', 3, 1, CURRENT_DATE + 1, '09:00', 5, 50, 'unassigned')
       RETURNING id`,
      [customer.id, addrRows[0]!.id]
    ) as { id: string }[];
    return { customer, bookingId: bookingRows[0]!.id };
  }

  describe("GET /v1/admin/bookings", () => {
    it("returns 200 with booking list", async () => {
      const admin = await createTestAdmin();
      await createBookingData();

      const res = await request(app)
        .get("/v1/admin/bookings")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body).toHaveProperty("stats");
      expect(res.body).toHaveProperty("meta");
    });
  });

  describe("GET /v1/admin/bookings/:id", () => {
    it("returns booking detail", async () => {
      const admin = await createTestAdmin();
      const { bookingId } = await createBookingData();

      const res = await request(app)
        .get(`/v1/admin/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("customer");
      expect(res.body.id).toBe(bookingId);
    });

    it("returns 404 for unknown ID", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .get("/v1/admin/bookings/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /v1/admin/bookings/:id/assign", () => {
    it("assigns a cleaner", async () => {
      const admin = await createTestAdmin();
      const { bookingId } = await createBookingData();
      const cleaner = await createTestUser({ role: "cleaner" });

      const res = await request(app)
        .post(`/v1/admin/bookings/${bookingId}/assign`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ cleaner_id: cleaner.id });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("scheduled");
      expect(res.body.cleaner).toHaveProperty("id");
    });
  });

  describe("POST /v1/admin/bookings/:id/cancel", () => {
    it("cancels a booking", async () => {
      const admin = await createTestAdmin();
      const { bookingId } = await createBookingData();

      const res = await request(app)
        .post(`/v1/admin/bookings/${bookingId}/cancel`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("cancelled");
      expect(res.body.notifications_sent).toContain("customer");
    });
  });

  describe("PATCH /v1/admin/bookings/:id/reschedule", () => {
    it("reschedules a booking", async () => {
      const admin = await createTestAdmin();
      const { bookingId } = await createBookingData();

      const res = await request(app)
        .patch(`/v1/admin/bookings/${bookingId}/reschedule`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ date: "2030-01-15", start_time: "10:00" });

      expect(res.status).toBe(200);
    });
  });

  describe("POST /v1/admin/bookings/:id/receipt", () => {
    it("sends a receipt", async () => {
      const admin = await createTestAdmin();
      const { bookingId } = await createBookingData();

      const res = await request(app)
        .post(`/v1/admin/bookings/${bookingId}/receipt`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Receipt sent to customer");
    });
  });

  describe("POST /v1/admin/bookings", () => {
    it("creates a booking on behalf of customer", async () => {
      const admin = await createTestAdmin();
      const res = await request(app)
        .post("/v1/admin/bookings")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({
          customer_name: "New Customer", location: "London", email: `admin-book-${Date.now()}@test.com`,
          phone: "07123456789", service_type: "domestic", rooms: 3, bathrooms: 1,
          date: "2027-01-15", time_start: "10:00", cleaning_address: "456 Admin Street",
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("status");
    });
  });

  describe("GET /v1/admin/bookings/:id (location)", () => {
    it("returns location from address", async () => {
      const admin = await createTestAdmin();
      const { bookingId } = await createBookingData();
      const res = await request(app)
        .get(`/v1/admin/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body.location).toBeTruthy();
    });
  });

  describe("GET /v1/admin/bookings (filters)", () => {
    it("supports location filter", async () => {
      const admin = await createTestAdmin();
      await createBookingData();
      const res = await request(app)
        .get("/v1/admin/bookings?location=Test")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /v1/admin/bookings (list fields)", () => {
    it("returns created_at in booking list items", async () => {
      const admin = await createTestAdmin();
      await createBookingData();
      const res = await request(app)
        .get("/v1/admin/bookings")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      if (res.body.data.length > 0) {
        expect(res.body.data[0]).toHaveProperty("created_at");
      }
    });
  });

  describe("GET /v1/admin/bookings/:id/images/download", () => {
    it("returns image download URLs", async () => {
      const admin = await createTestAdmin();
      const { bookingId } = await createBookingData();
      const res = await request(app)
        .get(`/v1/admin/bookings/${bookingId}/images/download`)
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("images");
      expect(res.body.images).toBeInstanceOf(Array);
    });

    it("returns 404 for unknown booking", async () => {
      const admin = await createTestAdmin();
      const res = await request(app)
        .get("/v1/admin/bookings/00000000-0000-0000-0000-000000000000/images/download")
        .set("Authorization", `Bearer ${admin.token}`);
      expect(res.status).toBe(404);
    });
  });
});
