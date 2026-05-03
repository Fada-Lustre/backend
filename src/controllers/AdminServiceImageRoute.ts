import { Router, Request, Response, NextFunction } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { ApplicationError } from "../errors";
import { requireJwtScopes } from "../lib/auth-middleware";
import * as adminServiceService from "../services/admin-service.service";
import { uploadFile } from "../lib/r2";

const router = Router();

router.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024 }, abortOnLimit: true }));

router.post("/", requireJwtScopes("admin:services"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.body.name as string;
    const description = (req.body.description as string) || "";

    if (!name) {
      throw new ApplicationError(400, "Name is required", "VALIDATION_ERROR");
    }

    let imageUrl: string | null = null;
    let iconUrl: string | null = null;
    const fileArray = req.files as unknown as fileUpload.FileArray | undefined;
    if (fileArray?.image) {
      const file = fileArray.image as UploadedFile;
      const upload = await uploadFile("services", file.data, file.mimetype, file.name);
      imageUrl = upload.key;
    }
    if (fileArray?.icon) {
      const file = fileArray.icon as UploadedFile;
      const iconUpload = await uploadFile("services/icons", file.data, file.mimetype, file.name);
      iconUrl = iconUpload.key;
    }

    const result = await adminServiceService.createService(req.user!.id, name, description, imageUrl, iconUrl);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", requireJwtScopes("admin:services"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceId = req.params.id as string;
    const updates: { name?: string; description?: string; imageUrl?: string; iconUrl?: string } = {};

    if (req.body.name) updates.name = req.body.name;
    if (req.body.description) updates.description = req.body.description;

    const fileArray = req.files as unknown as fileUpload.FileArray | undefined;
    if (fileArray?.image) {
      const file = fileArray.image as UploadedFile;
      updates.imageUrl = (await uploadFile("services", file.data, file.mimetype, file.name)).key;
    }
    if (fileArray?.icon) {
      const file = fileArray.icon as UploadedFile;
      updates.iconUrl = (await uploadFile("services/icons", file.data, file.mimetype, file.name)).key;
    }

    const result = await adminServiceService.updateService(req.user!.id, serviceId, updates);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
