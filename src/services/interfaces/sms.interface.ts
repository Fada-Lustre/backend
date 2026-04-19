export interface SmsProvider {
  send(to: string, message: string): Promise<{ success: boolean; messageId?: string }>;
}
