import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestUser, createTestAddress, createTestBooking } from "../test/helpers";
import { truncateAll } from "../test/setup";

describe("Booking endpoints", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("POST /v1/bookings", () => {
    it("creates a booking", async () => {
      const user = await createTestUser();
      const addr = await createTestAddress(user.id);
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      const res = await request(app)
        .post("/v1/bookings")
        .set("Authorization", `Bearer ${user.token}`)
        .send({
          address_id: addr.id, service_type: "domestic", condition: "mildly_used",
          property_type: "home", total_sq_metres: 80, rooms: 3, floors: 1,
          bathrooms: 1, date: tomorrow, time: "10:00",
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.status).toBe("unassigned");
    });

    it("rejects unauthenticated request", async () => {
      const res = await request(app).post("/v1/bookings").send({});
      expect(res.status).toBe(401);
    });

    it("rejects missing address_id", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/v1/bookings")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ service_type: "domestic", condition: "new", property_type: "home", total_sq_metres: 50, rooms: 2, floors: 1, bathrooms: 1, date: "2027-06-01", time: "09:00" });
      expect([400, 500]).toContain(res.status);
    });
  });

  describe("GET /v1/bookings", () => {
    it("returns empty list for new user", async () => {
      const user = await createTestUser();
      const res = await request(app).get("/v1/bookings").set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });

    it("returns bookings for user", async () => {
      const user = await createTestUser();
      const addr = await createTestAddress(user.id);
      await createTestBooking(user.id, addr.id);
      const res = await request(app).get("/v1/bookings").set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("rejects unauthenticated request", async () => {
      const res = await request(app).get("/v1/bookings");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /v1/bookings/:id", () => {
    it("returns booking detail", async () => {
      const user = await createTestUser();
      const addr = await createTestAddress(user.id);
      const booking = await createTestBooking(user.id, addr.id);
      const res = await request(app)
        .get(`/v1/bookings/${booking.id}`)
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(booking.id);
      expect(res.body).toHaveProperty("payment");
    });

    it("returns 404 for non-existent booking", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .get("/v1/bookings/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /v1/bookings/:id/amend", () => {
    it("amends a booking", async () => {
      const user = await createTestUser();
      const addr = await createTestAddress(user.id);
      const booking = await createTestBooking(user.id, addr.id);
      const res = await request(app)
        .patch(`/v1/bookings/${booking.id}/amend`)
        .set("Authorization", `Bearer ${user.token}`)
        .send({ rooms: 5, additional_info: "Extra room" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("amendment_id");
    });

    it("returns 404 for non-existent booking", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .patch("/v1/bookings/00000000-0000-0000-0000-000000000000/amend")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ rooms: 3 });
      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /v1/bookings/:id/reschedule", () => {
    it("reschedules a booking", async () => {
      const user = await createTestUser();
      const addr = await createTestAddress(user.id);
      const booking = await createTestBooking(user.id, addr.id);
      const futureDate = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
      const res = await request(app)
        .patch(`/v1/bookings/${booking.id}/reschedule`)
        .set("Authorization", `Bearer ${user.token}`)
        .send({ date: futureDate, time: "14:00" });
      expect(res.status).toBe(200);
      expect(res.body.new_date).toBe(futureDate);
    });

    it("returns 404 for non-existent booking", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .patch("/v1/bookings/00000000-0000-0000-0000-000000000000/reschedule")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ date: "2027-12-01", time: "10:00" });
      expect(res.status).toBe(404);
    });
  });

  describe("POST /v1/bookings/:id/pay", () => {
    it("pays for a booking with cash", async () => {
      const user = await createTestUser();
      const addr = await createTestAddress(user.id);
      const booking = await createTestBooking(user.id, addr.id);
      const res = await request(app)
        .post(`/v1/bookings/${booking.id}/pay`)
        .set("Authorization", `Bearer ${user.token}`)
        .send({ method: "cash", tip: 5 });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("transaction_id");
      expect(res.body.status).toBe("confirmed");
    });

    it("returns 404 for non-existent booking", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/v1/bookings/00000000-0000-0000-0000-000000000000/pay")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ method: "cash" });
      expect(res.status).toBe(404);
    });
  });

  describe("GET /v1/bookings/:id/receipt", () => {
    it("returns receipt for a booking", async () => {
      const user = await createTestUser();
      const addr = await createTestAddress(user.id);
      const booking = await createTestBooking(user.id, addr.id);
      const res = await request(app)
        .get(`/v1/bookings/${booking.id}/receipt`)
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("service");
      expect(res.body).toHaveProperty("payment_status");
    });

    it("returns 404 for non-existent booking", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .get("/v1/bookings/00000000-0000-0000-0000-000000000000/receipt")
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /v1/bookings/:id/cancel", () => {
    it("cancels a booking", async () => {
      const user = await createTestUser();
      const addr = await createTestAddress(user.id);
      const booking = await createTestBooking(user.id, addr.id);
      const res = await request(app)
        .post(`/v1/bookings/${booking.id}/cancel`)
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("cancelled");
    });

    it("returns 404 for non-existent booking", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/v1/bookings/00000000-0000-0000-0000-000000000000/cancel")
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /v1/bookings/:id/rebook", () => {
    it("rebooks a cancelled booking", async () => {
      const user = await createTestUser();
      const addr = await createTestAddress(user.id);
      const booking = await createTestBooking(user.id, addr.id, { status: "cancelled" });
      const res = await request(app)
        .post(`/v1/bookings/${booking.id}/rebook`)
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.cloned_from).toBe(booking.id);
    });

    it("returns 404 for non-existent booking", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/v1/bookings/00000000-0000-0000-0000-000000000000/rebook")
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /v1/bookings/:id/rate", () => {
    it("rates a completed booking", async () => {
      const user = await createTestUser();
      const cleaner = await createTestUser({ role: "cleaner" });
      const addr = await createTestAddress(user.id);
      const booking = await createTestBooking(user.id, addr.id, { cleanerId: cleaner.id, status: "done" });
      const res = await request(app)
        .post(`/v1/bookings/${booking.id}/rate`)
        .set("Authorization", `Bearer ${user.token}`)
        .send({ rating: 5, review: "Excellent service" });
      expect(res.status).toBe(201);
      expect(res.body.rating).toBe(5);
    });

    it("rejects invalid rating", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/v1/bookings/00000000-0000-0000-0000-000000000000/rate")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ rating: 0 });
      expect([400, 404]).toContain(res.status);
    });
  });

  describe("POST /v1/bookings/:id/change-cleaner", () => {
    it("attempts to change cleaner", async () => {
      const user = await createTestUser();
      const cleaner = await createTestUser({ role: "cleaner" });
      const addr = await createTestAddress(user.id);
      const booking = await createTestBooking(user.id, addr.id, { cleanerId: cleaner.id, status: "scheduled" });
      const res = await request(app)
        .post(`/v1/bookings/${booking.id}/change-cleaner`)
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success");
    });

    it("returns 404 for non-existent booking", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/v1/bookings/00000000-0000-0000-0000-000000000000/change-cleaner")
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(404);
    });
  });

  describe("GET /v1/bookings/:id/images", () => {
    it("returns images for a booking", async () => {
      const user = await createTestUser();
      const addr = await createTestAddress(user.id);
      const booking = await createTestBooking(user.id, addr.id);
      const res = await request(app)
        .get(`/v1/bookings/${booking.id}/images`)
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it("returns 404 for non-existent booking", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .get("/v1/bookings/00000000-0000-0000-0000-000000000000/images")
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(404);
    });
  });
});
