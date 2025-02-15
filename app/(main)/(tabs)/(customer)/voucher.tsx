import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
} from 'react-native';

import VoucherCard from '@/components/cards/VoucherCard';
import usePagination from '@/hooks/usePagination';
import { useGetVouchersByUserIdQuery } from '@/services/voucher.service';
import { Voucher } from '@/types/Voucher';
import { Button, Searchbar, SegmentedButtons, Text } from 'react-native-paper';
import useAuth from '@/hooks/useAuth';
import NoDataFound from '@/components/common/NoDataFound';
import useResponsiveColumns from '@/hooks/useResponsiveColumns';
import HandleResponse from '@/components/common/HandleResponse';

const VoucherTab = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState('CLAIMED');
  const numColumns = useResponsiveColumns();
  const { pageNumber, setPageNumber, pageSize } = usePagination();
  const auth = useAuth();
  const { data, error, isLoading, isFetching, hasNextPage, isSuccess, isError, refetch } =
    useGetVouchersByUserIdQuery(
      {
        userId: auth.userId,
        status: campaignStatus,
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

  const renderItem = ({ item }: ListRenderItemInfo<Voucher>) => {
    return <VoucherCard voucher={item} />;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPageNumber(0);
    await refetch();
    setRefreshing(false);
  }, [campaignStatus, refetch]);

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
      <SegmentedButtons
        value={campaignStatus}
        onValueChange={setCampaignStatus}
        style={styles.segmentedButtons}
        buttons={[
          {
            value: 'CLAIMED',
            icon: 'ticket-confirmation',
            label: 'CLAIMED',
          },
          {
            value: 'CONSUMED',
            icon: 'checkbox-multiple-marked',
            label: 'CONSUMED',
          },
          { value: 'EXPIRED', icon: 'tag-off', label: 'EXPIRED' },
        ]}
      />
      <FlatList
        key={numColumns}
        numColumns={numColumns}
        data={data?.data ?? []}
        keyExtractor={(item) => item.voucherId.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        ListFooterComponent={isLoading ? <ActivityIndicator size="large" /> : null}
        refreshControl={
          <RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<NoDataFound text="voucher" />}
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
  segmentedButtons: {
    alignContent: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default VoucherTab;
