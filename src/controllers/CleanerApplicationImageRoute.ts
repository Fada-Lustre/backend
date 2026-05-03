import { Router, Request, Response, NextFunction } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { uploadFile } from "../lib/r2";
import * as leadsRepo from "../repositories/leads.repository";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

const router = Router();

router.post(
  "/:id/photo",
  fileUpload({ limits: { fileSize: MAX_SIZE, files: 1 }, abortOnLimit: true }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appId = req.params.id as string;

      const existing = await leadsRepo.findCleanerApplicationStatus(appId);
      if (!existing) {
        res.status(404).json({ code: "NOT_FOUND", message: "Application not found" });
        return;
      }

      const fileArray = req.files as unknown as fileUpload.FileArray | undefined;
      if (!fileArray?.photo) {
        res.status(400).json({ code: "VALIDATION_ERROR", message: "Field 'photo' is required" });
        return;
      }

      const file = fileArray.photo as UploadedFile;
      if (!ALLOWED_MIMES.includes(file.mimetype)) {
        res.status(400).json({ code: "VALIDATION_ERROR", message: `Invalid file type: ${file.mimetype}. Allowed: jpeg, png, webp` });
        return;
      }

      const { url, key } = await uploadFile("applications", file.data, file.mimetype, file.name);
      await leadsRepo.updateApplicationPhoto(appId, key, key);

      res.json({ id: appId, photo_url: url });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
