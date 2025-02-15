import React from 'react';
import { CampaignStatusEnum } from '@/types/CampaignStatusEnum';
import { Chip } from 'react-native-paper';

interface CampaignStatusChipProps {
  status: CampaignStatusEnum;
}

const CampaignStatusChip = ({ status }: CampaignStatusChipProps) => {
  let backgroundColor: string;
  switch (status) {
    case CampaignStatusEnum.CREATED:
      backgroundColor = '#BBE1FA';
      break;
    case CampaignStatusEnum.EXPIRED:
      backgroundColor = '#FFD1D1';
      break;
    case CampaignStatusEnum.CANCELLED:
      backgroundColor = '#FF9494';
      break;
    case CampaignStatusEnum.READYTOPROMOTE:
      backgroundColor = '#F9ED69'; 
      break;
    case CampaignStatusEnum.PROMOTED:
        backgroundColor = '#BDD2B6';
        break;
    default:
      backgroundColor = '#FFF8EA'; 
      break;
  }
  return <Chip style={{ backgroundColor, alignSelf: 'center', marginRight: 10 }}>{status}</Chip>;
};

export default CampaignStatusChip;
