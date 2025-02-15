import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import React from 'react';

type NoDataFoundProps = {
  text: string;
};

const NoDataFound = ({ text }: NoDataFoundProps) => {
  return (
    <View style={styles.text}>
      <Image source={require('@/assets/empty_list.png')}/>
      <Text variant="headlineSmall">No {text} can be found.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 50,
    textAlign: 'center',
    marginTop: 40,
    flex: 1,
    alignItems: 'center',
    margin: 10,
    padding: 10,
  },
});

export default NoDataFound;
