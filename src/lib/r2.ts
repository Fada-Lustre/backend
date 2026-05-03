import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

const SIGNED_URL_EXPIRY = 3600; // 1 hour

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

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: key }),
    { expiresIn: SIGNED_URL_EXPIRY }
  );

  return { url, key };
}

/**
 * Generate a presigned URL for an existing R2 object key.
 * Returns null if key is null/empty or R2 credentials are not configured.
 */
export async function signUrl(key: string | null | undefined): Promise<string | null> {
  if (!key) return null;

  if (!env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    return `https://r2-stub.fadalustre.com/${key}`;
  }

  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: key }),
    { expiresIn: SIGNED_URL_EXPIRY }
  );
}

/**
 * Sign multiple keys in parallel. Convenience wrapper for batch use.
 */
export async function signUrls(keys: (string | null | undefined)[]): Promise<(string | null)[]> {
  return Promise.all(keys.map(signUrl));
}
