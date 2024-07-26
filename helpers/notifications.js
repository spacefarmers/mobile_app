import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function getExpoToken() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
  }
  if (finalStatus !== 'granted') {
      throw Error('Notification permissions are missing, therefore you will not receive farm alerts. Please verify the permissions for the application.');
  }
  token = (await Notifications.getExpoPushTokenAsync({'projectId': Constants.expoConfig.extra.eas.projectId})).data;

  return token;
}

export async function getNotification(token) {
  let url = global.API_URL + "/api/notifications/" + token;
  const response = await fetch(url);
  const json = await response.json();
  if (json.data == undefined) {
    await updateNotificationToken(token, {});
    const data = await getNotification(token);
    return data;
  } else {
    return json.data;
  }
}

export async function updateNotificationToken(token, data) {
  fetch(global.API_URL + "/api/notifications", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token,
      ...data
    }),
  })
  .then(handleErrors)
  .then(response => {
    return response;
  })
  .catch(error => { throw error });
}

export async function getFarmAlerts(token, farmId) {
  const url = global.API_URL + "/api/farm_notifications/" + encodeURIComponent(token) + "/" + farmId
  const response = await fetch(url)
  handleErrors(response);
  const json = await response.json();
  return json.data;
}

export async function updateFarmAlerts(token, farmId, data) {
  await fetch(global.API_URL + "/api/farm_notifications", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token,
      launcher_id: farmId,
      ...data
    }),
  })
  .then(handleErrors)
  .then(response => {
    return response;
  })
  .catch(error => { throw error });
}

export async function deleteFarmAlerts(token, farmId) {
  const url = global.API_URL + "/api/farm_notifications/" + encodeURIComponent(token) + "/" + farmId
  const response = await fetch(url, {method: 'DELETE'})
}
  
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
