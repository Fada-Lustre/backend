import { Router, Request, Response, NextFunction } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { requireJwtScopes } from "../lib/auth-middleware";
import { uploadFile } from "../lib/r2";
import * as contentRepo from "../repositories/content.repository";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

const router = Router();

router.patch(
  "/:id/cover",
  fileUpload({ limits: { fileSize: MAX_SIZE, files: 1 }, abortOnLimit: true }),
  requireJwtScopes("admin:services"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = req.params.id as string;
      const fileArray = req.files as unknown as fileUpload.FileArray | undefined;

      if (!fileArray?.image) {
        res.status(400).json({ code: "VALIDATION_ERROR", message: "Field 'image' is required" });
        return;
      }

      const file = fileArray.image as UploadedFile;
      if (!ALLOWED_MIMES.includes(file.mimetype)) {
        res.status(400).json({ code: "VALIDATION_ERROR", message: `Invalid file type: ${file.mimetype}. Allowed: jpeg, png, webp` });
        return;
      }

      const { url } = await uploadFile("blog/covers", file.data, file.mimetype, file.name);
      const updated = await contentRepo.updateBlogCoverImage(postId, url);

      if (!updated) {
        res.status(404).json({ code: "NOT_FOUND", message: "Blog post not found" });
        return;
      }

      res.json({ id: postId, cover_image_url: url });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
