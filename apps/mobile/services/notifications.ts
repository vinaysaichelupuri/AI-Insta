// ──────────────────────────────────────────────────────────────────────────────
// Push Notification Service
// ──────────────────────────────────────────────────────────────────────────────

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { registerDevice } from './api';

// Configure how notifications appear when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[Notifications] Permission not granted');
    return null;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    // Register with backend
    await registerDevice(token).catch((e) =>
      console.warn('[Notifications] Backend registration failed:', e),
    );
    return token;
  } catch (e) {
    console.warn('[Notifications] Could not get push token:', e);
    return null;
  }
}
