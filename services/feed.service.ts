import feedApi from '@/services/feed.api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const feedApiSlice = feedApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeedByUserId: builder.query({
      query: ({ userId, page_size = 5, page_number = 0 }) => ({
        url: `/api/feeds/users`,
        method: 'POST',
        body: { userId },
        params: { page_size, page_number },
      }),
      providesTags: ['Feed'],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page_number === 0) {
          currentCache.data = newItems.data; // Overwrite cache for fresh data
        } else {
          currentCache.data.push(...newItems.data); // Append new data for pagination
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getFeedById: builder.mutation({
      query: ({body}) => ({
        url: `/api/feeds/id`,
        method: 'POST',
        body,
      }),
    }),
    updateReadStatus: builder.mutation({
      query: ({feedId}) => ({
        url: `/api/feeds/readStatus`,
        method: 'PATCH',
        body: {feedId}
      }),
    }),
  }),
});

export const { useGetFeedByUserIdQuery, useGetFeedByIdMutation, useUpdateReadStatusMutation } = feedApiSlice;
