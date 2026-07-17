import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../test/helpers";

// Always schedule against a date safely in the future so the test does not rot.
function futureDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

describe("Quote endpoints", () => {
  describe("POST /v1/quotes", () => {
    it("creates a quote", async () => {
      const res = await request(app)
        .post("/v1/quotes")
        .send({
          postcode: "DE1 1AA", rooms: 3, bathrooms: 1,
          hours: 3, cleaning_products: "bring",
          frequency: "every-week", email: "test@example.com",
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("total");
    });

    it("rejects missing required fields", async () => {
      const res = await request(app)
        .post("/v1/quotes")
        .send({ rooms: 1, bathrooms: 1 });
      expect([400, 500]).toContain(res.status);
    });
  });

  describe("PATCH /v1/quotes/:id/schedule", () => {
    it("schedules a quote", async () => {
      const quoteRes = await request(app)
        .post("/v1/quotes")
        .send({
          postcode: "DE1 1AA", rooms: 3, bathrooms: 1,
          hours: 3, cleaning_products: "bring",
          frequency: "every-week", email: "test@example.com",
        });
      const quoteId = quoteRes.body.id;
      const res = await request(app)
        .patch(`/v1/quotes/${quoteId}/schedule`)
        .send({ preferred_date: futureDate(), preferred_time: "10:00" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id");
    });

    it("returns 404 for non-existent quote", async () => {
      const res = await request(app)
        .patch("/v1/quotes/00000000-0000-0000-0000-000000000000/schedule")
        .send({ preferred_date: futureDate(), preferred_time: "10:00" });
      expect(res.status).toBe(404);
    });
  });
});
