import React, { useState, useEffect } from 'react';
import { Text, Box, HStack, Switch, Heading, Center, Button, Spinner} from 'native-base';
import { getExpoToken, updateNotificationToken, getNotification } from '../helpers/notifications'

export default function NotificationsScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [poolBlock, setPoolBlock] = useState(false);
  const [farmAlerts, setFarmAlerts] = useState(false);
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
  }, [poolBlock, farmAlerts]);

  async function getToken() {
    if (expoPushToken == '')
      return;
    setLoading(true);
    const json = await getNotification(expoPushToken);
    setPoolBlock(json.attributes.pool_block);
    setFarmAlerts(json.attributes.farm_alerts);
    setLoading(false);
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
            <HStack alignItems="center" space={4}>
              <Switch value={farmAlerts} onToggle={() => { setFarmAlerts(!farmAlerts) }} />
              <Text>Farm alerts</Text>
            </HStack>
            <Button
              isDisabled={!formChanged}
              onPress={() => {
                updateNotificationToken(expoPushToken, {
                  pool_block: poolBlock,
                  farm_alerts: farmAlerts,
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