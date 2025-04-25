import coreApi from '@/services/core.api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const voucherApiSlice = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getVouchersByUserId: builder.query({
      query: ({ userId, status, page_size = 10, page_number = 0 }) => ({
        url: `/api/core/vouchers/users`,
        method: 'POST',
        body: JSON.stringify({claimedBy: userId}),
        params: {status, page_size, page_number},
      }),
      providesTags: ['Voucher'],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page_number === 0 || arg.status !== currentCache.status) {
          currentCache.data = newItems.data;
        } else {
          currentCache.data.push(...newItems.data);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getVouchersByCampaignId: builder.query({
      query: ({ campaignId, page_size = 10, page_number = 0 }) => ({
        url: `/api/core/vouchers/campaigns`,
        method: 'POST',
        body: JSON.stringify({campaignId}),
        params: {page_size, page_number},
      }),
      providesTags: ['Voucher'],
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
    getVoucherById: builder.mutation({
      query: ({voucherId}) => ({
        url: `/api/core/vouchers`,
        method: 'POST',
        body: JSON.stringify({voucherId}),
      }),
    }),
    claimVoucher: builder.mutation({
      query: ({ campaignId, claimedBy }) => ({
        url: '/api/core/vouchers/claim',
        method: 'POST',
        body: JSON.stringify({ campaignId, claimedBy }),
      }),
    }),
    consumeVoucher: builder.mutation({
      query: ({ voucherId }) => ({
        url: `/api/core/vouchers/consume`,
        method: 'PATCH',
        body: JSON.stringify({ voucherId }),
      }),
    }),
  }),
});

export const {
  useGetVouchersByUserIdQuery,
  useGetVoucherByIdMutation,
  useGetVouchersByCampaignIdQuery,
  useClaimVoucherMutation,
  useConsumeVoucherMutation,
} = voucherApiSlice;
