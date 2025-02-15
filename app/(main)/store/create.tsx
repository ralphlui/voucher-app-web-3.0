import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, View, StyleSheet, Alert, Platform } from 'react-native';
import { ActivityIndicator, Avatar, Button, TextInput } from 'react-native-paper';
import { FormBuilder } from 'react-native-paper-form-builder';

import HandleResponse from '@/components/common/HandleResponse';
import { useCreateStoreMutation } from '@/services/store.service';
import useAuth from '@/hooks/useAuth';
import { UserTypeEnum } from '@/types/UserTypeEnum';
import ImageUploadInput from '@/components/inputs/ImageUploadInput';

type StoreForm = {
  storeName?: string;
  description?: string;
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  contactNumber?: string;
  image?: {};
};

const getImageBlob = async (imageUri: string) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  return blob;
};

const CreateStore = () => {
  const router = useRouter();
  const auth = useAuth();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const {
    formState: { errors },
    control,
    setFocus,
    handleSubmit,
  } = useForm<StoreForm>({
    defaultValues: {
      storeName: '',
      description: '',
      address1: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      contactNumber: '',
      image: {},
    },
    mode: 'onChange',
  });

  const [createStore, { data, isSuccess, isError, isLoading, error }] = useCreateStoreMutation();
  const onSuccess = () => {
    router.push('/store');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Store',
        }}
      />
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error || 'Error occurs'}
          message={data}
          onSuccess={onSuccess}
        />
      )}
      <View style={styles.containerStyle}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollViewStyle}>
            {auth.role === UserTypeEnum.MERCHANT && (
              <View style={[styles.containerStyle, Platform.OS === 'web' && styles.webStyle]}>
                <View style={styles.icon}>
                  <Avatar.Icon icon="ticket-percent-outline" />
                </View>
                <FormBuilder
                  control={control}
                  setFocus={setFocus}
                  formConfigArray={[
                    {
                      name: 'storeName',
                      type: 'text',
                      textInputProps: {
                        label: 'Store Name',
                        left: <TextInput.Icon icon="store" />,
                      },
                      rules: {
                        required: {
                          value: true,
                          message: 'Store Name is required',
                        },
                      },
                    },
                    {
                      name: 'description',
                      type: 'text',
                      textInputProps: {
                        label: 'Description',
                        left: <TextInput.Icon icon="text-account" />,
                      },
                    },
                    {
                      name: 'address1',
                      type: 'text',
                      textInputProps: {
                        label: 'Address',
                        left: <TextInput.Icon icon="map-marker" />,
                      },
                    },
                    {
                      name: 'city',
                      type: 'text',
                      textInputProps: {
                        label: 'City',
                        left: <TextInput.Icon icon="city" />,
                      },
                    },
                    {
                      name: 'country',
                      type: 'text',
                      textInputProps: {
                        label: 'Country',
                        left: <TextInput.Icon icon="earth" />,
                      },
                    },
                    {
                      name: 'postalCode',
                      type: 'text',
                      textInputProps: {
                        label: 'Postal Code',
                        left: <TextInput.Icon icon="mailbox" />,
                      },
                    },
                    {
                      name: 'contactNumber',
                      type: 'text',
                      textInputProps: {
                        label: 'Contact Number',
                        left: <TextInput.Icon icon="cellphone" />,
                      },
                    },
                  ]}
                />
                <ImageUploadInput onImagePicked={setImageUri} imageUri={imageUri} />
                <Button
                  style={styles.button}
                  mode="contained"
                  onPress={handleSubmit(
                    async ({
                      storeName,
                      description,
                      address1,
                      city,
                      country,
                      postalCode,
                      contactNumber,
                    }) => {
                      const formData = new FormData();
                      const blob = new Blob(
                        [
                          JSON.stringify({
                            storeName,
                            description,
                            address1,
                            city,
                            postalCode,
                            contactNumber,
                            country,
                            createdBy: auth.userId,
                          }),
                        ],
                        {
                          type: 'application/json',
                        }
                      );
                      formData.append('store', blob);
                      if (imageUri) {
                        const imageBlob = await getImageBlob(imageUri);
                        formData.append('image', imageBlob, Date.now() + '.jpg');
                      }
                      createStore(formData);
                    }
                  )}>
                  Create
                </Button>
              </View>
            )}
          </ScrollView>
        )}
      </View>
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
  button: {
    marginTop: 10,
  },
  webStyle: {
    maxWidth: 300,
    alignSelf: 'center',
  },
});

export default CreateStore;
