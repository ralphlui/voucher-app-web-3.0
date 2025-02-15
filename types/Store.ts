import { SessionUserProps, User } from '@/types/User';

export type Store = {
  storeId?: string;
  storeName?: string;
  description?: string;
  address?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  image?: string;
  contactNumber?: string;
  createdBy?: User;
  createdDate?: string;
  updatedBy?: User;
  updatedDate?: string;
};

export type StoreCard = {
  store: Store;
};

export type UpdateStoreCard = {
  store: Store;
  currentSessionUser: SessionUserProps;
};

export type CountryProps = {
  id: string;
  value: string;
};
export interface CountryFilter {
  setFilter: (setFilter: CountryProps) => void;
  defaultValue: string;
}

export type StoreTableCard = {
  stores: Store[];
  pageNumber: number;
  totalRecord: number;
  size: number;
};
