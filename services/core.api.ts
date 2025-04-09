import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const coreApi = createApi({
  reducerPath: 'core',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_CORE_API_URL,
    prepareHeaders: (headers) => {
    //  console.log('Preparing headers for core API:', AsyncStorage.getItem('access_token'));
      headers.set('Authorization', `Bearer ${AsyncStorage.getItem('access_token')}`);
      return headers;
    },
  }),
  tagTypes: ['Campaign', 'Store', 'Voucher'],
  endpoints: (builder) => ({}),
});

export default coreApi;
