import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { app, createTestUser } from "../test/helpers";
import { truncateAll } from "../test/setup";
import db from "../db";

describe("Auth OTP endpoints", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("POST /v1/auth/verify-otp", () => {
    it("verifies a valid OTP", async () => {
      const user = await createTestUser();
      const phone = "+447000000001";
      const code = "123456";
      const codeHash = await bcrypt.hash(code, 4);
      await db.query(
        `INSERT INTO otp_codes (user_id, phone, code_hash, purpose, expires_at)
         VALUES ($1, $2, $3, 'password_reset', NOW() + INTERVAL '10 minutes')`,
        [user.id, phone, codeHash]
      );
      const res = await request(app)
        .post("/v1/auth/verify-otp")
        .send({ phone, code });
      expect(res.status).toBe(200);
    });

    it("rejects invalid OTP", async () => {
      const res = await request(app)
        .post("/v1/auth/verify-otp")
        .send({ phone: "+447000000002", code: "000000" });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /v1/auth/reset-password", () => {
    it("rejects without verified OTP", async () => {
      const res = await request(app)
        .post("/v1/auth/reset-password")
        .send({ phone: "+447000000003", new_password: "NewPass1234!", confirm_password: "NewPass1234!" });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /v1/auth/admin/verify-otp", () => {
    it("returns 400 for invalid OTP", async () => {
      const res = await request(app)
        .post("/v1/auth/admin/verify-otp")
        .send({ email: "admin@test.com", code: "000000", purpose: "password_reset" });
      expect([400, 404]).toContain(res.status);
    });
  });
});
