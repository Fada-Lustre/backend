import type { EmailProvider } from "../interfaces/email.interface";

const sent: { to: string; subject: string; text?: string; html?: string }[] = [];

export const emailStub: EmailProvider = {
  async send(options) {
    sent.push(options);
    return { success: true, messageId: `stub-${Date.now()}` };
  },
};

export function getSentEmails() {
  return sent;
}

export function clearSentEmails() {
  sent.length = 0;
}
