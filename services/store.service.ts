import coreApi from '@/services/core.api';

export const storeApiSlice = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query({
      query: ({ description, page_size = 10, page_number = 0 }) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/core/stores?query=${description}&page=${page_number}&size=${page_size}`,
        method: 'GET',
      }),
      providesTags: ['Store'],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page_number === 0 || arg.description !== currentCache.description) {
          currentCache.data = newItems.data;
          currentCache.description = arg.description;
        } else {
          currentCache.data.push(...newItems.data);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getStoresByUserId: builder.query({
      query: ({ userId, page_size = 10, page_number = 0 }) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/core/stores/users/${userId}?page=${page_number}&size=${page_size}`,
        method: 'GET',
      }),
      providesTags: ['Store'],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page_number === 0) {
          currentCache.data = newItems.data;
        } else {
          currentCache.data.push(...newItems.data);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getStoresByUserIdForStoreCreation: builder.query({
      query: ({ userId }) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/core/stores/users/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Store'],
    }),
    getStoreById: builder.query({
      query: ({ id }) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/core/stores/${id}`,
        method: 'GET',
      }),
    }),
    createStore: builder.mutation({
      query: (formData: FormData) => ({
        url: `/api/core/stores`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Store'],
    }),
    updateStore: builder.mutation({
      query: (formData: FormData) => ({
        url: `/api/core/stores`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Store'],
    }),
  }),
});

export const {
  useGetStoresByUserIdQuery,
  useGetStoreByIdQuery,
  useGetStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useGetStoresByUserIdForStoreCreationQuery,
} = storeApiSlice;
