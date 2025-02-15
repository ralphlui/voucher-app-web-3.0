import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Chip, IconButton, Text, useTheme } from 'react-native-paper';

import { Campaign } from '@/types/Campaign';
import useAuth from '@/hooks/useAuth';
import { UserTypeEnum } from '@/types/UserTypeEnum';
import CampaignStatusChip from '@/components/chips/CampaignStatusChip';
import { CampaignStatusEnum } from '@/types/CampaignStatusEnum';

interface Props {
  campaign: Campaign;
}

const CampaignCard = ({ campaign }: Props) => {
  const auth = useAuth();
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(false);
  const { colors } = useTheme(); // Get the theme's colors
  return (
    <Card
      style={styles.container}
      onPress={() => {
        router.push(`/(main)/campaign/${campaign.campaignId}`);
      }}>
      <Card.Content>
        <Text style={[styles.amount, { color: colors.onSurface }]} variant="displayLarge">
          ${campaign.amount} off
        </Text>
        {auth.role === UserTypeEnum.MERCHANT && (
          <CampaignStatusChip status={campaign?.campaignStatus ?? CampaignStatusEnum.CREATED} />
        )}
      </Card.Content>
      <Card.Title
        title={campaign.description}
        subtitle={`${campaign.numberOfClaimedVouchers} / ${campaign.numberOfVouchers} claimed`}
        right={() => (
          <Card.Actions>
            <IconButton
              animated
              mode="contained"
              icon={isSelected ? 'heart' : 'heart-outline'}
              onPress={() => setIsSelected(!isSelected)}
            />
            <IconButton animated icon="share" onPress={() => {}} />
          </Card.Actions>
        )}
      />
      <Card.Content>
        <Chip>
          @{campaign?.store?.storeName}, {campaign?.store?.address}, {campaign?.store?.city}
        </Chip>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    margin: 10,
  },
  cover: {
    margin: 10,
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
});

export default CampaignCard;
