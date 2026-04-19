import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestUser } from "../test/helpers";
import { truncateAll } from "../test/setup";
import db from "../db";
import bcrypt from "bcryptjs";

describe("Cleaner Earnings endpoints", () => {
  beforeEach(async () => { await truncateAll(); });

  describe("GET /v1/cleaner/earnings", () => {
    it("returns empty summary for new cleaner", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .get("/v1/cleaner/earnings")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.bookings_completed).toBe(0);
    });

    it("rejects customer role with 403", async () => {
      const customer = await createTestUser({ role: "customer" });
      const res = await request(app)
        .get("/v1/cleaner/earnings")
        .set("Authorization", `Bearer ${customer.token}`);
      expect(res.status).toBe(403);
    });
  });

  describe("GET /v1/cleaner/earnings/income", () => {
    it("returns empty income list", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .get("/v1/cleaner/earnings/income")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.total).toBe(0);
    });
  });

  describe("GET /v1/cleaner/earnings/withdrawals", () => {
    it("returns empty withdrawal list", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .get("/v1/cleaner/earnings/withdrawals")
        .set("Authorization", `Bearer ${cleaner.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.total).toBe(0);
    });
  });

  describe("POST /v1/cleaner/withdrawals", () => {
    it("rejects withdrawal without PIN set", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .post("/v1/cleaner/withdrawals")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ amount: 50, pin: "1234" });
      expect(res.status).toBe(400);
      expect(res.body.code).toBe("PIN_NOT_SET");
    });

    it("rejects withdrawal with wrong PIN", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const pinHash = await bcrypt.hash("1234", 4);
      await db.query("UPDATE users SET transaction_pin_hash = $1 WHERE id = $2", [pinHash, cleaner.id]);

      const res = await request(app)
        .post("/v1/cleaner/withdrawals")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ amount: 50, pin: "9999" });
      expect(res.status).toBe(400);
      expect(res.body.code).toBe("INVALID_PIN");
    });

    it("rejects withdrawal with insufficient balance", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const pinHash = await bcrypt.hash("1234", 4);
      await db.query("UPDATE users SET transaction_pin_hash = $1 WHERE id = $2", [pinHash, cleaner.id]);

      await db.query(
        "INSERT INTO payment_methods (user_id, type, account_number, account_holder, bank_name) VALUES ($1, 'bank_account', '12345678', 'Test', 'TestBank')",
        [cleaner.id]
      );

      const res = await request(app)
        .post("/v1/cleaner/withdrawals")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ amount: 1000, pin: "1234" });
      expect(res.status).toBe(400);
      expect(res.body.code).toBe("INSUFFICIENT_BALANCE");
    });

    it("rejects customer role with 403", async () => {
      const customer = await createTestUser({ role: "customer" });
      const res = await request(app)
        .post("/v1/cleaner/withdrawals")
        .set("Authorization", `Bearer ${customer.token}`)
        .send({ amount: 50, pin: "1234" });
      expect(res.status).toBe(403);
    });

    it("rejects withdrawal with amount <= 0", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const pinHash = await bcrypt.hash("1234", 4);
      await db.query("UPDATE users SET transaction_pin_hash = $1 WHERE id = $2", [pinHash, cleaner.id]);

      const res = await request(app)
        .post("/v1/cleaner/withdrawals")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ amount: 0, pin: "1234" });
      expect(res.status).toBe(400);
    });

    it("rejects withdrawal when no payment method exists", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const pinHash = await bcrypt.hash("1234", 4);
      await db.query("UPDATE users SET transaction_pin_hash = $1 WHERE id = $2", [pinHash, cleaner.id]);

      const customer = await createTestUser({ role: "customer" });
      const addrRows = await db.query(
        "INSERT INTO addresses (user_id, label, street) VALUES ($1, 'home', '1 Rd') RETURNING id",
        [customer.id]
      ) as { id: string }[];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      const bookingRows = await db.query(
        "INSERT INTO bookings (customer_id, cleaner_id, address_id, service_type, status, scheduled_date, time_start, rooms, bathrooms, booking_fee, created_by, total_price) VALUES ($1, $2, $3, 'domestic', 'done', $4, '09:00', 2, 1, 0, $1, 100) RETURNING id",
        [customer.id, cleaner.id, addrRows[0]!.id, tomorrow]
      ) as { id: string }[];
      await db.query(
        "INSERT INTO transactions (booking_id, payer_id, type, amount, payment_method, status) VALUES ($1, $2, 'booking', 100, 'cash', 'successful')",
        [bookingRows[0]!.id, customer.id]
      );

      const res = await request(app)
        .post("/v1/cleaner/withdrawals")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ amount: 50, pin: "1234" });
      expect(res.status).toBe(400);
      expect(res.body.code).toBe("NO_PAYMENT_METHOD");
    });

    it("creates withdrawal successfully with valid PIN and balance", async () => {
      const cleaner = await createTestUser({ role: "cleaner" });
      const pinHash = await bcrypt.hash("1234", 4);
      await db.query("UPDATE users SET transaction_pin_hash = $1 WHERE id = $2", [pinHash, cleaner.id]);

      await db.query(
        "INSERT INTO payment_methods (user_id, type, account_number, account_holder, bank_name) VALUES ($1, 'bank_account', '12345678', 'Test', 'TestBank')",
        [cleaner.id]
      );

      const customer = await createTestUser({ role: "customer" });
      const addrRows = await db.query(
        "INSERT INTO addresses (user_id, label, street) VALUES ($1, 'home', '1 Rd') RETURNING id",
        [customer.id]
      ) as { id: string }[];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      const bookingRows = await db.query(
        "INSERT INTO bookings (customer_id, cleaner_id, address_id, service_type, status, scheduled_date, time_start, rooms, bathrooms, booking_fee, created_by, total_price) VALUES ($1, $2, $3, 'domestic', 'done', $4, '09:00', 2, 1, 0, $1, 200) RETURNING id",
        [customer.id, cleaner.id, addrRows[0]!.id, tomorrow]
      ) as { id: string }[];
      await db.query(
        "INSERT INTO transactions (booking_id, payer_id, type, amount, payment_method, status) VALUES ($1, $2, 'booking', 200, 'cash', 'successful')",
        [bookingRows[0]!.id, customer.id]
      );

      const res = await request(app)
        .post("/v1/cleaner/withdrawals")
        .set("Authorization", `Bearer ${cleaner.token}`)
        .send({ amount: 100, pin: "1234" });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.status).toBe("pending");
      expect(res.body.bank_name).toBe("TestBank");
    });
  });
});
