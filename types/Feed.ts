import { Campaign } from '@/types/Campaign';

export type Feed = {
  feedId: string;
  // campaign?: Campaign;
  // read?: boolean;
  campaignId?: string;
  campaignDescription?: string;
  storeId?: string;
  storeName?: string;
  isDeleted?: string;
  isRead?: string;
  readTime?: string;
  userId?: string;
  userName?: string;
  email?: string;
  createdDate?: string;
  updatedDate?: string;
  category?: string;
};

export type FeedTableCard = {
  feeds: Feed[];
  pageNumber: number;
  totalRecord: number;
  size: number;
};

// isRead?: boolean;
// isDeleted?: boolean;
// readTime?: string;
// targetUserEmail?: string;
// targetUserName?: string;
