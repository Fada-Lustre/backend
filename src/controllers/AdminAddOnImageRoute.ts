import { Router, Request, Response, NextFunction } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { ApplicationError } from "../errors";
import { requireJwtScopes } from "../lib/auth-middleware";
import { uploadFile } from "../lib/r2";
import { isUuid } from "../lib/validation";
import * as adminAddOnService from "../services/admin-addon.service";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];

const router = Router();

router.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024, files: 1 }, abortOnLimit: true }));

router.post("/:id/image", requireJwtScopes("admin:services"), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!isUuid(id)) {
      throw new ApplicationError(400, "Invalid add-on ID format", "VALIDATION_ERROR");
    }

    const existing = await adminAddOnService.findAddOn(id);
    if (!existing) {
      throw new ApplicationError(404, "Add-on not found", "NOT_FOUND");
    }

    const fileArray = req.files as unknown as fileUpload.FileArray | undefined;
    if (!fileArray?.image) {
      throw new ApplicationError(400, "Field 'image' is required", "VALIDATION_ERROR");
    }

    const file = fileArray.image as UploadedFile;
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new ApplicationError(400, `Invalid file type: ${file.mimetype}. Allowed: jpeg, png, webp`, "VALIDATION_ERROR");
    }

    const { key } = await uploadFile("add-ons", file.data, file.mimetype, file.name);
    const result = await adminAddOnService.setAddOnImage(req.user!.id, id, key);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
