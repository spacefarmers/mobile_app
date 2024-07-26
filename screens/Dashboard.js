import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  FlatList,
  Text,
  Heading,
  Flex,
} from "native-base";
import FarmCard from "../components/FarmCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExpoToken } from '../helpers/notifications'

export default function DashboardScreen({ navigation }) {
  const [error, setError] = useState(null);
  const [expoToken, setExpoToken] = useState(null);
  const [farmSizes, setFarmSize] = useState({});
  const [farmPoints, setFarmPoints] = useState({});
  const [lastRefresh, setLastRefresh] = useState(0);
  const [farmIds, setFarmIds] = useState([]);

  useEffect(() => {
    async function getFarms() {
      setFarmIds([]);
      setFarmSize({});
      setFarmPoints({});
      let farmsStored = await AsyncStorage.getItem("@farmIds");
      let farmArray = JSON.parse(farmsStored);
      if (farmArray.length > 0) {
        await loadExpoToken();
        farmArray.forEach(addFarm);
      }
    }

    navigation.addListener('focus', () => {
      getFarms();
    });

    getFarms();
  }, []);

  useEffect(() => {
    async function storeFarms() {
      await AsyncStorage.setItem("@farmIds", JSON.stringify(farmIds));
    }

    storeFarms();
  }, [farmIds]);

  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  const loadExpoToken = async () => {
    try {
      const token = await getExpoToken();
      setError(null);
      setExpoToken(token);
    } catch (error) {
      setExpoToken(null);
      setError(error.toString());
    }
  };

  const addFarm = async (id) => {
    setFarmIds((ids) => ids.concat(id).filter(unique));
  };

  const removeFarm = async (index) => {
    var newIds = [...farmIds];
    newIds.splice(index, 1);
    setFarmIds(newIds);
  };

  const renderItem = ({ farm }) => (
    <Center>
      <FarmCard farm={farm} />
    </Center>
  );

  return (
    <Box>
      <Center pt="4" mb="1">
        <Box
          w="90%"
          maxW="400"
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700",
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.50",
          }}
        >
          <Flex
            direction="row"
            mb="2.5"
            mt="1.5"
            _text={{
              color: "coolGray.800",
            }}
          >
            <Box width="50%" px="4">
              <Text
                fontSize="xs"
                _light={{
                  color: "info.700",
                }}
                _dark={{
                  color: "blue.600",
                }}
                fontWeight="500"
              >
                Total size
              </Text>
              <Heading size="md">
                {Math.round(
                  Object.values(farmSizes).reduce((a, b) => a + b, 0) * 100
                ) / 100}{" "}
                TiB
              </Heading>
            </Box>
            <Box width="50%" px="4">
              <Text
                fontSize="xs"
                _light={{
                  color: "info.700",
                }}
                _dark={{
                  color: "blue.600",
                }}
                fontWeight="500"
                textAlign="right"
              >
                Total points
              </Text>
              <Heading size="md" textAlign="right">
                {Object.values(farmPoints).reduce((a, b) => a + b, 0)}
              </Heading>
            </Box>
          </Flex>
        </Box>
      </Center>
      { error != null && farmIds.length > 0 ? (
        <Center>
          <Box
            pt="4"
            w="90%"
            maxW="400"
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            borderWidth="1"
            style={{ backgroundColor: "#F2C14E", margin: 20 }}
            _dark={{
              borderColor: "coolGray.600",
              backgroundColor: "gray.700",
            }}
            _web={{
              shadow: 2,
              borderWidth: 0,
            }}
            _light={{
              backgroundColor: "gray.50",
            }}>
            <Center>
              <Heading size="sm">Heads up!</Heading>
              <Text p="3">{error}</Text>
            </Center>
          </Box>
        </Center>
      ) : ( <Box mb="4"></Box> ) }
      { farmIds.length == 0 ? (
        <Center>
          <Box
            pt="4"
            w="90%"
            maxW="400"
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            borderWidth="1"
            _dark={{
              borderColor: "coolGray.600",
              backgroundColor: "gray.700",
            }}
            _web={{
              shadow: 2,
              borderWidth: 0,
            }}
            _light={{
              backgroundColor: "gray.50",
            }}
          >
            <Center>
              <Heading size="sm">Personal farms</Heading>
              <Text p="3" textAlign='center'>Find your farm in the farmers list to add it to this dashboard.</Text>
            </Center>
          </Box>
        </Center>
      ) : (
        <FlatList
          w="100%"
          data={farmIds}
          keyExtractor={(item, index) => item}
          onRefresh={() => setLastRefresh(lastRefresh + 1)}
          refreshing={false}
          renderItem={({ item, index }) => (
            <Center>
              <FarmCard
                farmId={item}
                index={index}
                addSize={setFarmSize}
                addPoints={setFarmPoints}
                removeFarm={removeFarm}
                lastRefresh={lastRefresh}
                expoToken={expoToken}
                onClick={() => navigation.navigate('Farmer', { farmId: item })}
              />
            </Center>
          )}
          ListFooterComponent={
            <Box h="100" />
          }
        />
      )}
      
    </Box>
  );
}
