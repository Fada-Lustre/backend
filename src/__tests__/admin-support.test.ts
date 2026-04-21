import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, createTestAdmin, createTestUser } from "../test/helpers";
import { truncateAll } from "../test/setup";
import db from "../db";

describe("Admin Support", () => {
  beforeEach(async () => { await truncateAll(); });

  async function seedTicket() {
    const customer = await createTestUser();
    const rows = await db.query(
      `INSERT INTO support_tickets (user_id, title, message)
       VALUES ($1, 'Test Ticket', 'I need help')
       RETURNING id`,
      [customer.id]
    ) as { id: string }[];
    return { ticketId: rows[0]!.id, customer };
  }

  describe("GET /v1/admin/support/tickets", () => {
    it("returns 200 with ticket list", async () => {
      const admin = await createTestAdmin();
      await seedTicket();

      const res = await request(app)
        .get("/v1/admin/support/tickets")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body).toHaveProperty("stats");
    });

    it("supports status filter", async () => {
      const admin = await createTestAdmin();
      await seedTicket();

      const res = await request(app)
        .get("/v1/admin/support/tickets?status=open")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /v1/admin/support/tickets/:id", () => {
    it("returns ticket detail with messages", async () => {
      const admin = await createTestAdmin();
      const { ticketId } = await seedTicket();

      const res = await request(app)
        .get(`/v1/admin/support/tickets/${ticketId}`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
      expect(res.body).toHaveProperty("messages");
    });

    it("returns 404 for unknown ticket", async () => {
      const admin = await createTestAdmin();

      const res = await request(app)
        .get("/v1/admin/support/tickets/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /v1/admin/support/tickets/:id/messages", () => {
    it("adds an admin reply", async () => {
      const admin = await createTestAdmin();
      const { ticketId } = await seedTicket();

      const res = await request(app)
        .post(`/v1/admin/support/tickets/${ticketId}/messages`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ body: "We are looking into this." });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("body");
    });

    it("returns 400 for empty body", async () => {
      const admin = await createTestAdmin();
      const { ticketId } = await seedTicket();

      const res = await request(app)
        .post(`/v1/admin/support/tickets/${ticketId}/messages`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ body: "" });

      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /v1/admin/support/tickets/:id", () => {
    it("updates ticket status", async () => {
      const admin = await createTestAdmin();
      const { ticketId } = await seedTicket();

      const res = await request(app)
        .patch(`/v1/admin/support/tickets/${ticketId}`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ status: "in_progress" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("in_progress");
    });

    it("assigns ticket to admin", async () => {
      const admin = await createTestAdmin();
      const { ticketId } = await seedTicket();

      const res = await request(app)
        .patch(`/v1/admin/support/tickets/${ticketId}`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ assigned_to: admin.id });

      expect(res.status).toBe(200);
      expect(res.body.assigned_to).toHaveProperty("id");
    });
  });
});
