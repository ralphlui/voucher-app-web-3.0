import HandleResponse from '@/components/common/HandleResponse';
import useAuth from '@/hooks/useAuth';
import { useGetStoreByIdQuery } from '@/services/store.service';
import { UserTypeEnum } from '@/types/UserTypeEnum';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, View, StyleSheet, Platform } from 'react-native';
import { ActivityIndicator, Button, Card, Text } from 'react-native-paper';

const Store = () => {
  const { id } = useLocalSearchParams();
  const auth = useAuth();
  const { data, error, isLoading, isFetching, isSuccess, isError, refetch } = useGetStoreByIdQuery({
    id,
  });
  return (
    <>
      <Stack.Screen options={{ title: data?.data?.storeName ?? 'Loading...' }} />
      {isError && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error || 'Error occurs'}
          message={data?.message}
        />
      )}
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <Card style={[styles.container, Platform.OS === 'web' && styles.webStyle]}>
            <Card.Cover style={styles.cover} source={{ uri: data?.data?.image }} />
            <Card.Title
              title={data?.data?.storeName}
              subtitle={data?.data?.description}
              right={() => (
                <Card.Actions>
                  {auth.role === UserTypeEnum.MERCHANT && (
                    <Button mode="contained" onPress={() => {}}>
                      Edit
                    </Button>
                  )}
                </Card.Actions>
              )}
            />
            <Card.Content>
              <Text>Address</Text>
              <Text style={styles.text}>
                {data?.data?.address}, {data?.data?.address1}, {data?.data?.address2},
                {data?.data?.address3}
              </Text>
              <Text>City</Text>
              <Text style={styles.text}>{data?.data?.city}</Text>
              <Text>State</Text>
              <Text style={styles.text}>{data?.data?.state}</Text>
              <Text>Country</Text>
              <Text style={styles.text}>{data?.data?.country}</Text>
              <Text>Postal Code</Text>
              <Text style={styles.text}>{data?.data?.postalCode}</Text>
              <Text>Contact</Text>
              <Text style={styles.text}>{data?.data?.contactNumber}</Text>
            </Card.Content>
          </Card>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  scrollViewStyle: {
    flexGrow: 1,
    padding: 15,
  },
  headingStyle: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 40,
  },
  icon: {
    alignItems: 'center',
    margin: 10,
    padding: 10,
  },
  field: {
    marginBottom: 20,
  },
  container: {
    alignContent: 'center',
    margin: 10,
    minWidth: 300,
  },
  cover: {
    margin: 10,
  },
  processbar: {
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
  },
  text: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    height: 45,
    borderRadius: 5,
    borderColor: 'grey',
    backgroundColor: 'white',
  },
  webStyle: {
    maxWidth: 300,
    alignSelf: 'center',
  },
});

export default Store;
