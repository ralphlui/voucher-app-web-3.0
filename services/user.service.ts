import AsyncStorage from '@react-native-async-storage/async-storage';

import userApi from '@/services/user.api';
import { UserTypeEnum } from '@/types/UserTypeEnum';

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
      query: ({ accountVerificationCode }) => ({ 
        url: `/api/users/verify`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { accountVerificationCode },
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

    editUser: builder.mutation({
      query: ({ body }) => ({
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
