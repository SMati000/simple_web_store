import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import logger from '@/utils/logger';

export const postExpoToken = async (token: string) => {
  var notifToken = ""
  try {
    const expoToken = (await Notifications.getExpoPushTokenAsync()).data;
    notifToken = btoa(expoToken);
    logger.debug("Expo token", notifToken);
  } catch(e) {
    logger.debug("Error obteniendo expo token", e)
    return;
  }  
  
  const endpoint = `${Constants.expoConfig?.extra?.REACT_APP_API_URL}/notifications?token=${notifToken}`
  
  const response = await fetch(endpoint, 
    {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
    }
  );
  
  logger.info(`Request a API: POST ${endpoint} - HTTP Status: `, response.status)
  
  if (response.status < 200 || response.status >= 300) {
    logger.error('Ha ocurrido un error ', response);
    return null;
  }

  return {};
}
