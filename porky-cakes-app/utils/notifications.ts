import * as Notifications from 'expo-notifications';
import logger from './logger';

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true
    }),
  });

  return status
}

export async function enviarNotification(body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Porky Cakes',
      body: body,
    },
    trigger: null
  });
}
