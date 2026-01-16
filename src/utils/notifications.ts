import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function isExpoGo() {
  return Constants.appOwnership === 'expo';
}

export async function ensureAndroidAlertChannelAsync() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('alerts', {
    name: 'Price Alerts',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}

export async function registerForRemotePushTokenAsync(): Promise<string | null> {
  if (isExpoGo()) return null;

  await ensureAndroidAlertChannelAsync();

  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  if (!projectId) return null;

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch {
    return null;
  }
}

export async function firePriceAlertNotification(params: {
  title?: string;
  body: string;
  data?: Record<string, any>;
}) {
  await ensureAndroidAlertChannelAsync();

  return Notifications.scheduleNotificationAsync({
    content: {
      title: params.title ?? 'Price Alert Triggered',
      body: params.body,
      sound: 'default',
      data: params.data ?? {},
      ...(Platform.OS === 'android' ? { channelId: 'alerts' } : null),
    },
    trigger: null,
  });
}
