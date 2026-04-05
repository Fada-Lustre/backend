import express, { Request, Response } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import db from "../db";
import { validate } from "../middleware/validate";
import { CleanerApplicationSchema } from "../schemas/cleaner-application";
import { uploadImage } from "../cloudinary";

const cleanerRouter = express.Router();

cleanerRouter.post(
  "/",
  fileUpload({ useTempFiles: true, tempFileDir: "/tmp/", limits: { fileSize: 5 * 1024 * 1024 } }),
  validate(CleanerApplicationSchema),
  async (req: Request, res: Response) => {
    try {
      const data = req.body;

      let photoUrl: string | null = null;
      let photoPublicId: string | null = null;

      if (req.files?.photo) {
        const file = (Array.isArray(req.files.photo) ? req.files.photo[0] : req.files.photo) as UploadedFile;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.mimetype)) {
          res.status(400).json({
            error: { code: "INVALID_FILE_TYPE", message: "Photo must be JPEG, PNG, or WebP" },
          });
          return;
        }

        const uploaded = await uploadImage(file, "fada-lustre/cleaners");
        photoUrl = uploaded.url;
        photoPublicId = uploaded.public_id;
      }

      const rows = await db.query(
        `INSERT INTO cleaner_applications (
          first_name, last_name, country_code, phone_number, email,
          gender, postcode, years_of_experience, experience_types,
          experience_description, hours_per_week, available_days,
          commitment_duration, photo_url, photo_public_id, status
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12,
          $13, $14, $15, 'submitted'
        ) RETURNING id, status, created_at`,
        [
          data.first_name,
          data.last_name,
          data.country_code,
          data.phone_number,
          data.email,
          data.gender,
          data.postcode,
          data.years_of_experience,
          JSON.stringify(data.experience_types),
          data.experience_description,
          data.hours_per_week,
          JSON.stringify(data.available_days),
          data.commitment_duration,
          photoUrl,
          photoPublicId,
        ]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      console.error("Error creating cleaner application:", err);
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to submit application" } });
    }
  }
);

export default cleanerRouter;
