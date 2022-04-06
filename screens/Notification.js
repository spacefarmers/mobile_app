import React, { useState, useEffect } from 'react';
import { Text, Box, HStack, Switch, Heading, Center, Button, Spinner} from 'native-base';
import { getExpoToken, updateNotificationToken } from '../helpers/notifications'

export default function NotificationsScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [poolBlock, setPoolBlock] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    getExpoToken()
      .then(token => setExpoPushToken(token))
      .catch(error => setError(error.toString()));
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
    let url = global.API_URL + "/api/notifications/"+expoPushToken;
    const response = await fetch(url);
    const json = await response.json();
    if (json.data == undefined) {
      updateNotificationToken(expoPushToken, {})
        .catch(error => setError(error.toString()))
        .finally(() => setLoading(false));
    } else {
      setPoolBlock(json.data.attributes.pool_block);
      setLoading(false);
    }
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
                updateNotificationToken(expoPushToken, {
                  pool_block: poolBlock,
                })
                  .then(() => setFormChanged(false))
                  .catch(error => setError(error.toString()));
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