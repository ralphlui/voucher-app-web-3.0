import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import LoginButton from '@/components/buttons/LoginButton';
import useAuth from '@/hooks/useAuth';
import { UserTypeEnum } from '@/types/UserTypeEnum';
import CreateCampaignButton from '../buttons/CreateCampaignButton';
import CreateStoreButton from '../buttons/CreateStoreButton';

const MobileLayout = () => {
  const auth = useAuth();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
      }}>
      <Tabs.Screen
        name="index"
        redirect={auth.role !== UserTypeEnum.CUSTOMER && auth.role !== null}
        options={{
          title: 'Campaign',
          tabBarIcon: ({ color }) => <Ionicons name="bag-handle" size={30} color={color} />,
          headerRight: () =>
            (!auth.success && <LoginButton />) ||
            (auth.role === UserTypeEnum.MERCHANT && <CreateCampaignButton />),
        }}
      />
      <Tabs.Screen
        name="(merchant)/index"
        redirect={auth.role !== UserTypeEnum.MERCHANT}
        options={{
          title: 'Campaign',
          tabBarIcon: ({ color }) => <Ionicons name="bag-handle" size={30} color={color} />,
          headerRight: () =>
            (!auth.success && <LoginButton />) ||
            (auth.role === UserTypeEnum.MERCHANT && <CreateCampaignButton />),
        }}
      />
      <Tabs.Screen
        name="store"
        redirect={auth.role !== UserTypeEnum.CUSTOMER && auth.role !== null}
        options={{
          title: 'Store',
          tabBarIcon: ({ color }) => <Ionicons name="storefront" size={30} color={color} />,
          headerRight: () =>
            (!auth.success && <LoginButton />) ||
            (auth.role === UserTypeEnum.MERCHANT && <CreateStoreButton />),
        }}
      />
      <Tabs.Screen
        name="(merchant)/store"
        redirect={auth.role !== UserTypeEnum.MERCHANT}
        options={{
          title: 'Store',
          tabBarIcon: ({ color }) => <Ionicons name="storefront" size={30} color={color} />,
          headerRight: () =>
            (!auth.success && <LoginButton />) ||
            (auth.role === UserTypeEnum.MERCHANT && <CreateStoreButton />),
        }}
      />
      <Tabs.Screen
        name="(customer)/voucher"
        redirect={auth.role !== UserTypeEnum.CUSTOMER}
        options={{
          title: 'Voucher',
          tabBarIcon: ({ color }) => <Ionicons name="gift" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(customer)/feed"
        redirect={auth.role !== UserTypeEnum.CUSTOMER}
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <Ionicons name="notifications" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        redirect={auth.role === null}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={30} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default MobileLayout;
