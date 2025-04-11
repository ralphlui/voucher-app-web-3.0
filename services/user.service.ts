import AsyncStorage from '@react-native-async-storage/async-storage';

import userApi from '@/services/user.api';
import { UserTypeEnum } from '@/types/UserTypeEnum';
import { FetchBaseQueryError, QueryReturnValue } from '@reduxjs/toolkit/query';

interface GoogleAuthResponse {
  success: boolean;
  message: string;
  totalRecord: number;
  data: {
    userID: string;
    email: string;
    username: string;
    role: string;
    authProvider: string;
    verified: boolean;
    active: boolean;
  };
}

interface UpdateRoleRequest {
  userId: string;
  role: UserTypeEnum;
}

interface UpdateRoleResponse {
  success: boolean;
  message: string;
  data: {
    role: UserTypeEnum;
  };
}

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

    updateUserRole: builder.mutation<UpdateRoleResponse, UpdateRoleRequest>({
      query: (body) => ({
        url: '/api/users/roles',
        method: 'PUT',
        body: {
          userId: body.userId,
          role: body.role,
        },
        credentials: 'include',
      }),
      transformErrorResponse: (response) => {
        console.error('Update Role Error:', response);
        return response;
      },
    }),

    // updateUserRole: builder.mutation<UpdateRoleResponse, UpdateRoleRequest>({
    //   query: (body) => {
    //     const token = AsyncStorage.getItem('access_token');
    //     console.log('=== Debug Token ===');
    //     console.log('Access Token at updateUserRole api b4 call :', token);
    //     console.log('==================');

    //     return {
    //       url: '/api/users/roles',
    //       method: 'PUT',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${token}`,
    //         'Access-Control-Allow-Credentials': 'true',
    //       },
    //       body: {
    //         userId: body.userId,
    //         role: body.role,
    //       },
    //       credentials: 'include',
    //     };
    //   },
    //   transformErrorResponse: (response) => {
    //     console.error('Update Role Error:', response);
    //     return response;
    //   },
    // }),

    // updateUserRole: builder.mutation<UpdateRoleResponse, UpdateRoleRequest>({
    //   query: (body) => ({
    //     url: '/api/users/roles',
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${AsyncStorage.getItem('access_token')}`,
    //       'Access-Control-Allow-Credentials': 'true',
    //     },
    //     body: {
    //       userId: body.userId,
    //       role: body.role,
    //     },
    //     credentials: 'include',
    //   }),
    //   // Add transform response to handle errors
    //   transformErrorResponse: (response) => {
    //     console.error('=== Update Role Error ===', response);
    //     return response;
    //   },
    //   // Add transform response to handle success
    //   transformResponse: (response: UpdateRoleResponse) => {
    //     console.log('=== Update Role Success ===', response);
    //     return response;
    //   },
    // }),

    editUser: builder.mutation({
      query: ({ body }) => ({
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AsyncStorage.getItem('access_token')}`,
        },
        url: '/api/users',
        method: 'PUT',
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

    googleRegister: builder.mutation<GoogleAuthResponse, { body: { token: string } }>({
      query: ({ body }) => ({
        url: '/api/users/google/userinfo',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${body.token}`,
          'Access-Control-Allow-Credentials': 'true',
        },
        credentials: 'include', // This is important for receiving cookies
      }),
    }),

    // googleRegister: builder.mutation({
    //   query: ({ body }) => ({
    //     url: '/api/users/google/userinfo',
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${body.token}`,
    //     },
    //     credentials: 'include',
    //   }),
    // }),
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
  useUpdateUserRoleMutation,
} = userApiSlice;
