import { RootState } from '@/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const userApi = createApi({
  reducerPath: 'user',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_AUTH_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const auth = getState() as RootState;
      const userId = auth.auth.userId;
      if (userId) {
        headers.set('X-User-Id', userId);
      } else {
        headers.set('X-User-Id', 'anonymous');
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({}),
});

export default userApi;
