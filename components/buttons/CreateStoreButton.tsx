import { router } from 'expo-router';
import React from 'react';
import { Button } from 'react-native-paper';

type CreateStoreButtonProps = {
  text?: string
}

const CreateStoreButton = ({text}: CreateStoreButtonProps) => {
  return (
    <Button
      icon="plus"
      mode="text"
      onPress={() => {
        router.push('/store/create');
      }}>
      {text ?? 'Create'}
    </Button>
  );
};

export default CreateStoreButton;
