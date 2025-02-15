import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Modal, Portal } from 'react-native-paper';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import useAuth from '@/hooks/useAuth';
import { useGetCampaignsByStoreIdQuery } from '@/services/campaign.service';
import usePagination from '@/hooks/usePagination';
import { FlatList, ListRenderItemInfo, RefreshControl, StyleSheet } from 'react-native';
import { Campaign } from '@/types/Campaign';
import CampaignCard from '@/components/cards/CampaignCard';
import NoDataFound from '@/components/common/NoDataFound';
import { useGetStoreByIdQuery } from '@/services/store.service';
import useResponsiveColumns from '@/hooks/useResponsiveColumns';
import { CampaignStatusEnum } from '@/types/CampaignStatusEnum';
import HandleResponse from '@/components/common/HandleResponse';

const CampaigsForStore = () => {
  const { id } = useLocalSearchParams();
  const { pageNumber, setPageNumber, pageSize } = usePagination();
  const numColumns = useResponsiveColumns();
  const [refreshing, setRefreshing] = useState(false);
  const { data, error, isLoading, hasNextPage, isFetching, isSuccess, isError, refetch } =
    useGetCampaignsByStoreIdQuery(
      {
        storeId: id,
        status: CampaignStatusEnum.PROMOTED,
        page_size: pageSize,
        page_number: pageNumber,
      },
      {
        selectFromResult: ({ data, ...args }) => {
          return {
            hasNextPage: pageNumber < Math.ceil((data?.totalRecord ?? 10) / pageSize) - 1,
            data,
            ...args,
          };
        },
      }
    );
  const {
    data: storeData,
    error: storeError,
    isLoading: storeIsloading,
    isFetching: storeIsfetching,
    isSuccess: storeIssuccess,
    isError: storeIserror,
  } = useGetStoreByIdQuery({
    id,
  });
  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isLoading || isFetching) return;
    setTimeout(() => {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }, 300);
  }, [hasNextPage, isLoading, isFetching]);

  const renderItem = ({ item }: ListRenderItemInfo<Campaign>) => {
    return <CampaignCard campaign={item} />;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPageNumber(0);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <>
      <Stack.Screen options={{ title: storeData?.data?.storeName ?? 'Loading...' }} />
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
        keyExtractor={(item) => item?.campaignId?.toString() ?? ''}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        renderItem={renderItem}
        ListFooterComponent={
          !(refreshing || isFetching) && isLoading ? <ActivityIndicator size="large" /> : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<NoDataFound text="campaign" />}
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
  modal: {
    padding: 20,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
  },
});
export default CampaigsForStore;
