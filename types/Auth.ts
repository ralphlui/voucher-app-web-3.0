import { UserTypeEnum } from '@/types/UserTypeEnum';

export interface Auth {
  user?: string | null;
  userId?: string | null;
  token?: string | null;
  success?: boolean;
  error?: string | null;
  role?: UserTypeEnum | null;
  email?: string | null;
  authProvider?: string | null;
  message?: {
    campaignId?: string;
    storeName?: string;
    campaignDescription?: string;
  } | null;
  expiryTime?: number | null;
}
