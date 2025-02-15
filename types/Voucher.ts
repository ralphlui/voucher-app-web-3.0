import { Campaign } from '@/types/Campaign';
import { SessionUserProps } from '@/types/User';
import { VoucherStatusEnum } from '@/types/VoucherStatusEnum';

export interface Voucher {
  voucherId: string;
  campaign?: Campaign;
  voucherStatus: VoucherStatusEnum;
  amount?: GLfloat;
  claimTime?: string;
  consumedTime?: string;
}

export interface VoucherListParamsProps {
  vouchers: Voucher[];
  currentSessionUser: SessionUserProps;
  pageNumber: number;
  totalRecord: number;
  size: number;
}
