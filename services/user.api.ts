import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//--v6
// const userApi = createApi({
//   reducerPath: 'user',
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.EXPO_PUBLIC_AUTH_API_URL,
//     prepareHeaders: (headers) => {
//       headers.set('Content-Type', 'application/json');
//       return headers;
//     },
//   }),
//   tagTypes: ['User'],
//   endpoints: (builder) => ({}),
// });

const userApi = createApi({
  reducerPath: 'user',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_AUTH_API_URL || 'http://localhost:8083/',
    // credentials: 'include',
    // baseUrl: process.env.EXPO_PUBLIC_AUTH_API_URL,
    prepareHeaders: async (headers) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Access-Control-Allow-Credentials', 'true');
      headers.set('Origin', process.env.EXPO_PUBLIC_AUTH_API_URL || 'http://localhost:8083/');

      // Get and set the token
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        console.log('Setting token in headers:', token);
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({}),
});

export default userApi;
