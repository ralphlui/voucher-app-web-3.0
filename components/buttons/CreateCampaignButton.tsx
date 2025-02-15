import { router } from 'expo-router';
import React from 'react';
import { Button } from 'react-native-paper';

type CreateCampaignButtonProps = {
  text?: string;
};

const CreateCampaignButton = ({ text }: CreateCampaignButtonProps) => {
  return (
    <Button
      icon="plus"
      mode="text"
      onPress={() => {
        router.push('/campaign/create');
      }}>
      {text ?? 'Create'}
    </Button>
  );
};

export default CreateCampaignButton;
