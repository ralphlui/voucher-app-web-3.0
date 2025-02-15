import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';

import LoginButton from '@/components/buttons/LoginButton';
import useAuth from '@/hooks/useAuth';
import { UserTypeEnum } from '@/types/UserTypeEnum';
import CreateCampaignButton from '@/components/buttons/CreateCampaignButton';
import CreateStoreButton from '@/components/buttons/CreateStoreButton';

const WebLayout = () => {
  const auth = useAuth();
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        redirect={auth.role !== UserTypeEnum.CUSTOMER && auth.role !== null}
        options={{
          drawerLabel: 'Campaign',
          title: 'Campaign',
          drawerIcon: ({ color }) => <Ionicons name="bag-handle" size={30} color={color} />,
          headerRight: () =>
            (!auth.success && <LoginButton />) ||
            (auth.role === UserTypeEnum.MERCHANT && <CreateCampaignButton />),
        }}
      />
      <Drawer.Screen
        name="(merchant)/index"
        redirect={auth.role !== UserTypeEnum.MERCHANT}
        options={{
          drawerLabel: 'Campaign',
          title: 'Campaign',
          drawerIcon: ({ color }) => <Ionicons name="bag-handle" size={30} color={color} />,
          headerRight: () =>
            (!auth.success && <LoginButton />) ||
            (auth.role === UserTypeEnum.MERCHANT && <CreateCampaignButton />),
        }}
      />
      <Drawer.Screen
        name="store"
        redirect={auth.role !== UserTypeEnum.CUSTOMER && auth.role !== null}
        options={{
          drawerLabel: 'Store',
          title: 'Store',
          drawerIcon: ({ color }) => <Ionicons name="storefront" size={30} color={color} />,
          headerRight: () =>
            (!auth.success && <LoginButton />) ||
            (auth.role === UserTypeEnum.MERCHANT && <CreateStoreButton />),
        }}
      />
      <Drawer.Screen
        name="(merchant)/store"
        redirect={auth.role !== UserTypeEnum.MERCHANT}
        options={{
          drawerLabel: 'Store',
          title: 'Store',
          drawerIcon: ({ color }) => <Ionicons name="storefront" size={30} color={color} />,
          headerRight: () =>
            (!auth.success && <LoginButton />) ||
            (auth.role === UserTypeEnum.MERCHANT && <CreateStoreButton />),
        }}
      />
      <Drawer.Screen
        name="(customer)/voucher"
        redirect={!(auth.role === UserTypeEnum.CUSTOMER)}
        options={{
          drawerLabel: 'Voucher',
          title: 'Voucher',
          drawerIcon: ({ color }) => <Ionicons name="gift" size={30} color={color} />,
        }}
      />
      <Drawer.Screen
        name="(customer)/feed"
        redirect={!(auth.role === UserTypeEnum.CUSTOMER)}
        options={{
          drawerLabel: 'Feed',
          title: 'Feed',
          drawerIcon: ({ color }) => <Ionicons name="notifications" size={30} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        redirect={!(auth.role !== null)}
        options={{
          drawerLabel: 'Profile',
          title: 'Profile',
          drawerIcon: ({ color }) => <Ionicons name="person" size={30} color={color} />,
        }}
      />
    </Drawer>
  );
};

export default WebLayout;
