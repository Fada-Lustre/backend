export interface EmailProvider {
  send(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }): Promise<{ success: boolean; messageId?: string }>;
}
