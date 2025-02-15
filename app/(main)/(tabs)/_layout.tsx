import { Platform } from 'react-native';

import MobileLayout from '@/components/layouts/MobileLayout';
import WebLayout from '@/components/layouts/WebLayout';

export default function TabsLayout() {
  if (Platform.OS === 'web') {
    return <WebLayout />;
  }
  return <MobileLayout />;
}
