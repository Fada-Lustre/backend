import { v2 as cloudinary } from "cloudinary";
import { UploadedFile } from "express-fileupload";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(
  file: UploadedFile,
  folder: string = "fada-lustre"
): Promise<{ url: string; public_id: string }> {
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder,
    public_id: file.name.split(".")[0],
  });

  return { url: result.secure_url, public_id: result.public_id };
}
