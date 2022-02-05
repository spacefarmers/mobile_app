import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  View,
  FlatList,
  Text,
  Heading,
  Flex,
  Icon,
  Button,
} from "native-base";
import FarmCard from "../components/FarmCard";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DashboardScreen({ navigation }) {
  const [showFarmAddModal, setFarmAddModal] = useState(false);
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
      farmArray.forEach(addFarm);
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
    <View>
      <Center pt="4" mb="4">
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
      { farmIds.length == 0 ? (
        <Center>
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
            <Text p="3" textAlign='center'>Lookup your farm in the farmers list to add it to the dashboard</Text>
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
                onClick={() => navigation.navigate('Farmer', { farmId: item })}
              />
            </Center>
          )}
          ListFooterComponent={
            <View h="100" />
          }
        />
      )}
      
    </View>
  );
}
