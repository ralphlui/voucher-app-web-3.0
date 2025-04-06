import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const coreApi = createApi({
  reducerPath: 'core',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_CORE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const auth = getState() as RootState;
      headers.set('Authorization', `Bearer ${AsyncStorage.getItem('auth_token')}`);
      return headers;
    },
  }),
  tagTypes: ['Campaign', 'Store', 'Voucher'],
  endpoints: (builder) => ({}),
});

export default coreApi;
