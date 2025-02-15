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

    // deleteUser: builder.mutation({
    //   query: ({ id }) => ({
    //     url: `/api/user/${id}`,
    //     method: 'DELETE',
    //   }),
    // }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  // useGetUserInfoQuery,
  useCreateUserMutation,
  useGetUsersQuery,
  // useDeleteUserMutation,
  useEditUserMutation,
  useVerifyUserMutation,
} = userApiSlice;