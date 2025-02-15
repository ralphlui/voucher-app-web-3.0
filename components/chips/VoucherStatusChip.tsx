import React from 'react';
import { VoucherStatusEnum } from '@/types/VoucherStatusEnum';
import { Chip } from 'react-native-paper';

interface StatusChipProps {
  status: VoucherStatusEnum;
}

const VoucherStatusChip = ({ status }: StatusChipProps) => {
  let backgroundColor: string;
  switch (status) {
    case VoucherStatusEnum.CLAIMED:
      backgroundColor = '#BBE1FA';
      break;
    case VoucherStatusEnum.EXPIRED:
      backgroundColor = '#FFD1D1';
      break;
    case VoucherStatusEnum.CONSUMED:
      backgroundColor = '#BDD2B6';
      break;
    default:
      backgroundColor = '#FFF8EA'; 
      break;
  }
  return <Chip style={{ backgroundColor, alignSelf: 'center', marginRight: 10 }}>{status}</Chip>;
};

export default VoucherStatusChip;
