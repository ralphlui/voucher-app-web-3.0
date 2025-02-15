import { View, Text } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import { usePromoteCampaignMutation } from '@/services/campaign.service';
import HandleResponse from '@/components/common/HandleResponse';

type PromoteCampaignButtonProps = {
  userId: string;
  campaignId: string;
};

const PromoteCampaignButton = ({ userId, campaignId }: PromoteCampaignButtonProps) => {
  const [promoteCampaign, { data, error, isError, isSuccess, isLoading }] =
    usePromoteCampaignMutation();
  return (
    <View>
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error || 'Error occurs'}
          message={data?.message}
          //   onSuccess={onSuccess}
        />
      )}
      <Button onPress={() => promoteCampaign({ userId, campaignId })} loading={isLoading}>
        Promote
      </Button>
    </View>
  );
};

export default PromoteCampaignButton;
