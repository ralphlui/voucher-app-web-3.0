import { RootState } from '@/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { refreshTokenBeforeExpire } from './tokenRefresh';

const userApi = createApi({
  reducerPath: 'user',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_AUTH_API_URL,
    prepareHeaders: async (headers) => {
      await refreshTokenBeforeExpire();
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({}),
});

export default userApi;
