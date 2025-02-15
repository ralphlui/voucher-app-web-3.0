import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
} from 'react-native';

import StoreCard from '@/components/cards/StoreCard';
import usePagination from '@/hooks/usePagination';
import { useGetStoresByUserIdQuery } from '@/services/store.service';
import { Store } from '@/types/Store';
import useAuth from '@/hooks/useAuth';
import NoDataFound from '@/components/common/NoDataFound';
import useResponsiveColumns from '@/hooks/useResponsiveColumns';
import HandleResponse from '@/components/common/HandleResponse';

const StoreTab = () => {
  const [refreshing, setRefreshing] = useState(false);
  const numColumns = useResponsiveColumns();
  const { pageNumber, setPageNumber, pageSize } = usePagination();
  const auth = useAuth();
  const { data, error, isLoading, isFetching, hasNextPage, isSuccess, isError, refetch } =
    useGetStoresByUserIdQuery(
      {
        userId: auth.userId,
        page_size: pageSize,
        page_number: pageNumber,
      },
      {
        selectFromResult: ({ data, ...args }) => {
          const totalRecords = data?.totalRecord ?? 0;
          const hasNextPage = pageNumber < Math.ceil(totalRecords / pageSize) - 1;
          return {
            hasNextPage,
            data,
            ...args,
          };
        },
      }
    );

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isLoading || isFetching) return;
    setPageNumber((pageNumber) => pageNumber + 1);
  }, [hasNextPage, isLoading, isFetching]);

  const renderItem = ({ item }: ListRenderItemInfo<Store>) => {
    return <StoreCard store={item} />;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPageNumber(0);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <>
      {isError && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error || 'Error occurs'}
          message={data?.message}
        />
      )}
      <FlatList
        key={numColumns}
        numColumns={numColumns}
        data={data?.data ?? []}
        keyExtractor={(item) => item?.storeId?.toString() ?? ''}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        ListFooterComponent={isFetching || isLoading ? <ActivityIndicator size="large" /> : null}
        ListEmptyComponent={<NoDataFound text="store" />}
        refreshControl={
          <RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} />
        }
        style={styles.container}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    margin: 10,
  },
  searchBar: {
    alignContent: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default StoreTab;
