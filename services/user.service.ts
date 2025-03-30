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
        url: `/api/user?page=${page}`,
        method: 'GET',
      }),
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
} = userApiSlice;