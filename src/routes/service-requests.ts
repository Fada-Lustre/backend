import express, { Request, Response } from "express";
import db from "../db";
import { validate } from "../middleware/validate";
import { ServiceRequestSchema } from "../schemas/service-request";

const serviceRequestsRouter = express.Router();

serviceRequestsRouter.post(
  "/",
  validate(ServiceRequestSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, name, description } = req.body;

      const rows = await db.query(
        `INSERT INTO service_requests (email, name, description)
         VALUES ($1, $2, $3)
         RETURNING id, created_at`,
        [email, name, description]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      console.error("Error creating service request:", err);
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to submit request" } });
    }
  }
);

export default serviceRequestsRouter;
