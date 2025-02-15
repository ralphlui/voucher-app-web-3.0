import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Modal, Portal, Card } from 'react-native-paper';

type CampaignEditFieldModalProps = {
  visible: boolean;
  fieldLabel: string;
  fieldValue: string;
  fieldType: 'text' | 'date'; // Supports text and date types
  onClose: () => void;
  onSave: (newValue: string) => void;
};

const CampaignEditFieldModal: React.FC<CampaignEditFieldModalProps> = ({
  visible,
  fieldLabel,
  fieldValue,
  fieldType,
  onClose,
  onSave,
}) => {
  const [newValue, setNewValue] = useState(fieldValue);

  const handleSave = () => {
    onSave(newValue);
    onClose();
  };

  return (
    <Portal>
      <Modal visible={visible} contentContainerStyle={styles.modal}>
        <Card>
          <Card.Content>
            <TextInput
              mode="outlined"
              label={fieldLabel}
              value={newValue}
              onChangeText={setNewValue}
              keyboardType={fieldType === 'date' ? 'default' : 'default'}
              placeholder={fieldType === 'date' ? 'YYYY-MM-DD' : ''}
            />
          </Card.Content>
          <Card.Actions>
            <Button onPress={onClose} style={styles.button}>
              Cancel
            </Button>
            <Button onPress={handleSave} mode="contained" style={styles.button}>
              Save
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 5,
  },
  modal: {
    padding: 20,
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default CampaignEditFieldModal;
