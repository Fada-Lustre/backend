import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../test/helpers";

describe("Stripe Webhook", () => {
  const baseEvent = {
    id: "evt_test_001",
    type: "payment_intent.succeeded",
    data: { object: { id: "pi_test", metadata: { booking_id: "00000000-0000-0000-0000-000000000000" } } },
  };

  describe("POST /v1/payments/webhook", () => {
    it("rejects missing stripe-signature", async () => {
      const res = await request(app)
        .post("/v1/payments/webhook")
        .send(baseEvent);
      expect(res.status).toBe(401);
    });

    it("processes payment_intent.succeeded", async () => {
      const res = await request(app)
        .post("/v1/payments/webhook")
        .set("stripe-signature", "sig_test")
        .set("Content-Type", "application/json")
        .send(JSON.stringify(baseEvent));
      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
    });

    it("processes payment_intent.payment_failed", async () => {
      const res = await request(app)
        .post("/v1/payments/webhook")
        .set("stripe-signature", "sig_test")
        .set("Content-Type", "application/json")
        .send(JSON.stringify({ ...baseEvent, type: "payment_intent.payment_failed" }));
      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
    });

    it("ignores unknown event types", async () => {
      const res = await request(app)
        .post("/v1/payments/webhook")
        .set("stripe-signature", "sig_test")
        .set("Content-Type", "application/json")
        .send(JSON.stringify({ ...baseEvent, type: "unknown.event" }));
      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
    });
  });
});
