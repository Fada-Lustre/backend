import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestUser, signTestToken } from "../test/helpers";
import { truncateAll } from "../test/setup";

describe("Cleaner Profile endpoints", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/cleaner/profile", () => {
    it("returns cleaner profile", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .get("/v1/cleaner/profile")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", cleaner.id);
      expect(res.body).toHaveProperty("completed_bookings", 0);
    });

    it("rejects customer role with 403", async () => {
      const customer = await createTestUser({ role: "customer" });
      const res = await request(app)
        .get("/v1/cleaner/profile")
        .set("Authorization", `Bearer ${customer.token}`);
      expect(res.status).toBe(403);
    });

    it("rejects unauthenticated with 401", async () => {
      const res = await request(app).get("/v1/cleaner/profile");
      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /v1/cleaner/profile", () => {
    it("updates first_name and last_name", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .patch("/v1/cleaner/profile")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ first_name: "Updated", last_name: "Name" });
      expect(res.status).toBe(200);
      expect(res.body.first_name).toBe("Updated");
      expect(res.body.last_name).toBe("Name");
    });
  });

  describe("PATCH /v1/cleaner/profile/phone", () => {
    it("triggers OTP for phone update", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .patch("/v1/cleaner/profile/phone")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ phone: "+44123456789", verification_method: "sms" });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain("Verification");
    });
  });

  describe("PATCH /v1/cleaner/profile/address", () => {
    it("updates home address", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .patch("/v1/cleaner/profile/address")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ address: "123 Main St", country: "UK", postcode: "SW1A 1AA", floor_number: "2" });
      expect(res.status).toBe(200);
      expect(res.body.street).toBe("123 Main St");
      expect(res.body.country).toBe("UK");
      expect(res.body.postcode).toBe("SW1A 1AA");
    });

    it("returns address in profile after update", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      await request(app)
        .patch("/v1/cleaner/profile/address")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ address: "456 Oak Rd", country: "UK", postcode: "E1 6AN" });

      const res = await request(app)
        .get("/v1/cleaner/profile")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.address).not.toBeNull();
      expect(res.body.address.street).toBe("456 Oak Rd");
    });

    it("rejects address update with missing required fields", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .patch("/v1/cleaner/profile/address")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ floor_number: "2" });
      expect(res.status).toBe(400);
    });
  });
});
