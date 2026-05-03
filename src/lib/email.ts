import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { env } from "../env";

const ses = new SESClient({
  region: env.AWS_REGION,
  credentials:
    env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
      ? { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY }
      : undefined,
});

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    console.warn(`[EMAIL STUB] To: ${to} | Subject: ${subject}`);
    return;
  }

  await ses.send(
    new SendEmailCommand({
      Source: env.SES_FROM_EMAIL,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: { Html: { Data: html, Charset: "UTF-8" } },
      },
    })
  );
}

export function adminInvitationHtml(firstName: string, email: string, tempPassword: string, activateUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1a1a1a;">Welcome to Fada Lustre</h2>
      <p>Hi ${firstName},</p>
      <p>You've been invited to join the Fada Lustre admin dashboard. Use the credentials below to activate your account:</p>
      <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 4px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>
      <p>
        <a href="${activateUrl}" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Activate Account
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">This invitation expires in 7 days. If you didn't expect this email, please ignore it.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 12px;">Fada Lustre — Professional Cleaning Marketplace, Derby, UK</p>
    </div>
  `;
}

export function passwordResetHtml(firstName: string, resetCode: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1a1a1a;">Password Reset</h2>
      <p>Hi ${firstName},</p>
      <p>You requested a password reset for your Fada Lustre admin account. Use the code below to reset your password:</p>
      <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="font-size: 32px; letter-spacing: 8px; font-weight: bold; margin: 0;">${resetCode}</p>
      </div>
      <p style="color: #666; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, please ignore it.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 12px;">Fada Lustre — Professional Cleaning Marketplace, Derby, UK</p>
    </div>
  `;
}
