import React, { useCallback, useDeferredValue, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import CampaignCard from '@/components/cards/CampaignCard';
import HandleResponse from '@/components/common/HandleResponse';
import NoDataFound from '@/components/common/NoDataFound';
import usePagination from '@/hooks/usePagination';
import useResponsiveColumns from '@/hooks/useResponsiveColumns';
import { useGetCampaignsQuery } from '@/services/campaign.service';
import { Campaign } from '@/types/Campaign';
import { Link } from 'expo-router';
import { Searchbar } from 'react-native-paper';


const CampaignTab = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const numColumns = useResponsiveColumns();
  const debouncedSearchQuery = useDeferredValue(searchQuery);
  const { pageNumber, setPageNumber, pageSize } = usePagination();
  const { data, error, isLoading, isFetching, hasNextPage, isSuccess, isError, refetch } =
    useGetCampaignsQuery(
      {
        description: debouncedSearchQuery,
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

  const renderItem = ({ item }: ListRenderItemInfo<Campaign>) => {
    return <CampaignCard campaign={item} />;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPageNumber(0);
    await refetch();
    setRefreshing(false);
  }, [debouncedSearchQuery, refetch]);

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
      <Searchbar
        style={styles.searchBar}
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      {/* to fix later into login then homepage */}
      <Link href='/(auth)/2fa'>
        Go to 2fa screen
      </Link>
      <FlatList
        key={numColumns}
        numColumns={numColumns}
        data={data?.data ?? []}
        keyExtractor={(item) => item?.campaignId?.toString() ?? ''}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        ListFooterComponent={isFetching || isLoading ? <ActivityIndicator size="large" /> : null}
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
  searchBar: {
    alignContent: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default CampaignTab;
