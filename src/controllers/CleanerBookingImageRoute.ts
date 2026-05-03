import { Router, Request, Response, NextFunction } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { requireJwtScopes } from "../lib/auth-middleware";
import { ApplicationError } from "../errors";
import * as bookingRepo from "../repositories/booking.repository";
import { uploadFile } from "../lib/r2";

const router = Router();

router.post(
  "/:id/images",
  fileUpload({ limits: { fileSize: 10 * 1024 * 1024, files: 20 } }),
  requireJwtScopes("cleaner"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingId = req.params.id as string;
      const cleanerId = req.user!.id;

      const booking = await bookingRepo.findByIdBasic(bookingId);

      if (!booking) {
        res.status(404).json({ code: "NOT_FOUND", message: "Booking not found" });
        return;
      }
      if (booking.cleaner_id !== cleanerId) {
        res.status(403).json({ code: "FORBIDDEN", message: "Not assigned to this booking" });
        return;
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({ code: "VALIDATION_ERROR", message: "No files uploaded" });
        return;
      }

      const fileArray = req.files as unknown as fileUpload.FileArray;
      const files = Array.isArray(fileArray.images) ? fileArray.images : [fileArray.images as UploadedFile];
      const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
      for (const file of files) {
        if (!allowedMimes.includes(file.mimetype)) {
          res.status(400).json({ code: "VALIDATION_ERROR", message: `Invalid file type: ${file.mimetype}` });
          return;
        }
      }

      const uploaded: { id: string; url: string }[] = [];
      for (const file of files) {
        const url = await uploadFile(`bookings/${bookingId}`, file.data, file.mimetype, file.name);
        const result = await bookingRepo.insertImage(bookingId, cleanerId, url);
        uploaded.push(result);
      }

      res.status(201).json({ images: uploaded });
    } catch (err) {
      if (err instanceof ApplicationError) {
        res.status(err.statusCode).json({ code: err.code, message: err.message });
      } else {
        next(err);
      }
    }
  }
);

export default router;
