import React, { useState, useEffect } from "react"
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
} from "native-base"
import FarmCard from "../components/FarmCard"
import FarmAddModal from "../components/FarmAddModal"
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen() {
  const [showFarmAddModal, setFarmAddModal] = useState(false);
  const [farmSizes, setFarmSize] = useState({});
  const [farmPoints, setFarmPoints] = useState({});
  const [lastRefresh, setLastRefresh] = useState(0);
  const [farmIds, setFarmIds] = useState([]);

  useEffect(() => {
    async function getFarms() { 
      farmsStored = await AsyncStorage.getItem('@farmIds');
      farmArray = JSON.parse(farmsStored);
      farmArray.forEach(addFarm);
    }

    getFarms();
  }, []);

  useEffect(() => {
    async function storeFarms() { 
      await AsyncStorage.setItem('@farmIds', JSON.stringify(farmIds));
    }

    storeFarms();
  }, [farmIds]);

  const unique = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const addFarm = async (id) => {
    setFarmIds(ids => ids.concat(id).filter(unique));
  }

  const removeFarm = async (index) => {
    var newIds = [...farmIds];
    newIds.splice(index, 1);
    setFarmIds(newIds);
  }

  const renderItem = ({ farm }) => (
    <Center>
      <FarmCard farm={farm} />
    </Center>
  );

  return (
    <View style={{ flex: 1 }}>
      <FarmAddModal addFarm={addFarm} showModal={showFarmAddModal} setShowModal={setFarmAddModal} />
      <Center pt="4">
        <Box
          maxW="80"
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          mb="3"
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
                  color: "blue.800",
                }}
                _dark={{
                  color: "blue.600",
                }}
                fontWeight="500"
                ml="-0.5"
                mt="-1"
              >
                Total size
              </Text>
              <Heading size="md" ml="-1">
                {Math.round(Object.values(farmSizes).reduce((a, b) => a + b, 0) * 100) / 100} TiB
              </Heading>
            </Box>
            <Box width="50%" px="4">
            <Text
                fontSize="xs"
                _light={{
                  color: "blue.800",
                }}
                _dark={{
                  color: "blue.600",
                }}
                fontWeight="500"
                ml="-0.5"
                mt="-1"
              >
                Total points (24H)
              </Text>
              <Heading size="md" ml="-1">
                {Object.values(farmPoints).reduce((a, b) => a + b, 0)}
              </Heading>
            </Box>
          </Flex>
        </Box>
      </Center>
        <FlatList
          pt="4"
          data={farmIds}
          onRefresh={() => setLastRefresh(lastRefresh + 1)}
          refreshing={false}
          renderItem={({ item, index }) => (
            <Center>
              <FarmCard farmId={item} index={index} addSize={setFarmSize} addPoints={setFarmPoints} removeFarm={removeFarm} lastRefresh={lastRefresh} />
            </Center>
          )}
          ListFooterComponent={() => (
            <Center pt="4" pb="10">
              <Button
                colorScheme="blue"
                variant="outline"
                leftIcon={<Icon as={Ionicons} name="add-outline" size="sm" />}
                onPress={() => { setFarmAddModal(true); }}
              >
                Add farm
              </Button>
            </Center>
          )}
          keyExtractor={({ id }, index) => index}
        />
    </View>
  )
}
