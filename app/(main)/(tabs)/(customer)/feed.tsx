import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ListRenderItemInfo,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Button, Chip, Divider, IconButton, Text } from 'react-native-paper';

import usePagination from '@/hooks/usePagination';
import { useGetFeedByUserIdQuery } from '@/services/feed.service';
import { Feed } from '@/types/Feed';
import { useRouter } from 'expo-router';
import useAuth from '@/hooks/useAuth';
import NoDataFound from '@/components/common/NoDataFound';
import useResponsiveColumns from '@/hooks/useResponsiveColumns';
import HandleResponse from '@/components/common/HandleResponse';

const FeedTab = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { pageNumber, setPageNumber, pageSize } = usePagination();
  const numColumns = useResponsiveColumns();
  const router = useRouter();
  const auth = useAuth();
  const { data, error, isLoading, isFetching, hasNextPage, isSuccess, isError, refetch } =
    useGetFeedByUserIdQuery(
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

  const renderItem = ({ item }: ListRenderItemInfo<Feed>) => {
    return (
      <View style={styles.listRow}>
        <IconButton
          onPress={() => {}}
          selected={!item.isRead}
          icon={!item.isRead ? 'information' : 'star-outline'}
        />
        <Chip>{item.category}</Chip>
        <Button
          onPress={() => {
            router.push(`/(main)/campaign/${item.campaignId}`);
          }}>{`${item.campaignDescription ?? ''} @ `}</Button>
        <Button
          onPress={() => {
            router.push(`/(main)/store/${item.storeId}`);
          }}>
          {item.storeName}
        </Button>
      </View>
    );
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
        keyExtractor={(item) => item.feedId.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        ListFooterComponent={isLoading ? <ActivityIndicator size="large" /> : null}
        ItemSeparatorComponent={Divider}
        refreshControl={
          <RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<NoDataFound text="feed" />}
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
  listRow: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
});

export default FeedTab;
