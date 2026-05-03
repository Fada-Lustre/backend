import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../env";
import crypto from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials:
    env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY
      ? { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY }
      : undefined,
});

export interface UploadResult {
  url: string;
  key: string;
}

export async function uploadFile(
  folder: string,
  buffer: Buffer,
  contentType: string,
  originalName: string
): Promise<UploadResult> {
  const ext = originalName.split(".").pop() || "bin";
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  if (!env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    console.warn(`[R2 STUB] Would upload: ${key}`);
    return { url: `https://r2-stub.fadalustre.com/${key}`, key };
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const url = env.R2_PUBLIC_URL
    ? `${env.R2_PUBLIC_URL}/${env.R2_BUCKET_NAME}/${key}`
    : `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET_NAME}/${key}`;

  return { url, key };
}
