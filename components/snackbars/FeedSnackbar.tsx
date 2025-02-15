import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Snackbar, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';

const FeedSnackbar = () => {
  const message = useSelector((state: RootState) => state.auth.message);
  const [visible, setVisible] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    if (message) {
      setVisible(true);
    }
  }, [message]);
  return (
    <View style={styles.container}>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={10000}
        action={{
          label: 'View More',
          onPress: () => {
            router.push(`/(main)/campaign/${message?.campaignId ?? ''}`);
          },
        }}>
        <Text style={styles.text}>
          New promotion {message?.campaignDescription} @ {message?.storeName}
        </Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
  },
});

export default FeedSnackbar;
