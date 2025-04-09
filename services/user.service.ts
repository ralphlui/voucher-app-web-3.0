import AsyncStorage from '@react-native-async-storage/async-storage';

import userApi from '@/services/user.api';


export const userApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ body }) => ({
        url: '/api/users/login',
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/api/users/logout',
        method: 'POST',
      }),
    }),

    verifyUser: builder.mutation({
      query: ({ verifyid }) => ({
        url: `/api/users/verify/${verifyid}`,
        method: 'PATCH',
      }),
    }),

    createUser: builder.mutation({
      query: ({ body }) => ({
        url: '/api/users',
        method: 'POST',
        body,
      }),
    }),

    getUsers: builder.query({
      query: ({ page }) => ({
        headers: {
          'Content-Type': 'application/json', 
          Authorisation: `Bearer ${AsyncStorage.getItem('access_token')}`,
        },
        url: `/api/user?page=${page}`,
        method: 'GET',
      }),
    }),

    editUser: builder.mutation({
      query: ({ body }) => ({
        headers: {
          'Content-Type': 'application/json', 
          Authorisation: `Bearer ${AsyncStorage.getItem('access_token')}`,
        },
        url: '/api/users',
        method: 'POST',
        body,
      }),
    }),

    generateOtp: builder.mutation({
      query: ({ body }) => ({
        url: '/api/users/otp/generate',
        method: 'POST',
        body,
      }),
    }),

    validateOtp: builder.mutation({
      query: ({ body }) => ({
        url: '/api/users/otp/validate',
        method: 'POST',
        body,
      }),
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: '/api/users/refreshToken',
        method: 'POST',
      }),
    }),

    verifyToken: builder.mutation({
      query: () => ({
        headers: {
          Authorisation: `Bearer ${AsyncStorage.getItem('access_token')}`,
        },
        url: '/api/users/validateToken',
        method: 'POST',
      }),
    }),

    googleLogin: builder.mutation({
      query: ({ body }) => ({
        url: '/api/users/google/userinfo',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${body.token}`,
        },
      }),
    }),

    googleRegister: builder.mutation({
      query: ({ body }) => ({
        url: '/api/users/google/userinfo',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${body.token}`,
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useEditUserMutation,
  useVerifyUserMutation,
  useGenerateOtpMutation,
  useValidateOtpMutation,
  useRefreshTokenMutation,
  useVerifyTokenMutation,
  useGoogleLoginMutation,
  useGoogleRegisterMutation,
} = userApiSlice;
