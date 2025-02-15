import coreApi from '@/services/core.api';
import { Campaign } from '@/types/Campaign';

export const campaignApiSlice = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: ({ description, page_size = 10, page_number = 0 }) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/core/campaigns?description=${description}&page=${page_number}&size=${page_size}`,
        method: 'GET',
      }),
      providesTags: ['Campaign'],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page_number === 0 || arg.description !== currentCache.description) {
          currentCache.data = newItems.data;
          currentCache.description = arg.description;
        } else {
          currentCache.data.push(...newItems.data);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getCampaignsByUserId: builder.query({
      query: ({ description, userId, page_size = 10, page_number = 0 }) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/core/campaigns/users/${userId}?description=${description}&page=${page_number}&size=${page_size}`,
        method: 'GET',
      }),
      providesTags: (result, error, { userId }) => [{ type: 'Campaign', id: `USER_${userId}` }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page_number === 0 || arg.description !== currentCache.description) {
          currentCache.data = newItems.data;
          currentCache.description = arg.description;
        } else {
          currentCache.data.push(...newItems.data);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getCampaignsByStoreId: builder.query({
      query: ({ storeId, status, description, page_size = 10, page_number = 0 }) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/core/campaigns/stores/${storeId}?status=${status}&page=${page_number}&size=${page_size}`,
        method: 'GET',
      }),
      providesTags: ['Campaign'],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page_number === 0) {
          currentCache.data = newItems.data;
        } else {
          currentCache.data.push(...newItems.data);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getCampaignById: builder.query({
      query: ({ id }) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/core/campaigns/${id}`,
        method: 'GET',
      }),
    }),
    createCampaign: builder.mutation({
      query: (campaign: Campaign) => ({
        url: `/api/core/campaigns`,
        method: 'POST',
        body: campaign,
      }),
      invalidatesTags: (result, error, { createdBy }) => [
        { type: 'Campaign', id: `USER_${createdBy}` },
      ],
    }),
    updateCampaign: builder.mutation({
      query: (campaign: Campaign) => ({
        url: `/api/core/campaigns/${campaign.campaignId}`,
        method: 'PUT',
        body: campaign,
      }),
      invalidatesTags: (result, error, { createdBy }) => [
        { type: 'Campaign', id: `USER_${createdBy}` },
      ],
    }),
    promoteCampaign: builder.mutation({
      query: ({ userId, campaignId }) => ({
        url: `/api/core/campaigns/${campaignId}/users/${userId}/promote`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useGetCampaignsByUserIdQuery,
  useGetCampaignByIdQuery,
  useGetCampaignsQuery,
  useGetCampaignsByStoreIdQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  usePromoteCampaignMutation,
} = campaignApiSlice;
