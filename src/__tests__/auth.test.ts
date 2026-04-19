import { describe, it, expect } from "vitest";
import request from "supertest";
import { app, createTestUser, signTestRefreshToken } from "../test/helpers";
import db from "../db";

describe("Auth endpoints", () => {
  describe("POST /v1/auth/register", () => {
    it("creates a user and returns tokens", async () => {
      const res = await request(app)
        .post("/v1/auth/register")
        .send({ first_name: "Jane", email: `reg-${Date.now()}@test.com`, password: "StrongPass1", service_type: "domestic" });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("refresh_token");
      expect(res.body.first_name).toBe("Jane");
    });

    it("rejects weak passwords", async () => {
      const res = await request(app)
        .post("/v1/auth/register")
        .send({ first_name: "Jane", email: "weak@test.com", password: "short", service_type: "domestic" });
      expect(res.status).toBe(400);
      expect(res.body.code).toBe("VALIDATION_ERROR");
    });

    it("rejects duplicate emails", async () => {
      const email = `dup-${Date.now()}@test.com`;
      await request(app).post("/v1/auth/register").send({ first_name: "A", email, password: "StrongPass1", service_type: "domestic" });
      const res = await request(app).post("/v1/auth/register").send({ first_name: "B", email, password: "StrongPass1", service_type: "domestic" });
      expect(res.status).toBe(409);
    });
  });

  describe("POST /v1/auth/login", () => {
    it("returns tokens for valid credentials", async () => {
      const email = `login-${Date.now()}@test.com`;
      await request(app).post("/v1/auth/register").send({ first_name: "A", email, password: "StrongPass1", service_type: "domestic" });
      const res = await request(app).post("/v1/auth/login").send({ email, password: "StrongPass1" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("rejects invalid credentials", async () => {
      const res = await request(app).post("/v1/auth/login").send({ email: "no@user.com", password: "Wrong1234" });
      expect(res.status).toBe(401);
    });

    it("rejects blocked user login", async () => {
      const email = `blocked-${Date.now()}@test.com`;
      await request(app).post("/v1/auth/register").send({ first_name: "B", email, password: "StrongPass1", service_type: "domestic" });
      await db.query("UPDATE users SET status = 'blocked' WHERE email = $1", [email]);
      const res = await request(app).post("/v1/auth/login").send({ email, password: "StrongPass1" });
      expect(res.status).toBe(403);
      expect(res.body.code).toBe("ACCOUNT_BLOCKED");
    });
  });

  describe("POST /v1/auth/refresh", () => {
    it("issues new tokens for a valid refresh token", async () => {
      const user = await createTestUser();
      const res = await request(app).post("/v1/auth/refresh").send({ refresh_token: user.refreshToken });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("refresh_token");
    });

    it("rejects an invalid refresh token", async () => {
      const res = await request(app).post("/v1/auth/refresh").send({ refresh_token: "bad-token" });
      expect(res.status).toBe(401);
    });

    it("rejects an expired refresh token", async () => {
      const user = await createTestUser();
      const expired = signTestRefreshToken(user.id, 0);
      await new Promise((r) => setTimeout(r, 50));
      const res = await request(app).post("/v1/auth/refresh").send({ refresh_token: expired });
      expect(res.status).toBe(401);
    });

    it("rejects refresh for blocked user", async () => {
      const user = await createTestUser();
      await db.query("UPDATE users SET status = 'blocked' WHERE id = $1", [user.id]);
      const res = await request(app).post("/v1/auth/refresh").send({ refresh_token: user.refreshToken });
      expect(res.status).toBe(403);
      expect(res.body.code).toBe("ACCOUNT_BLOCKED");
    });
  });

  describe("POST /v1/auth/forgot-password", () => {
    it("returns success even for unknown phone", async () => {
      const res = await request(app).post("/v1/auth/forgot-password").send({ phone: "+44000000000" });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain("verification code");
    });
  });

  describe("POST /v1/auth/change-password", () => {
    it("changes password for authenticated user", async () => {
      const email = `chpw-${Date.now()}@test.com`;
      await request(app).post("/v1/auth/register").send({ first_name: "A", email, password: "OldPass1A", service_type: "domestic" });
      const login = await request(app).post("/v1/auth/login").send({ email, password: "OldPass1A" });
      const token = login.body.token;

      const res = await request(app)
        .post("/v1/auth/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({ current_password: "OldPass1A", new_password: "NewPass1B", confirm_password: "NewPass1B" });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password changed");

      const relogin = await request(app).post("/v1/auth/login").send({ email, password: "NewPass1B" });
      expect(relogin.status).toBe(200);
    });

    it("rejects wrong current password", async () => {
      const user = await createTestUser({ password: "CorrectPass1" });
      const res = await request(app)
        .post("/v1/auth/change-password")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ current_password: "WrongPass1", new_password: "NewPass1B", confirm_password: "NewPass1B" });
      expect(res.status).toBe(400);
      expect(res.body.code).toBe("INVALID_PASSWORD");
    });

    it("rejects unauthenticated request", async () => {
      const res = await request(app)
        .post("/v1/auth/change-password")
        .send({ current_password: "x", new_password: "y", confirm_password: "y" });
      expect(res.status).toBe(401);
    });

    it("rejects mismatched passwords", async () => {
      const user = await createTestUser({ password: "CorrectPass1" });
      const res = await request(app)
        .post("/v1/auth/change-password")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ current_password: "CorrectPass1", new_password: "NewPass1A", confirm_password: "Different1" });
      expect(res.status).toBe(400);
    });
  });
});
