import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const feedApi = createApi({
  reducerPath: 'feed',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_FEED_API_URL,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${AsyncStorage.getItem('access_token')}`);
      return headers;
    },
  }),
  tagTypes: ['Feed'],
  endpoints: (builder) => ({}),
});

export default feedApi;
