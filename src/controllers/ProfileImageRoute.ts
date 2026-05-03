import { Router, Request, Response, NextFunction } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { requireJwtScopes } from "../lib/auth-middleware";
import { uploadFile } from "../lib/r2";
import * as userRepo from "../repositories/user.repository";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;

function createProfileImageRouter(scope: string): Router {
  const router = Router();

  router.post(
    "/image",
    fileUpload({ limits: { fileSize: MAX_SIZE, files: 1 }, abortOnLimit: true }),
    requireJwtScopes(scope),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const userId = req.user!.id;
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

        const { url, key } = await uploadFile(`profiles/${userId}`, file.data, file.mimetype, file.name);
        await userRepo.updateProfileImage(userId, url, key);

        res.json({ profile_image_url: url });
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}

export const customerProfileImageRouter = createProfileImageRouter("customer");
export const cleanerProfileImageRouter = createProfileImageRouter("cleaner");
export const adminProfileImageRouter = createProfileImageRouter("admin:home");
