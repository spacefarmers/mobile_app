import React, { useState, useEffect } from "react";
import { Box, ScrollView, Center, Text, Heading, Spinner, Button, Icon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FarmScreen({ route }) {
  const { farmId } = route.params;
  const [dashboardFarms, setDashboardFarms] = useState([]);
  const [farm, setFarm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardFarms();
    getFarm();
  }, [farmId]);

  useEffect(() => {
    async function storeFarms() {
      await AsyncStorage.setItem("@farmIds", JSON.stringify(dashboardFarms));
    }

    storeFarms();
  }, [dashboardFarms]);

  async function getDashboardFarms() {
    let farmsStored = await AsyncStorage.getItem("@farmIds");
    setDashboardFarms(JSON.parse(farmsStored));
  }

  async function addToDashboard() {
    setDashboardFarms((ids) => ids.concat(farm.id).filter(unique));
  }

  async function removeFromDashboard() {
    const index = dashboardFarms.indexOf(farm.id);
    var newIds = [...dashboardFarms];
    newIds.splice(index, 1);
    setDashboardFarms(newIds);
  };

  async function getFarm() {
    setLoading(true);
    console.log(farmId);
    const response = await fetch(
      "https://spacefarmers.io/api/farmers/" + farmId
    );
    const json = await response.json();
    setFarm(json.data);
    setLoading(false);
  }

  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  const addFarm = async (id) => {
  };

  return (
    <ScrollView py="4">
      <Center>
        {loading ? (
          <Spinner flex={1} size="lg" />
        ) : (
          <Box maxW="1000" w="90%">
            <Center>
              <Heading>{farm.attributes.farmer_name}</Heading>
            </Center>
            <Box
              p="3"
              mt="3"
              rounded="lg"
              overflow="hidden"
              borderColor="coolGray.200"
              borderWidth="1"
              minHeight="300"
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
              <Text
                pt="2"
                _light={{
                  color: "info.700",
                }}
                _dark={{
                  color: "blue.600",
                }}
                fontWeight="500"
              >
                Launcher ID
              </Text>
              <Heading size="md" numberOfLines={1} ellipsizeMode="middle">
                {farm.id}
              </Heading>
              { dashboardFarms.includes(farm.id) ? (
                <Button
                  w="180"
                  colorScheme="gray"
                  onPress={() => {
                    removeFromDashboard();
                  }}
                >
                  Remove from dashboard
                </Button>
              ) : (
                <Button
                  w="180"
                  colorScheme="darkBlue"
                  onPress={() => {
                    addToDashboard();
                  }}
                >
                  Add to dashboard
                </Button>
              ) }
              <Text
                pt="2"
                _light={{
                  color: "info.700",
                }}
                _dark={{
                  color: "blue.600",
                }}
                fontWeight="500"
              >
                Size
              </Text>
              <Heading size="md">{farm.attributes.tib_24h} TiB</Heading>

              <Text
                pt="2"
                _light={{
                  color: "info.700",
                }}
                _dark={{
                  color: "blue.600",
                }}
                fontWeight="500"
              >
                Points
              </Text>
              <Heading size="md">{farm.attributes.points_24h}</Heading>

              <Text
                pt="2"
                _light={{
                  color: "info.700",
                }}
                _dark={{
                  color: "blue.600",
                }}
                fontWeight="500"
              >
                Share
              </Text>
              <Heading size="md">{farm.attributes.ratio_24h}%</Heading>

              <Text
                pt="2"
                _light={{
                  color: "info.700",
                }}
                _dark={{
                  color: "blue.600",
                }}
                fontWeight="500"
              >
                Effort
              </Text>
              <Heading size="md">{farm.attributes.current_effort}%</Heading>
            </Box>
          </Box>
        )}
      </Center>
    </ScrollView>
  );
}
