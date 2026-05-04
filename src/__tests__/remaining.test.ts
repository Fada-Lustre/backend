import { describe, it, expect } from "vitest";
import request from "supertest";
import { app, createTestUser, createTestAdmin } from "../test/helpers";
import db from "../db";

describe("Profile endpoints", () => {
  describe("GET /v1/customer/profile", () => {
    it("returns profile for authenticated customer", async () => {
      const user = await createTestUser({ firstName: "Alice" });
      const res = await request(app).get("/v1/customer/profile").set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body.first_name).toBe("Alice");
      expect(res.body.email).toBe(user.email);
    });

    it("rejects unauthenticated request", async () => {
      const res = await request(app).get("/v1/customer/profile");
      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /v1/customer/profile", () => {
    it("updates first_name", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .patch("/v1/customer/profile")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ first_name: "Updated" });
      expect(res.status).toBe(200);
      expect(res.body.first_name).toBe("Updated");
    });
  });
});

describe("Payment Method endpoints", () => {
  describe("GET /v1/customer/payment-methods", () => {
    it("returns empty list for new user", async () => {
      const user = await createTestUser();
      const res = await request(app).get("/v1/customer/payment-methods").set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  describe("POST /v1/customer/payment-methods", () => {
    it("creates a card payment method", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/v1/customer/payment-methods")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ type: "card", card_name: "John Doe", card_token: "tok_visa_4242424242424242" });
      expect(res.status).toBe(201);
      expect(res.body.type).toBe("card");
      expect(res.body.last4).toBe("4242");
    });
  });

  describe("DELETE /v1/customer/payment-methods/:id", () => {
    it("soft-deletes own payment method", async () => {
      const user = await createTestUser();
      const created = await request(app)
        .post("/v1/customer/payment-methods")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ type: "card", card_name: "John Doe", card_token: "tok_visa_4242424242424242" });
      const res = await request(app)
        .delete(`/v1/customer/payment-methods/${created.body.id}`)
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(204);
    });

    it("rejects deleting another user's payment method", async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const created = await request(app)
        .post("/v1/customer/payment-methods")
        .set("Authorization", `Bearer ${user1.token}`)
        .send({ type: "card", card_name: "John", card_token: "tok_visa_1111222233334444" });
      const res = await request(app)
        .delete(`/v1/customer/payment-methods/${created.body.id}`)
        .set("Authorization", `Bearer ${user2.token}`);
      expect(res.status).toBe(403);
    });
  });
});

describe("Notification endpoints", () => {
  describe("GET /v1/notifications", () => {
    it("returns empty list for new user", async () => {
      const user = await createTestUser();
      const res = await request(app).get("/v1/notifications").set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });

  describe("PATCH /v1/notifications/:id/read", () => {
    it("returns 404 for non-existent notification", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .patch("/v1/notifications/00000000-0000-0000-0000-000000000000/read")
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(404);
    });
  });
});

describe("Support endpoints", () => {
  describe("POST /v1/support/tickets", () => {
    it("creates a support ticket", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/v1/support/tickets")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ title: "Help needed", message: "I need assistance with my booking." });
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("open");
    });

    it("rejects unauthenticated request", async () => {
      const res = await request(app).post("/v1/support/tickets").send({ title: "Help", message: "Test" });
      expect(res.status).toBe(401);
    });
  });

  describe("GET /v1/support/tickets", () => {
    it("lists tickets for authenticated user", async () => {
      const user = await createTestUser();
      await request(app)
        .post("/v1/support/tickets")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ title: "Issue 1", message: "Details" });
      const res = await request(app).get("/v1/support/tickets").set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /v1/support/tickets/:id", () => {
    it("returns ticket detail with messages", async () => {
      const user = await createTestUser();
      const created = await request(app)
        .post("/v1/support/tickets")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ title: "Ticket Detail", message: "Details here" });
      const res = await request(app)
        .get(`/v1/support/tickets/${created.body.id}`)
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Ticket Detail");
    });

    it("rejects accessing another user's ticket", async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const created = await request(app)
        .post("/v1/support/tickets")
        .set("Authorization", `Bearer ${user1.token}`)
        .send({ title: "Private", message: "My issue" });
      const res = await request(app)
        .get(`/v1/support/tickets/${created.body.id}`)
        .set("Authorization", `Bearer ${user2.token}`);
      expect(res.status).toBe(403);
    });
  });
});

describe("Admin Profile", () => {
  describe("PATCH /v1/admin/profile", () => {
    it("updates admin profile with email", async () => {
      const admin = await createTestAdmin();
      const newEmail = `updated-${Date.now()}@example.com`;
      const res = await request(app)
        .patch("/v1/admin/profile")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ email: newEmail });
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(newEmail);
    });
  });
});

describe("Customer Phone Update", () => {
  describe("PATCH /v1/customer/profile/phone", () => {
    it("requests phone update", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .patch("/v1/customer/profile/phone")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ phone: "+447000000099", verification_method: "sms" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
    });
  });
});

describe("Notification Read", () => {
  describe("PATCH /v1/notifications/:id/read", () => {
    it("marks a notification as read", async () => {
      const user = await createTestUser();
      const rows = await db.query(
        `INSERT INTO notifications (user_id, title, body, type) VALUES ($1, 'Test', 'Body', 'info') RETURNING id`,
        [user.id]
      ) as { id: string }[];
      const notifId = rows[0]!.id;
      const res = await request(app)
        .patch(`/v1/notifications/${notifId}/read`)
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(204);
    });

    it("returns 404 for non-existent notification", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .patch("/v1/notifications/00000000-0000-0000-0000-000000000000/read")
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(404);
    });
  });
});
