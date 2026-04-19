import { describe, it, expect } from "vitest";
import request from "supertest";
import { app, createTestUser, signTestToken } from "../test/helpers";

describe("Address endpoints", () => {
  const validAddress = {
    street: "20 Prince Street, LONDON",
    floor_number: "3",
    door_number: "5",
    label: "home" as const,
  };

  describe("POST /v1/customer/addresses", () => {
    it("creates an address", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/v1/customer/addresses")
        .set("Authorization", `Bearer ${user.token}`)
        .send(validAddress);
      expect(res.status).toBe(201);
      expect(res.body.street).toBe(validAddress.street);
      expect(res.body.is_default).toBe(false);
    });

    it("rejects without auth", async () => {
      const res = await request(app).post("/v1/customer/addresses").send(validAddress);
      expect(res.status).toBe(401);
    });

    it("rejects cleaner role", async () => {
      const user = await createTestUser({ role: "cleaner" });
      const res = await request(app)
        .post("/v1/customer/addresses")
        .set("Authorization", `Bearer ${user.token}`)
        .send(validAddress);
      expect(res.status).toBe(403);
    });

    it("requires custom_label when label is custom", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/v1/customer/addresses")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ ...validAddress, label: "custom" });
      expect(res.status).toBe(400);
    });

    it("accepts custom label", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/v1/customer/addresses")
        .set("Authorization", `Bearer ${user.token}`)
        .send({ ...validAddress, label: "custom", custom_label: "Gym" });
      expect(res.status).toBe(201);
      expect(res.body.custom_label).toBe("Gym");
    });
  });

  describe("GET /v1/customer/addresses", () => {
    it("lists addresses for authenticated customer", async () => {
      const user = await createTestUser();
      await request(app).post("/v1/customer/addresses").set("Authorization", `Bearer ${user.token}`).send(validAddress);
      const res = await request(app).get("/v1/customer/addresses").set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("does not show other users' addresses", async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      await request(app).post("/v1/customer/addresses").set("Authorization", `Bearer ${user1.token}`).send(validAddress);
      const res = await request(app).get("/v1/customer/addresses").set("Authorization", `Bearer ${user2.token}`);
      expect(res.body.data.length).toBe(0);
    });
  });

  describe("GET /v1/customer/addresses/:id", () => {
    it("returns a single address by ID", async () => {
      const user = await createTestUser();
      const created = await request(app)
        .post("/v1/customer/addresses")
        .set("Authorization", `Bearer ${user.token}`)
        .send(validAddress);
      const res = await request(app)
        .get(`/v1/customer/addresses/${created.body.id}`)
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
      expect(res.body.street).toBe(validAddress.street);
    });

    it("returns 404 for non-existent address", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .get("/v1/customer/addresses/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(404);
    });

    it("rejects accessing another user's address", async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const created = await request(app)
        .post("/v1/customer/addresses")
        .set("Authorization", `Bearer ${user1.token}`)
        .send(validAddress);
      const res = await request(app)
        .get(`/v1/customer/addresses/${created.body.id}`)
        .set("Authorization", `Bearer ${user2.token}`);
      expect(res.status).toBe(404);
    });
  });

  describe("PUT /v1/customer/addresses/:id", () => {
    it("updates own address", async () => {
      const user = await createTestUser();
      const created = await request(app).post("/v1/customer/addresses").set("Authorization", `Bearer ${user.token}`).send(validAddress);
      const res = await request(app)
        .put(`/v1/customer/addresses/${created.body.id}`)
        .set("Authorization", `Bearer ${user.token}`)
        .send({ ...validAddress, street: "New Street" });
      expect(res.status).toBe(200);
      expect(res.body.street).toBe("New Street");
    });

    it("rejects updating another user's address", async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const created = await request(app).post("/v1/customer/addresses").set("Authorization", `Bearer ${user1.token}`).send(validAddress);
      const res = await request(app)
        .put(`/v1/customer/addresses/${created.body.id}`)
        .set("Authorization", `Bearer ${user2.token}`)
        .send({ ...validAddress, street: "Hack" });
      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /v1/customer/addresses/:id", () => {
    it("soft-deletes own address", async () => {
      const user = await createTestUser();
      const created = await request(app).post("/v1/customer/addresses").set("Authorization", `Bearer ${user.token}`).send(validAddress);
      const res = await request(app).delete(`/v1/customer/addresses/${created.body.id}`).set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(204);
      const list = await request(app).get("/v1/customer/addresses").set("Authorization", `Bearer ${user.token}`);
      expect(list.body.data.length).toBe(0);
    });

    it("returns 404 for non-existent address", async () => {
      const user = await createTestUser();
      const res = await request(app).delete("/v1/customer/addresses/00000000-0000-0000-0000-000000000000").set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(404);
    });
  });
});
