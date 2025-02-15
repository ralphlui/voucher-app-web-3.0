import ClaimVoucherButton from '@/components/buttons/ClaimVoucherButton';
import PromoteCampaignButton from '@/components/buttons/PromoteCampaignButton';
import CampaignStatusChip from '@/components/chips/CampaignStatusChip';
import HandleResponse from '@/components/common/HandleResponse';
import CampaignEditFieldModal from '@/components/modals/CampaignEditFieldModal';
import useAuth from '@/hooks/useAuth';
import { useGetCampaignByIdQuery } from '@/services/campaign.service';
import { CampaignStatusEnum } from '@/types/CampaignStatusEnum';
import { UserTypeEnum } from '@/types/UserTypeEnum';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, Platform } from 'react-native';
import { Button, Text, ActivityIndicator, Card, ProgressBar, TextInput } from 'react-native-paper';

const Campaign = () => {
  const { id } = useLocalSearchParams();
  const auth = useAuth();
  const router = useRouter();
  const { data, error, isLoading, isFetching, isSuccess, isError, refetch } =
    useGetCampaignByIdQuery({ id });
  const [showPin, setShowPin] = useState<boolean>(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<{
    label: string;
    value: string;
    type: 'text' | 'date';
    key: string; // Field key to update in the backend
  } | null>(null);

  const handleEdit = (label: string, value: string, type: 'text' | 'date', key: string) => {
    setCurrentField({ label, value, type, key });
    setEditModalVisible(true);
  };

  const handleSave = (newValue: string) => {
    if (currentField) {
      console.log(`Update ${currentField.key} to ${newValue}`);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: data?.data?.description ?? 'Loading...' }} />
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
            <Card.Content>
              <Text style={styles.amount} variant="displayLarge">
                ${data?.data?.amount} off
              </Text>
              {auth.role === UserTypeEnum.MERCHANT && (
                <CampaignStatusChip status={data?.data?.campaignStatus} />
              )}
            </Card.Content>
            <Card.Title title={data?.data?.description} />
            <Card.Content>
              <View style={styles.processbar}>
                <Card.Actions>
                  {auth.role === UserTypeEnum.MERCHANT &&
                    data?.data.campaignStatus === CampaignStatusEnum.CREATED && (
                      <PromoteCampaignButton
                        userId={auth.userId ?? ''}
                        campaignId={data?.data?.campaignId}
                      />
                    )}
                  {auth.role === UserTypeEnum.CUSTOMER && (
                    <ClaimVoucherButton
                      campaignId={data?.data?.campaignId}
                      claimedBy={auth.userId ?? ''}
                    />
                  )}
                  {!auth.success && (
                    <Button
                      onPress={() => {
                        router.push('/login');
                      }}>
                      Login to claim
                    </Button>
                  )}
                </Card.Actions>
                <ProgressBar
                  progress={data?.data?.numberOfClaimedVouchers / data?.data?.numberOfVouchers}
                />
                <Text variant="bodyMedium">
                  {data?.data?.numberOfClaimedVouchers} / {data?.data?.numberOfVouchers} claimed
                </Text>
              </View>
              <Button
                mode="contained"
                icon="map-marker-radius"
                style={styles.button}
                onPress={() => {
                  router.push(`/(main)/store/${data?.data?.store?.storeId}`);
                }}>
                {data?.data?.store?.storeName} @ {data?.data?.store?.address},{' '}
                {data?.data?.store?.city}
              </Button>
              {showPin && (
                <View>
                  <Text variant="displayMedium" style={styles.pin}>
                    {data?.data?.pin}
                  </Text>
                  <Image
                    style={styles.image}
                    source={{
                      uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data?.data?.pin}`,
                    }}
                  />
                </View>
              )}
              {auth.role === UserTypeEnum.MERCHANT && (
                <Button onPress={() => setShowPin(!showPin)}>
                  {showPin ? 'Hide Pin' : 'Show Pin'}
                </Button>
              )}
              <TextInput
                style={styles.text}
                label="Tags"
                right={
                  auth.role === UserTypeEnum.MERCHANT &&
                  data?.data.campaignStatus === CampaignStatusEnum.CREATED && (
                    <TextInput.Icon
                      icon="pencil"
                      onPress={() => handleEdit('Tags', data?.data?.tagsJson, 'text', 'tags')}
                    />
                  )
                }
                disabled
                value={data?.data?.tagsJson}
              />
              <TextInput
                style={styles.text}
                label="Start Date"
                right={
                  auth.role === UserTypeEnum.MERCHANT &&
                  data?.data.campaignStatus === CampaignStatusEnum.CREATED && (
                    <TextInput.Icon
                      icon="pencil"
                      onPress={() =>
                        handleEdit('Start Date', data?.data?.startDate, 'date', 'startDate')
                      }
                    />
                  )
                }
                disabled
                value={data?.data?.startDate}
              />
              <TextInput
                style={styles.text}
                label="End Date"
                right={
                  auth.role === UserTypeEnum.MERCHANT &&
                  data?.data.campaignStatus === CampaignStatusEnum.CREATED && (
                    <TextInput.Icon
                      icon="pencil"
                      onPress={() => handleEdit('End Date', data?.data?.endDate, 'date', 'endDate')}
                    />
                  )
                }
                disabled
                value={data?.data?.endDate}
              />
              <TextInput
                style={styles.text}
                label="T&C"
                right={
                  auth.role === UserTypeEnum.MERCHANT &&
                  data?.data.campaignStatus === CampaignStatusEnum.CREATED && (
                    <TextInput.Icon
                      icon="pencil"
                      onPress={() => handleEdit('T&C', data?.data?.tandc, 'text', 'tandc')}
                    />
                  )
                }
                disabled
                value={data?.data?.tandc}
              />
              {currentField && (
                <CampaignEditFieldModal
                  visible={editModalVisible}
                  fieldLabel={currentField.label}
                  fieldValue={currentField.value}
                  fieldType={currentField.type}
                  onClose={() => setEditModalVisible(false)}
                  onSave={handleSave}
                />
              )}
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
    borderWidth: 1,
    padding: 2.5,
    height: 45,
    borderRadius: 5,
    borderColor: 'grey',
    backgroundColor: 'white',
  },
  amount: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    // borderWidth: 1,
    height: 80,
    borderRadius: 5,
    borderColor: 'grey',
    // backgroundColor: 'white',
  },
  pin: {
    alignSelf: 'center',
  },
  image: {
    alignSelf: 'center',
    width: 150,
    height: 150,
  },
  webStyle: {
    maxWidth: 300,
    alignSelf: 'center',
  },
});

export default Campaign;
