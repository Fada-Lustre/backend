import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestUser } from "../test/helpers";
import { truncateAll } from "../test/setup";

describe("Cleaner Availability endpoints", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/cleaner/availability", () => {
    it("returns default availability for new cleaner", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .get("/v1/cleaner/availability")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.mode).toBe("every_day");
      expect(res.body.schedule).toHaveProperty("monday");
      expect(res.body.accept_bookings).toBe(true);
    });

    it("rejects customer role with 403", async () => {
      const customer = await createTestUser({ role: "customer" });
      const res = await request(app)
        .get("/v1/cleaner/availability")
        .set("Authorization", `Bearer ${customer.token}`);
      expect(res.status).toBe(403);
    });
  });

  describe("PUT /v1/cleaner/availability", () => {
    it("updates availability schedule", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const schedule = {
        monday: { accept: true, start: "08:00", end: "16:00" },
        tuesday: { accept: true, start: "08:00", end: "16:00" },
        wednesday: { accept: false },
        thursday: { accept: true, start: "10:00", end: "18:00" },
        friday: { accept: true, start: "08:00", end: "16:00" },
        saturday: { accept: false },
        sunday: { accept: false },
      };
      const res = await request(app)
        .put("/v1/cleaner/availability")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ mode: "custom", schedule });
      expect(res.status).toBe(200);
      expect(res.body.mode).toBe("custom");
      expect(res.body.schedule.wednesday.accept).toBe(false);
    });

    it("rejects invalid mode with 400", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .put("/v1/cleaner/availability")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ mode: "invalid_mode", schedule: {} });
      expect(res.status).toBe(400);
    });

    it("persists changes across GET", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const schedule = {
        monday: { accept: true, start: "07:00", end: "15:00" },
        tuesday: { accept: true, start: "07:00", end: "15:00" },
        wednesday: { accept: true, start: "07:00", end: "15:00" },
        thursday: { accept: true, start: "07:00", end: "15:00" },
        friday: { accept: true, start: "07:00", end: "15:00" },
        saturday: { accept: false },
        sunday: { accept: false },
      };
      await request(app)
        .put("/v1/cleaner/availability")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ mode: "weekdays", schedule });

      const res = await request(app)
        .get("/v1/cleaner/availability")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.body.mode).toBe("weekdays");
    });
  });
});
