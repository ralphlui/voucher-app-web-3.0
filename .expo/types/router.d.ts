/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)/2fa` | `/(auth)/login` | `/(auth)/register` | `/(customer)/feed` | `/(customer)/voucher` | `/(main)` | `/(main)/` | `/(main)/(customer)/feed` | `/(main)/(customer)/voucher` | `/(main)/(merchant)` | `/(main)/(merchant)/store` | `/(main)/(tabs)` | `/(main)/(tabs)/` | `/(main)/(tabs)/(customer)/feed` | `/(main)/(tabs)/(customer)/voucher` | `/(main)/(tabs)/(merchant)` | `/(main)/(tabs)/(merchant)/store` | `/(main)/(tabs)/feed` | `/(main)/(tabs)/profile` | `/(main)/(tabs)/store` | `/(main)/(tabs)/voucher` | `/(main)/campaign/create` | `/(main)/feed` | `/(main)/profile` | `/(main)/store` | `/(main)/store/create` | `/(main)/user/verification` | `/(main)/voucher` | `/(merchant)` | `/(merchant)/store` | `/(tabs)` | `/(tabs)/` | `/(tabs)/(customer)/feed` | `/(tabs)/(customer)/voucher` | `/(tabs)/(merchant)` | `/(tabs)/(merchant)/store` | `/(tabs)/feed` | `/(tabs)/profile` | `/(tabs)/store` | `/(tabs)/voucher` | `/2fa` | `/_sitemap` | `/campaign/create` | `/feed` | `/login` | `/profile` | `/register` | `/store` | `/store/create` | `/user/verification` | `/voucher`;
      DynamicRoutes: `/(auth)/verification/${Router.SingleRoutePart<T>}` | `/(main)/campaign/${Router.SingleRoutePart<T>}` | `/(main)/store/${Router.SingleRoutePart<T>}` | `/(main)/store/campaign/${Router.SingleRoutePart<T>}` | `/campaign/${Router.SingleRoutePart<T>}` | `/store/${Router.SingleRoutePart<T>}` | `/store/campaign/${Router.SingleRoutePart<T>}` | `/verification/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(auth)/verification/[id]` | `/(main)/campaign/[id]` | `/(main)/store/[id]` | `/(main)/store/campaign/[id]` | `/campaign/[id]` | `/store/[id]` | `/store/campaign/[id]` | `/verification/[id]`;
    }
  }
}
