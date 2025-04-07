import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { refreshTokenBeforeExpire } from './tokenRefresh';

const feedApi = createApi({
  reducerPath: 'feed',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_FEED_API_URL,
    prepareHeaders: (headers) => {
      // await refreshTokenBeforeExpire();
      headers.set('Authorization', `Bearer ${AsyncStorage.getItem('access_token')}`);
      return headers;
    },
  }),
  tagTypes: ['Feed'],
  endpoints: (builder) => ({}),
});

export default feedApi;
