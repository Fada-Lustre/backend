import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../test/helpers";

describe("Public Content endpoints", () => {
  describe("GET /v1/services", () => {
    it("returns 200 with services array", async () => {
      const res = await request(app).get("/v1/services");
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe("GET /v1/services/:slug", () => {
    it("returns 404 for non-existent slug", async () => {
      const res = await request(app).get("/v1/services/non-existent-slug");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /v1/blog/categories", () => {
    it("returns 200 with categories", async () => {
      const res = await request(app).get("/v1/blog/categories");
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe("GET /v1/blog/posts", () => {
    it("returns 200 with posts array", async () => {
      const res = await request(app).get("/v1/blog/posts");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });
  });

  describe("GET /v1/blog/posts/:slug", () => {
    it("returns 404 for non-existent slug", async () => {
      const res = await request(app).get("/v1/blog/posts/non-existent-post");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /v1/faqs", () => {
    it("returns 200 with faqs array", async () => {
      const res = await request(app).get("/v1/faqs");
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe("GET /v1/cost-guides", () => {
    it("returns 200 with cost guides", async () => {
      const res = await request(app).get("/v1/cost-guides");
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe("GET /v1/cost-guides/:slug", () => {
    it("returns 404 for non-existent slug", async () => {
      const res = await request(app).get("/v1/cost-guides/non-existent-guide");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /v1/locations", () => {
    it("returns 200 with locations array", async () => {
      const res = await request(app).get("/v1/locations");
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe("GET /v1/pricing", () => {
    it("returns 200 with pricing data", async () => {
      const res = await request(app).get("/v1/pricing");
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });
  });
});

describe("Public POST endpoints", () => {
  describe("POST /v1/contact-messages", () => {
    it("creates a contact message", async () => {
      const res = await request(app)
        .post("/v1/contact-messages")
        .send({ name: "Test User", email: "test@example.com", message: "Hello, I have a question." });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
    });
  });

  describe("POST /v1/service-requests", () => {
    it("creates a service request", async () => {
      const res = await request(app)
        .post("/v1/service-requests")
        .send({
          name: "Test User", email: "test@example.com", phone: "07123456789",
          service_type: "domestic", service_description: "Weekly cleaning needed",
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
    });
  });
});
