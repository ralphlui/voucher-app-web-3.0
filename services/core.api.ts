import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store';

const coreApi = createApi({
  reducerPath: 'core',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_CORE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const auth = getState() as RootState;
      const userId = auth.auth.userId;
      if (userId) {
        headers.set('X-User-Id', userId);
      } else {
        headers.set('X-User-Id', 'anonymous');
      }
      return headers;
    },
  }),
  tagTypes: ['Campaign', 'Store', 'Voucher'],
  endpoints: (builder) => ({}),
});

export default coreApi;
