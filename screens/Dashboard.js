import React, { useState } from "react"
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

export default function DashboardScreen() {
  const [showFarmAddModal, setFarmAddModal] = useState(false);
  const [farmSizes, addSize] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [farmIds, setFarmIds] = useState(['904b6b9dcd7a7f7964bc001d1fa20371a9f4914de0501226a8223e472cc0b00a']);
  // const [farmIds, setFarmIds] = useState(['f7e4ca9cacd0f8e500ece3bb4dddeffe1530e5a989ad90c1298380ffa91578e2']);

  const unique = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const addPoints = async (points) => {
    setTotalPoints((totalPoints) => totalPoints + points);
  };

  const addFarm = (id) => {
    setFarmIds(ids => ids.concat(id).filter(unique));
  }

  const removeFarm = (index) => {
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
                {Object.values(farmSizes).reduce((a, b) => a + b, 0)} TiB
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
                {totalPoints}
              </Heading>
            </Box>
          </Flex>
        </Box>
      </Center>
        <FlatList
          pt="4"
          data={farmIds}
          renderItem={({ item, index }) => (
            <Center>
              <FarmCard farmId={item} index={index} addSize={addSize} addPoints={addPoints} removeFarm={removeFarm} />
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
