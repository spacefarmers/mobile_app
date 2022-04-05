import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect } from 'react';
import { Text, Box, HStack, Switch, Heading, Center, Button, Spinner} from 'native-base';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function NotificationsScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [poolBlock, setPoolBlock] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync(setError).then(token => setExpoPushToken(token));
  }, []);

  useEffect(() => {
    getToken();
  }, [expoPushToken]);

  useEffect(() => {
    if (!loading) {
      setFormChanged(true);
    }
  }, [poolBlock]);

  async function getToken() {
    if (expoPushToken == '')
      return;
    setLoading(true);
    let url = "https://spacefarmers.io/api/notifications/"+expoPushToken;
    const response = await fetch(url);
    const json = await response.json();
    if (json.data == undefined) {
      await postToken(false);
    } else {
      setPoolBlock(json.data.attributes.pool_block);
    }
    setLoading(false);
  }

  async function postToken(updateFormChanged) {
    await fetch('https://spacefarmers.io/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: expoPushToken,
        pool_block: poolBlock,
      }),
    })
    .then(handleErrors)
    .then(response => {
      if (updateFormChanged)
        setFormChanged(false);
    })
    .catch(error => {
      console.log(error);
      setError(error.toString())
    });
  }

  function handleErrors(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;
  }

  async function registerForPushNotificationsAsync(setError) {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        setError('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      setError('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  return (
    <Box>
      {loading ? (
        <Spinner py={10} flex={1} size="lg" />
      ) : (
        <Box>
          <Center>
            <Heading>{error != '' ? 'Error!' : ''}</Heading>
            <Text>{error}</Text>
          </Center>
          <Box mx={10}>
            <HStack alignItems="center" space={4}>
              <Switch value={poolBlock} onToggle={() => { setPoolBlock(!poolBlock) }} />
              <Text>Pool blocks</Text>
            </HStack>
            <Button
              isDisabled={!formChanged}
              onPress={() => {
                postToken(true);
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}