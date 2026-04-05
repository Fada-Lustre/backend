import express, { Request, Response } from "express";
import db from "../db";
import { validate } from "../middleware/validate";
import { ContactMessageSchema } from "../schemas/contact";

const contactRouter = express.Router();

contactRouter.post(
  "/",
  validate(ContactMessageSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, message, source } = req.body;

      const rows = await db.query(
        `INSERT INTO contact_messages (email, message, source)
         VALUES ($1, $2, $3)
         RETURNING id, created_at`,
        [email, message, source || null]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      console.error("Error creating contact message:", err);
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to send message" } });
    }
  }
);

export default contactRouter;
