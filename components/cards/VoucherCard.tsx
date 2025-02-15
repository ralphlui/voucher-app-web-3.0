import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Modal, Divider, Portal, Text, TextInput } from 'react-native-paper';

import { Voucher } from '@/types/Voucher';
import { useRouter } from 'expo-router';
import VoucherStatusChip from '@/components/chips/VoucherStatusChip';
import UseVoucherButton from '@/components/buttons/UseVoucherButton';

interface VoucherCardProps {
  voucher: Voucher;
}

const VoucherCard = ({ voucher }: VoucherCardProps) => {
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <Card style={styles.container}>
        <Card.Title
          title={voucher.campaign?.description}
          right={() => <VoucherStatusChip status={voucher.voucherStatus} />}></Card.Title>
        <Card.Content>
          <Text style={styles.amount} variant="displayLarge">
            ${voucher.amount} off
          </Text>
        </Card.Content>
        <Divider />
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => {
              router.push(`/(main)/campaign/${voucher.campaign?.campaignId}`);
            }}>
            T&C
          </Button>
          {voucher.voucherStatus === 'CLAIMED' && (
            <Button mode="contained" onPress={() => setVisible(true)}>
              Use
            </Button>
          )}
        </Card.Actions>
      </Card>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modal}>
          <Card>
            <Card.Title title="Enter 4 digits PIN"></Card.Title>
            <Card.Content>
              <TextInput></TextInput>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => setVisible(false)}>Close</Button>
              <UseVoucherButton voucherId={voucher.voucherId} setVisible={setVisible} />
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  scrollViewStyle: {
    flex: 1,
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
  amount: {
    alignSelf: 'center',
    marginBottom: 10,
    padding: 10,
    height: 80,
    borderRadius: 5,
    borderColor: 'grey',
  },
  chip: {
    alignSelf: 'center',
    marginRight: 10,
  },
  modal: {
    padding: 20,
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default VoucherCard;
