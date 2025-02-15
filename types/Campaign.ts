import { Store } from '@/types/Store';
import { SessionUserProps, User } from '@/types/User';
import { CampaignStatusEnum } from '@/types/CampaignStatusEnum';

export interface Campaign {
  campaignId?: string;
  description?: string;
  numberOfVouchers?: number;
  numberOfLikes?: number;
  tagsJson?: string;
  tandc?: string;
  category?: string;
  amount?: GLfloat;
  startDate?: Date;
  endDate?: Date;
  store?: Store;
  campaignStatus?: CampaignStatusEnum;
  numberOfClaimedVouchers?: number;
  pin?: string;
  createdBy?: string;
}

export interface CreateCampaignParamsProps {
  stores: Store[];
  currentSessionUser: SessionUserProps;
}

export interface CampaignListParamsProps {
  campaigns: Campaign[];
  currentSessionUser: SessionUserProps;
  pageNumber: number;
  totalRecord: number;
  size: number;
  redirectPath: string;
}

export interface MerchantUpdateCampaign {
  campaign: Campaign;
  stores: Store[];
  currentSessionUser: SessionUserProps;
}

export interface CampaignListByStoreParamsProps {
  campaignsByStore: Campaign[];
  currentSessionUser: SessionUserProps;
  storeName: string;
}

export interface CampaignDetailProps {
  campaign: Campaign;
  currentSessionUser: SessionUserProps;
}

export interface CampaignDetailPropsByFeed {
  campaignDetail: Campaign;
  feedStatus: string;
  userEmail: string;
}
