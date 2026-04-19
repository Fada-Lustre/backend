import type { SmsProvider } from "../interfaces/sms.interface";

const sent: { to: string; message: string }[] = [];

export const smsStub: SmsProvider = {
  async send(to, message) {
    sent.push({ to, message });
    return { success: true, messageId: `stub-${Date.now()}` };
  },
};

export function getSentMessages() {
  return sent;
}

export function clearSentMessages() {
  sent.length = 0;
}
