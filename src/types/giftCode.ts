export interface GiftCode {
  id: number;
  code: string;
  status: 'unredeemed' | 'redeemed' | 'expired';
  expiry?: string;
  userId?: number;
}