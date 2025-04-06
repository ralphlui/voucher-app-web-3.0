import { RootState } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const feedApi = createApi({
  reducerPath: 'feed',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_FEED_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const auth = getState() as RootState;
      headers.set('Authorization', `Bearer ${AsyncStorage.getItem('auth_token')}`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Feed'],
  endpoints: (builder) => ({}),
});

export default feedApi;
