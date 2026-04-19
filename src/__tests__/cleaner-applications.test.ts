import { describe, it, expect } from "vitest";
import request from "supertest";
import { app, createTestUser } from "../test/helpers";

const validApplication = {
  first_name: "Jane",
  last_name: "Cleaner",
  country_code: "+44",
  phone_number: "7700000000",
  email: `cleaner-${Date.now()}@test.com`,
  gender: "female",
  postcode: "SW1A 1AA",
  years_of_experience: "3-5",
  experience_types: ["domestic"],
  experience_description: "Professional domestic cleaning",
  hours_per_week: 20,
  available_days: ["monday", "tuesday", "wednesday"],
  commitment_duration: "12_months",
  right_to_work_uk: true,
  has_uk_bank_account: true,
  understands_self_employed: true,
  no_criminal_record: true,
  accepts_terms: true,
};

describe("Cleaner Applications", () => {
  describe("POST /v1/cleaner-applications", () => {
    it("creates an application", async () => {
      const res = await request(app)
        .post("/v1/cleaner-applications")
        .send({ ...validApplication, email: `app-${Date.now()}@test.com` });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
    });
  });

  describe("GET /v1/cleaner-applications/:id", () => {
    it("returns application detail", async () => {
      const created = await request(app)
        .post("/v1/cleaner-applications")
        .send({ ...validApplication, email: `get-${Date.now()}@test.com` });
      const user = await createTestUser();
      const res = await request(app)
        .get(`/v1/cleaner-applications/${created.body.id}`)
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(200);
      expect(res.body.first_name).toBe("Jane");
    });

    it("rejects unauthenticated request", async () => {
      const res = await request(app).get("/v1/cleaner-applications/00000000-0000-0000-0000-000000000000");
      expect(res.status).toBe(401);
    });

    it("returns 404 for non-existent application", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .get("/v1/cleaner-applications/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${user.token}`);
      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /v1/cleaner-applications/:id", () => {
    it("rejects unauthenticated request", async () => {
      const res = await request(app)
        .patch("/v1/cleaner-applications/00000000-0000-0000-0000-000000000000")
        .send({ first_name: "Updated" });
      expect(res.status).toBe(401);
    });

    it("updates application details", async () => {
      const created = await request(app)
        .post("/v1/cleaner-applications")
        .send({ ...validApplication, email: `patch-${Date.now()}@test.com` });
      const user = await createTestUser();
      const res = await request(app)
        .patch(`/v1/cleaner-applications/${created.body.id}`)
        .set("Authorization", `Bearer ${user.token}`)
        .send({ first_name: "Updated", last_name: "Name" });
      expect(res.status).toBe(200);
    });
  });
});
