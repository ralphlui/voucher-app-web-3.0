import coreApi from '@/services/core.api';

export const voucherApiSlice = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getVouchersByUserId: builder.query({
      query: ({ userId, status, page_size = 10, page_number = 0 }) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/core/vouchers/users/${userId}?status=${status}&page=${page_number}&size=${page_size}`,
        method: 'GET',
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
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/core/vouchers/campaigns/${campaignId}?page=${page_number}&size=${page_size}`,
        method: 'GET',
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
    getVoucherById: builder.query({
      query: (id: string) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/core/vouchers/${id}`,
        method: 'GET',
      }),
    }),
    claimVoucher: builder.mutation({
      query: ({ campaignId, claimedBy }) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        url: '/api/core/vouchers/claim',
        method: 'POST',
        body: JSON.stringify({ campaignId, claimedBy }),
      }),
    }),
    consumeVoucher: builder.mutation({
      query: ({ voucherId }) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/core/vouchers/${voucherId}/consume`,
        method: 'PATCH',
        body: JSON.stringify({ voucherId }),
      }),
    }),
  }),
});

export const {
  useGetVouchersByUserIdQuery,
  useGetVoucherByIdQuery,
  useGetVouchersByCampaignIdQuery,
  useClaimVoucherMutation,
  useConsumeVoucherMutation,
} = voucherApiSlice;
