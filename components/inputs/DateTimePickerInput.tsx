import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface IFormData {
  description: string;
  tagsJson: string;
  tandc: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  store: {
    storeId: string;
  };
}

interface DateTimePickerInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

const DateTimePickerInput: React.FC<DateTimePickerInputProps> = ({ label, value, onChange }) => {
  const [show, setShow] = useState<boolean>(false);

  const handleOnChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShow(false);
    if (selectedTime) {
      onChange(selectedTime);
    }
  };

  return (
    <View>
      <TextInput
        label={label}
        value={value.toLocaleDateString()}
        left={<TextInput.Icon icon="clock" />}
        onPress={() => setShow(true)}
        editable={false}
        style={styles.input}
      />
      {show && (
        <DateTimePicker value={value} mode="date" display="default" onChange={handleOnChange} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 20,
  },
});

export default DateTimePickerInput;
