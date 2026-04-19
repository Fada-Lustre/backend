import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestUser } from "../test/helpers";
import { truncateAll } from "../test/setup";
import db from "../db";
import bcrypt from "bcryptjs";

describe("Cleaner Security endpoints", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("PATCH /v1/cleaner/security/pin", () => {
    it("sets PIN for first time (no old_pin required match)", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .patch("/v1/cleaner/security/pin")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ old_pin: "", new_pin: "1234", confirm_pin: "1234" });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain("PIN changed");
    });

    it("changes PIN when old PIN is correct", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const pinHash = await bcrypt.hash("1234", 4);
      await db.query("UPDATE users SET transaction_pin_hash = $1 WHERE id = $2", [pinHash, cleaner.id]);

      const res = await request(app)
        .patch("/v1/cleaner/security/pin")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ old_pin: "1234", new_pin: "5678", confirm_pin: "5678" });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain("PIN changed");
    });

    it("rejects wrong old PIN with 400", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const pinHash = await bcrypt.hash("1234", 4);
      await db.query("UPDATE users SET transaction_pin_hash = $1 WHERE id = $2", [pinHash, cleaner.id]);

      const res = await request(app)
        .patch("/v1/cleaner/security/pin")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ old_pin: "9999", new_pin: "5678", confirm_pin: "5678" });
      expect(res.status).toBe(400);
      expect(res.body.code).toBe("INVALID_PIN");
    });

    it("rejects mismatched confirm_pin with 400", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .patch("/v1/cleaner/security/pin")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ old_pin: "", new_pin: "1234", confirm_pin: "4321" });
      expect(res.status).toBe(400);
    });

    it("rejects customer role with 403", async () => {
      const customer = await createTestUser({ role: "customer" });
      const res = await request(app)
        .patch("/v1/cleaner/security/pin")
        .set("Authorization", `Bearer ${customer.token}`)
        .send({ old_pin: "", new_pin: "1234", confirm_pin: "1234" });
      expect(res.status).toBe(403);
    });

    it("rejects non-4-digit PIN with 400", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .patch("/v1/cleaner/security/pin")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ old_pin: "", new_pin: "12345", confirm_pin: "12345" });
      expect(res.status).toBe(400);
    });

    it("rejects non-numeric PIN with 400", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .patch("/v1/cleaner/security/pin")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ old_pin: "", new_pin: "abcd", confirm_pin: "abcd" });
      expect(res.status).toBe(400);
    });
  });
});
