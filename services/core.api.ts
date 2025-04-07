import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshTokenBeforeExpire } from './tokenRefresh';

const coreApi = createApi({
  reducerPath: 'core',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_CORE_API_URL,
    prepareHeaders: (headers) => {
      // await refreshTokenBeforeExpire();
      headers.set('Authorization', `Bearer ${AsyncStorage.getItem('access_token')}`);
      return headers;
    },
  }),
  tagTypes: ['Campaign', 'Store', 'Voucher'],
  endpoints: (builder) => ({}),
});

export default coreApi;
