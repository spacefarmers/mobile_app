import React, { useState, useEffect } from 'react';
import { Text, Box, HStack, Switch, Heading, Center, Button, Spinner, Alert, VStack} from 'native-base';
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
      <Box>
        <Center>
          <Heading>{error != '' ? 'Error!' : ''}</Heading>
          <Text>{error}</Text>
        </Center>
      </Box>
      {loading ? (
        <Spinner py={10} flex={1} size="lg" />
      ) : (
        <Box>
          <Box>
            <HStack  mx={10} alignItems="center" space={4}>
              <Switch value={poolBlock} onToggle={() => { setPoolBlock(!poolBlock) }} />
              <Text>Pool blocks</Text>
            </HStack>
            <HStack  mx={10} alignItems="center" space={4}>
              <Switch value={farmAlerts} onToggle={() => { setFarmAlerts(!farmAlerts) }} />
              <Text>Farm alerts</Text>
            </HStack>
            { farmAlerts &&
              <HStack alignItems="center" mx={10} space={4}>
                <Alert variant="left-accent" w="100%" status="info">
                  <VStack space={2} flexShrink={1} w="100%">
                    <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                      <HStack space={2} flexShrink={1} alignItems="center">
                        <Alert.Icon />
                        <Text>
                          At the dashboard you can configure alerts per farm
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </Alert>
              </HStack>
            }
            <Button
              mx={20}
              mt={10}
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