import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const coreApi = createApi({
  reducerPath: 'core',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_CORE_API_URL,
    prepareHeaders: async (headers) => {
      headers.set('Content-Type', 'application/json');

      const token = await AsyncStorage.getItem('access_token');
      if(token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Campaign', 'Store', 'Voucher'],
  endpoints: (builder) => ({}),
});

export default coreApi;
